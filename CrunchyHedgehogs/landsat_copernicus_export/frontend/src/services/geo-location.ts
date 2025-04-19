/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents information about a geographical location.
 */
export interface GeoLocationInfo {
  /**
   * The display name of the location.
   */
displayName: string;
  /**
   * The latitude and longitude coordinates of the location.
   */
  location: Location;
}

/**
 * Asynchronously retrieves geographic information for a given location based on latitude and longitude.
 *
 * @param location The location for which to retrieve geographic data.
 * @returns A promise that resolves to a GeoLocationInfo object containing the display name and coordinates.
 */
export async function getGeoLocationInfo(location: Location): Promise<GeoLocationInfo> {
  // TODO: Implement this by calling an API.

  return {
    displayName: 'Some Location',
    location: {
      lat: location.lat,
      lng: location.lng,
    },
  };
}

/**
 * Fetches project data from the backend API.
 *
 * @returns A promise that resolves to the project data.
 */
export async function getProjectData(): Promise<any> {
  try {
    const response = await fetch('http://localhost:5000/api/get_project_data');
    if (!response.ok) {
      throw new Error(`Failed to fetch project data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching project data:', error);
    throw new Error(`Failed to fetch project data: ${error.message}`);
  }
}

/**
 * Fetches user data from the backend API.
 *
 * @returns A promise that resolves to the user data.
 */
export async function getUserData(): Promise<any> {
  try {
    const response = await fetch('http://localhost:5000/api/get_user_data');
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}
