"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCreateCheckoutSession } from "@/services/api/payments/use-create-checkout-session";

export default function UpgradePlan({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { mutate, isPending } = useCreateCheckoutSession();

  return (
    <Card className={cn("", className)}>
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button
          size="sm"
          className="w-full"
          disabled={isPending}
          onClick={() => {
            mutate({
              id: "clzst0sv8000012hr5gtuszpe",
            });
          }}
        >
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
}
