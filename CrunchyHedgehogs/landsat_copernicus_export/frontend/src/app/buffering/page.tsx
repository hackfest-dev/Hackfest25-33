"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarLayout from "@/components/sidebar-layout";

const BufferingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectName = searchParams.get('projectName') || '';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectName) {
      const checkStatus = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/get_project_status/${projectName}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch project status: ${response.statusText}`);
          }
          const data = await response.json();

          if (data.completed) {
            // Assuming project ID and construction goals are returned in the response
            const projectId = projectName; // Replace with actual project ID if available
            const constructionGoals = "Sample Goals"; // Replace with actual construction goals if available
            router.push(
              `/project-data?projectId=${projectId}&constructionGoals=${constructionGoals}`
            );
          } else {
            // If not completed, check again after a delay
            setTimeout(checkStatus, 2000);
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        }
      };

      checkStatus();
    }
  }, [projectName, router]);

  return (
    <SidebarLayout>
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        {error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : (
          <p className="mt-4">
            Loading project data...{" "}
            {projectName ? `for ${projectName}` : ""}
          </p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default BufferingPage;

