import db from "@/db/db";
import { Info } from "./_components/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";
import { checkSubscription } from "@/lib/subscription";

export default async function OrganizationPage() {
 
  const boards = await db.board.findMany()

  const isPro = await checkSubscription()

  return (
    <div className="flex flex-col space-y-4">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
        </Suspense>
      </div>
    </div>
  );
}
