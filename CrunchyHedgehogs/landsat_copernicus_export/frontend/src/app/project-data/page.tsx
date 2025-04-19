"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarLayout from "@/components/sidebar-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageSelector from "@/components/ImageSelector";
import { Skeleton } from "@/components/ui/skeleton";


const ProjectDataPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  //Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = searchParams.get('projectId') || ''; // Provide a default value
  const constructionGoals = searchParams.get('constructionGoals') || '';
  
  const [projectName, setProjectName] = useState('');
  const [satelliteImage, setSatelliteImage] = useState("/Anisha_Landsat_Image.png");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      const project = projects.find((p: { id: string | null }) => p.id === projectId);
      if (project) {
        setProjectName(project.name);
      }
    }
  }, [projectId]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/get_latest_image/${projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const data = await response.json();
        setSatelliteImage(`/${projectId}_Landsat_Image.png`);
      } catch (err) {
        console.log("Error:",err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    if (projectId) {
      fetchImage();
    } else {
      setLoading(false);
      setError("Project ID not found.");
    }
  }, [projectId]);


  if (loading) {
    return <Skeleton className="w-[100px] h-[20px]" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }


  const handleROISelection = async (points: { x: number; y: number }[]) => {
    try {
      setIsProcessing(true);
        
      if (!analysisResponse.ok) throw new Error("Analysis failed");
      const analysisData = await analysisResponse.json();
      setAnalysisPoint(analysisData.coordinates);

      // Process ROI
      const roiResponse = await fetch("http://localhost:5000/api/process_roi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectId,
          points: points.map((p) => [p.x, p.y]),
          analysis_point: analysisData.coordinates,
        }),
      });

      if (!roiResponse.ok) throw new Error("ROI processing failed");
      const roiData = await roiResponse.json();

      setProcessedImage(roiData.image_path);
    } catch (error) {
      console.error("Error processing ROI:", error);
      alert("Failed to process ROI. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    router.push("/dashboard");
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Satellite Map with ROI Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Map</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="relative w-full h-[300px] flex justify-center items-center">
                {loading && !processedImage && <Skeleton className="w-full h-full" />}
                 {processedImage ? (
                <Image
                  src={processedImage}
                  alt="Processed Satellite Map"
                  fill
                  className="object-contain object-center"
                />
                ) :
                 (
                  <Image
                    src={satelliteImage}
                    alt="Satellite Image"
                    fill
                    className="object-contain object-center"
                  />
                ) : (
                  <ImageSelector
                    imageUrl={satelliteImage}
                    onSelectionComplete={handleROISelection}
                    projectId={projectId}
              />
            {isProcessing && (
              <div className="mt-4 text-center text-muted-foreground">
                Processing ROI and analysis...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Construction Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Construction Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={constructionGoals || ""}              
              className="min-h-[200px] bg-muted"
            />
          </CardContent>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of your existing cards... */}

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-primary text-primary-foreground hover:bg-primary/80 px-8 py-4"
          >
            Save Project
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDataPage;