import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NotFoundError from "@/features/errors/not-found-error.tsx";
import GeneralError from "@/features/errors/general-error.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
})
