"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useCardModal } from "@/hooks/use-card-modal"
import { fetcher } from "@/lib/fetchers"
import { CardWithList } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { Header } from "./header"
import { Description } from "./description"
import { Actions } from "./actions"
import { AuditLog } from "@prisma/client"
import { Activity } from "./activity"

export function CardModal() {
    const { id, isOpen, onClose } = useCardModal
    ((state) => state)

    const {data:cardData} = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`)
    })

    const {data:auditLogsData} = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`)
    })


    console.log(cardData)
    console.log(auditLogsData)

     return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>
                    {!cardData 
                    ? <Header.Skeleton /> 
                    : <Header data={cardData} />
                    }
                </DialogTitle>
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {!cardData 
                            ? <Description.Skeleton />
                            : <Description data={cardData} />
                            }
                             {!auditLogsData 
                            ? <Activity.Skeleton />
                            : <Activity items={auditLogsData} />
                            }
                        </div>
                    </div>
                    {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
                </div>    
            </DialogContent>
        </Dialog>
    )
}