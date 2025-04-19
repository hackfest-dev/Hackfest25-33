import os
import time
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2.credentials import Credentials
from config import DRIVE_SETTINGS
from image_utils import ImageConverter

class DriveManager:
    def __init__(self):
        self.service = self._authenticate()
        self._create_download_dirs()
    
    def _create_download_dirs(self):
        """Create all necessary download directories"""
        os.makedirs(DRIVE_SETTINGS['download_dir'], exist_ok=True)
        os.makedirs(
            os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['landsat_dir']),
            exist_ok=True
        )
        os.makedirs(
            os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['copernicus_dir']),
            exist_ok=True
        )

    def _authenticate(self):
        """Authenticate with Google Drive API"""
        creds = Credentials.from_authorized_user_file(
            DRIVE_SETTINGS['token_file'],
            ['https://www.googleapis.com/auth/drive']
        )
        return build('drive', 'v3', credentials=creds)

    def _get_download_path(self, folder_type, file_name):
        """Get the appropriate download path based on file type"""
        if folder_type == 'landsat':
            subdir = DRIVE_SETTINGS['landsat_dir']
        elif folder_type == 'copernicus':
            subdir = DRIVE_SETTINGS['copernicus_dir']
        else:
            subdir = ''
        
        return os.path.join(DRIVE_SETTINGS['download_dir'], subdir, file_name)

    def wait_for_export(self, folder_name, file_prefix, timeout=300, interval=10):
        """Wait for Earth Engine export to complete"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            results = self.service.files().list(
                q=f"'{self._get_folder_id(folder_name)}' in parents and name contains '{file_prefix}'",
                fields="files(id, name)"
            ).execute()
            files = results.get('files', [])
            
            if files:
                return files[0]
            time.sleep(interval)
        raise TimeoutError(f"Export not found after {timeout} seconds")

    def _get_folder_id(self, folder_name):
        """Get folder ID by name"""
        results = self.service.files().list(
            q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'",
            fields="files(id)"
        ).execute()
        folders = results.get('files', [])
        return folders[0]['id'] if folders else None

    def download_file(self, file_id, file_name, folder_type):
        """Download file from Google Drive to appropriate folder"""
        request = self.service.files().get_media(fileId=file_id)
        file_path = self._get_download_path(folder_type, file_name)
        
        with open(file_path, 'wb') as f:
            downloader = MediaIoBaseDownload(f, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
                print(f"Download {int(status.progress() * 100)}%")
        
        print(f"Downloaded: {file_path}")
        return file_path

    def delete_file(self, file_id):
        """Delete file from Google Drive"""
        self.service.files().delete(fileId=file_id).execute()
        print(f"Deleted file ID: {file_id}")

    def process_export(self, folder_name, file_prefix, folder_type):
        """Complete workflow: wait, download, and delete"""
        try:
            # Wait for export to complete
            file_info = self.wait_for_export(folder_name, file_prefix)
            
            # Download the file to appropriate folder
            local_path = self.download_file(
                file_info['id'],
                file_info['name'],
                folder_type
            )
            
            # Delete from Drive
            
            self.delete_file(file_info['id'])
            
            return local_path
        except Exception as e:
            print(f"Error processing export: {e}")
            return None

    def download_file(self, file_id, file_name, folder_type):
        """Download file and convert to PNG"""
        request = self.service.files().get_media(fileId=file_id)
        file_path = self._get_download_path(folder_type, file_name)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Download TIFF
        with open(file_path, 'wb') as f:
            downloader = MediaIoBaseDownload(f, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
                print(f"Download {int(status.progress() * 100)}%")
        
        print(f"Downloaded: {file_path}")
        
        # Convert to PNG
        png_path = ImageConverter.tif_to_png(file_path)
        return png_path if png_path else file_path
    
    def delete_all_files_in_drive_folder(self, folder_name):
        """
        Delete all files from a Google Drive folder (preserves the empty folder)
        
        Args:
            folder_name (str): Name of the folder in Google Drive
        
        Returns:
            tuple: (success_count, failure_count)
        """
        success = 0
        failure = 0
        
        try:
            # Get folder ID
            folder_id = self._get_folder_id(folder_name)
            if not folder_id:
                print(f"Google Drive folder not found: {folder_name}")
                return (0, 0)
            
            # List all files in the folder
            results = self.service.files().list(
                q=f"'{folder_id}' in parents",
                fields="files(id, name)",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True
            ).execute()
            files = results.get('files', [])
            
            # Delete each file
            for file in files:
                try:
                    self.service.files().delete(
                        fileId=file['id'],
                        supportsAllDrives=True
                    ).execute()
                    print(f"Deleted from Drive: {file['name']}")
                    success += 1
                except Exception as e:
                    print(f"Failed to delete {file['name']}: {str(e)}")
                    failure += 1
            
            print(f"Google Drive cleanup complete for '{folder_name}'")
            print(f"Results - Success: {success}, Failures: {failure}")
            return (success, failure)
            
        except Exception as e:
            print(f"Google Drive cleanup error: {str(e)}")
            return (success, failure)


    