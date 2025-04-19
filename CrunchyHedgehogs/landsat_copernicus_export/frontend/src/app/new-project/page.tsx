"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import SidebarLayout from "@/components/sidebar-layout";
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center border rounded-md bg-gray-100">
        Loading map...
      </div>
    )
  }
);

const NewProjectForm = () => {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState({
    displayName: "No location selected",
    coordinates: { lat: 0, lng: 0 },
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLocationSelect = useCallback((loc: {
    displayName: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setLocation(loc);
  }, []);

  const startProcessing = async (projectId: string, coordinates: { lat: number, lng: number }) => {
    try {
      setIsProcessing(true);
      
      const response = await fetch('http://localhost:5000/api/process_coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [[coordinates.lat, coordinates.lng]],
          project_name: projectId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start processing');
      }

      const data = await response.json();
      console.log('Processing started:', data);
      
      // Redirect to buffering page
      router.push(`/buffering?projectName=${projectId}`);
      
    } catch (error) {
      console.error('Error starting processing:', error);
      alert('Failed to start processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (location.coordinates.lat === 0 && location.coordinates.lng === 0) {
      alert("Please select a location on the map");
      return;
    }

    const projectId = uuidv4();
    const newProject = {
      id: projectId,
      name: projectName || "Unnamed Project",
      location: location.displayName,
      coordinates: location.coordinates,
      satelliteImageUrl: "https://picsum.photos/800/600",
    };

    // Save to local storage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    localStorage.setItem('projects', JSON.stringify([...projects, newProject]));

    // Start backend processing
    await startProcessing(projectId, location.coordinates);
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Create New Project</h1>
        <div className="flex flex-col space-y-4">
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="max-w-md"
          />

          <div className="border rounded-md overflow-hidden" style={{ height: '400px' }}>
            <MapWithNoSSR 
              onLocationSelect={handleLocationSelect}
              className="h-full w-full"
            />
          </div>

          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Selected Location</h3>
            <p className="font-mono text-sm">{location.displayName}</p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={location.coordinates.lat === 0 && location.coordinates.lng === 0 || isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/80 w-fit"
          >
            Create Project
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default NewProjectForm;