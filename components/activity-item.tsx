import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { generateAuditLog } from "@/lib/generate-log-message";
import { format } from "date-fns"
interface ActiivtyItemProps {
    data: AuditLog
}

export function ActivityItem({data}: ActiivtyItemProps) {
    return (
        <li className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage} />
            </Avatar>
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold lowercase text-neutral-700">
                        {data.userName}
                    </span>
                    {" "}{generateAuditLog(data)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {format(new Date(data.createdAt), "MMM d, yyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    )
}