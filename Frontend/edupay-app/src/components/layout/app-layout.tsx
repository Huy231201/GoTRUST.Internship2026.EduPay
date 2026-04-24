import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./sidebar/app-sidebar"
import { AppHeader } from "./app-header"
import { Toaster } from "../ui/sonner"

export default function AppLayout() {
  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
      >
        <AppHeader />
        <main className="flex-1 p-4 bg-[#F7F6FB] overflow-y-auto custom-scrollbar">
          <Outlet />
          <Toaster position="top-right"/>
        </main>
      </SidebarInset>

    </SidebarProvider>
  )
}