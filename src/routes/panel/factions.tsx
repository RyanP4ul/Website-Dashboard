import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/features/panel/factions/index.tsx";
import PanelLayout from "../../features/panel/components/panel-layout.tsx";
import { AccessLevels } from "@/constants/accessLevel.ts";

export const Route = createFileRoute("/panel/factions")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PanelLayout title="Factions" accessLevel={AccessLevels.MODERATOR}>
      <Page />
    </PanelLayout>;
}
