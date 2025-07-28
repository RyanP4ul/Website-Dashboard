import { AccessLevels } from '@/constants/accessLevel';
import { Page } from '@/features/panel/areas';
import PanelLayout from '@/features/panel/components/panel-layout';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/panel/areas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PanelLayout title="Areas" accessLevel={AccessLevels.MODERATOR}>
        <Page />
      </PanelLayout>;
}