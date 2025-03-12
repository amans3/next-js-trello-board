import { ReactNode } from "react";

interface ListWrapperProps {
    children: ReactNode
}
 
export function ListWrapper({ children }:ListWrapperProps) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            {children}
        </li>
    )
}