"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SidebarLayout from "@/components/sidebar-layout";
import Image from "next/image"; 

interface SatelliteImagePageProps {
  searchParams: { projectId: string };
}

const SatelliteImagePage: React.FC<SatelliteImagePageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [constructionGoals, setConstructionGoals] = useState("");
  const [satelliteImageUrl, setSatelliteImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const projectId = searchParams.projectId;

  useEffect(() => {
    const loadImage = () => {
      const imagePath = `/landsat_images/${projectId}_Landsat_Image.png`;
      setSatelliteImageUrl(imagePath);
      setIsLoading(false)
      
    };

    loadImage();
  }, [projectId]); // Re-run when projectId changes

  const handleGo = () => {
    router.push(`/project-data?projectId=${projectId}&constructionGoals=${encodeURIComponent(constructionGoals)}`);
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-6">Project Satellite Image</h1>
        
        {isLoading ? (
          <div className="h-[375px] flex items-center justify-center bg-gray-100 rounded-md">
            Loading image...
          </div>
        ) : (
          <div className="flex flex-row items-start space-x-6">
            {/* Image container - left side */}
            <div className="rounded-md shadow-md w-[500px] h-[375px] relative">
              <Image
                src={satelliteImageUrl}
                alt="Satellite Image"
                fill
                className="rounded-md object-cover"
                priority
                onError={() => {
                  // Fallback if image fails to load
                  setSatelliteImageUrl(`/project-images/${projectId}_Landsat_Image.png`);
                }}
              />
            </div>
            
            {/* Construction goals - right side */}
            <div className="flex flex-col space-y-4 w-[400px]">
              <h2 className="text-lg font-medium">Construction Goals</h2>
              <textarea
                placeholder="Enter your construction goals here..."
                value={constructionGoals}
                onChange={(e) => setConstructionGoals(e.target.value)}
                className="w-full h-[300px] p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-start mt-6">
          <Button 
            onClick={handleGo} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-[150px] h-10 text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SatelliteImagePage;