import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { Suspense } from "react";
import { ActivityList } from "./_components/ActivityList";
import { checkSubscription } from "@/lib/subscription";

export default async function ActivityPage() {
    
    const isPro = await checkSubscription()

    return (
        <div className="w-full">
        <Info isPro={isPro} />
        <Separator />
        <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />

        </Suspense>
        </div>
    )
}