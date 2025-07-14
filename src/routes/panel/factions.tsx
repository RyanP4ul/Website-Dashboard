import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/panel/factions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/panel/factions"!</div>
}
