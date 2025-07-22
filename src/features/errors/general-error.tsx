import { useNavigate, useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
  error?: unknown;
}

export default function GeneralError({
  className,
  minimal = false,
  error,
}: GeneralErrorProps) {
  const navigate = useNavigate();
  const { history } = useRouter();

  if (error instanceof Response && error.status === 401) {
    setTimeout(() => {
      navigate({ to: '/login' })
    }, 3000)

    return (
      <div className={cn("h-svh w-full", className)}>
        <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
          <h1 className="text-[5rem] leading-tight font-bold">401</h1>
          <span className="font-medium">Unauthorized</span>
          <p className="text-muted-foreground text-center">
            You are not authorized to view this page. Redirecting to login...
          </p>
          <div className="mt-6 flex gap-4">
            <Button onClick={() => navigate({ to: "/login" })}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-svh w-full", className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {!minimal && (
          <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        )}
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground text-center">
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className="mt-6 flex gap-4">
            <Button variant="outline" onClick={() => history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}
