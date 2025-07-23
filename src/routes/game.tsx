import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    
<object type="application/x-shockwave-flash" id="AQWGame" className="" name="flashContent" data="http://localhost:3000/game/swf?path=loader_6.swf&deviceType=Browser" width="1280" height="700">
  <param name="LOOP" value="false" />
  <param name="SCALE" value="exactfit" />
  <param name="allowScriptAccess" value="always" />
  <param name="allowFullScreen" value="true" />
  <param name="menu" value="false" />
  <param name="flashvars" value="" />
</object>
    
    </>
  );
}
