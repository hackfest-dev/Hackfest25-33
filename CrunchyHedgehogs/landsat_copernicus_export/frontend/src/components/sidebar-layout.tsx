"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import Link from "next/link";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard">
            <h1 className=" font-semibold flex items-center" style={{  WebkitTextStroke: "1px black",  textShadow: "2px 2px 4px #000000", fontSize: "36px" }}>
              <Home className="mr-2 h-5 w-5" />
              TARRAFLOW
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton>Dashboard</SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/new-project">
                  <SidebarMenuButton>New Project</SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} TARRAFLOW
          </p>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-4">{children}</main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
