import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  
  return (
    <>
      <h1>TEST</h1>
    </>
  );
}
