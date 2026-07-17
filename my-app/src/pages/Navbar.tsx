import { Link, useNavigate} from "react-router-dom";
import type {ReactNode} from "react";
import { signOut } from "../lib/auth";
import {
    DropdownMenu, 
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar, 
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"


export default function Navbar({children}: {children: ReactNode}){
    const navigate = useNavigate();

    async function handleLogOut() {
        try {
            await signOut();
        } catch (error) {
            console.error(error);
        }
        navigate("/login");
    }

    return(
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarTrigger/>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton render = {<Link to = "/dashboard" />}>
                                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render = {<Link to = "/budget"/>}>
                                    <span className="group-data-[collapsible=icon]:hidden">Budget</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton render = {<Link to = "/history"/>}>
                                    <span className="group-data-[collapsible=icon]:hidden">History</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <img 
                                    src = {"/profile-picture.webp"}
                                    alt = "Profile Image"
                                    className="size-8 rounded-full cursor-pointer"/>
                            }
                        />
                        <DropdownMenuContent align = "start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => navigate("/setting")}>Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogOut}>Log Out</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
