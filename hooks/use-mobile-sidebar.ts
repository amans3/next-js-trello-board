import { create } from "zustand"

type MobileSidearStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useMobileSidebar = create<MobileSidearStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })    
}))
