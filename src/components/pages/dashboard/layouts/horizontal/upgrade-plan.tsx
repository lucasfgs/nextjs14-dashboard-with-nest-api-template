"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthentication } from "@/components/providers/authentication";

interface UpgradePlanProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UpgradePlan({ className, ...props }: UpgradePlanProps) {
  const { user } = useAuthentication();

  if (!user) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
        <p className="text-sm text-muted-foreground">
          Get access to all features and unlimited usage.
        </p>
        <Button className="mt-4 w-full">Upgrade Now</Button>
      </div>
    </div>
  );
}
