import { createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { useTitle } from '@/hooks/useTitle'
import { TrendingUp, Users } from 'lucide-react'

export const Route = createFileRoute('/panel/')({
  component: Dashboard,
})

const StatCard = ({ title, value, icon: Icon, description, change }: any) => (
  <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-card hover:shadow-glow transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
      {change && (
        <p className="text-xs text-success flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{change}% from last month
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

function Dashboard() {

  useTitle('Home')

  return (
      <SidebarProvider style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <StatCard
              title="Total Registered"
              value="10"
              icon={Users}
              change={12}
              description="Active user accounts"
            />
              
              <StatCard
                title="Total Factions"
                value="5"
                icon={Users}
                change={8}
                description="Number of factions created"
              />
              <StatCard
                title="Total Posts"
                value="100"
                icon={TrendingUp}
                change={15}
                description="Posts made by users"
              />

            </div>
          </div>

        </SidebarInset>
      </SidebarProvider>
  );
}
