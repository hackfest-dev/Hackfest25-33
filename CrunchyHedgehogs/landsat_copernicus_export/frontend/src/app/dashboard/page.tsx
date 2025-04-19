"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarLayout from "@/components/sidebar-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter, // Import AlertDialogFooter
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import {toast} from "@/hooks/use-toast";

import { getProjectData, getUserData } from "@/services/geo-location"; // Import the functions



interface Project {
  id: string; // Changed id to string
  name: string;
  location: { displayName: string; coordinates: Coordinates };

  satelliteImageUrl: string; // Added satellite image URL
}




const ProjectDashboard = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null); // Changed to string
  const [open, setOpen] = useState(false);

   const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectData, setProjectData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
   const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

   useEffect(() => {
    fetchProjects();
  }, [router]);
  


  useEffect(() => {
    // Save projects to local storage whenever projects state changes
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectData();
        const userData = await getUserData();
        setProjectData(projectData);
        setUserData(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleCreateProject = () => {
    router.push("/new-project");
  };

  const handleDeleteConfirmation = (projectId: string) => { // Changed to string
    setProjectIdToDelete(projectId);
    setOpen(true);
  };

  const handleDeleteProject = () => {
    if (projectIdToDelete !== null) {
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectIdToDelete));
      setOpen(false);
      setProjectIdToDelete(null);
      toast({
        title: "Project deleted successfully.",
      });
    }
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
             <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/3"
              />
              

          <Button onClick={handleCreateProject} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Create New Project
          </Button>
        </div>
        {loading && <p>Loading data...</p>}
        {error && <p>Error: {error}</p>}
        {projectData && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Project Name:</strong> {projectData.project_name}
              </p>
              <p>
                <strong>Description:</strong> {projectData.description}
              </p>
            </CardContent>
          </Card>
        )}

        {userData && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="text-center text-muted-foreground" style={{ fontSize: "30px" }}>
              Loading projects...
            </div>
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}
        {!loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-muted-foreground" style={{ fontSize: "30px" }}>
              No projects!
            </div>
            <video autoPlay loop muted playsInline width="300" height="200">
              <source src="https://www.vecteezy.com/video/27146699-black-male-scientist-looking-through-loupe-bw-outline-2d-character-animation-magnifying-glass-monochrome-linear-cartoon-4k-video-eyeglasses-man-animated-person-isolated-on-white-background" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.slice(0, 9).map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow duration-200 relative">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>Location: {project.location.displayName}</CardDescription>
                </CardHeader>
                <CardContent>
                   {project.satelliteImageUrl && (
                    <img
                      src={project.satelliteImageUrl}
                      alt="Satellite Image"
                      className="rounded-md shadow-md"
                    />)}
                     <CardDescription>Coordinates: {project.location.coordinates.lat}, {project.location.coordinates.lng}</CardDescription>
                     {!project.satelliteImageUrl && <div>No Image available</div>}
                </CardContent>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleDeleteConfirmation(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </Card>
            ))}
          </div>
        )}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to permanently delete this project?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDashboard;

