"use client"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useOrganization, useOrganizationList } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "usehooks-ts"
import NavItem, { Organization } from "./nav-item"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarProps {
    storageKey?: string
}
export default function Sidebar({ storageKey = "t-sidebar-state" }: SidebarProps) {

    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {})

    const { organization: activeOrganization,
        isLoaded: isLoadedOrg
     } = useOrganization()

     const { 
        userMemberships, 
        isLoaded: isLoadedOrgList
      } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
      })

      const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key: string) => {
        if(expanded[key]) {
            acc.push(key)
        }
        return acc
      }, [])

      function onExpand(id: string) {
        setExpanded(prev => {
            return {
                ...prev,
                [id]: !expanded[id]
            }
        })
      }

      if(!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (<>
            <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-10 bg-slate-300 w-[50%]" />
            <Skeleton className="h-10 bg-slate-300 w-10" />
            </div>
            <div className="space-y-2">
                <NavItem.Skeleton />
                <NavItem.Skeleton />
                <NavItem.Skeleton />
            </div>
        </>)
      }

    return (
        <>
        <div className="font-medium text-xs flex items-center mb-1">
            <span className="pl-4 text-xl">Workspaces</span>
            <Button type="button" className="ml-auto" size="icon" variant="ghost" asChild>
                <Link href="/select-org">
                    <Plus className="h-8 w-8" />
                </Link>
            </Button>
        </div>
        <Accordion 
            type="multiple" 
            defaultValue={defaultAccordionValue}
            className="space-y-2">
            {userMemberships.data.map(({ organization }) => (
                <NavItem 
                key={organization.id}
                isActive={activeOrganization?.id === organization.id}
                isExpanded={expanded[organization.id]}
                organization={organization as Organization}
                onExpand={onExpand}
                />
            ))}
        </Accordion>
        </>
    )
}