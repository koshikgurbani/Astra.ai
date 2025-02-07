import React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import SideBarFooter from './SideBarFooter'


function AppSideBar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-5">
                <Image src={'/astra-logo.png'} alt='Logo' width={80} height={40} />
            </SidebarHeader>
            <SidebarContent className="p-5 scrollbar-hide">
                <Button> <MessageCircleCode />Start New chat</Button>
                <SidebarGroup />
                <WorkspaceHistory />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <SideBarFooter />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar
