import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from "@/features/panel/factions/data-table.tsx";
import PanelLayout from '../../features/panel/components/panel-layout.tsx';

export const Route = createFileRoute('/panel/factions')({
  component: RouteComponent,
})

function RouteComponent() { 
  return (
    <PanelLayout title="Factions">
      <DataTable />
    </PanelLayout>
  )
}
