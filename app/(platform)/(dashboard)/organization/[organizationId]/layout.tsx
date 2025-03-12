import { ReactNode } from "react";
import OrgControl from "./_components/org-control";

import { startCase } from "lodash"
import { auth } from "@clerk/nextjs/server";

export async function generateMetaData() {
    const { orgSlug } = await auth()

    console.log("ORG SLUG:", orgSlug)

    return {
        title: startCase(orgSlug || "organization")   
    }
}


export default async function OrganizationIdLayout({ children }: { children: ReactNode }) {

    return (
        <>
            <OrgControl />
            {children}
        </>
    )
}