import React from "react";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { CheckCircle2Icon } from "lucide-react";
import { useAuth } from '@/context/AuthProvider';
import { useTitle } from '@/hooks/useTitle.ts';

export default function RouteComponent({
  title = "Factions",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {

  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    throw new Response('Unauthorized', { status: 401 })
  }

  useTitle(title)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/panel">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Testing Panel</AlertTitle>
            <AlertDescription>
              This is a test panel for the faction system.
            </AlertDescription>
            <AlertDescription>
              This is an alert with icon, title and description.
            </AlertDescription>
          </Alert>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
