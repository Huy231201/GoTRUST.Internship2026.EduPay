
// components/layout/app-sidebar/app-sidebar.tsx
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarTrigger, useSidebar, SidebarFooter } from "@/components/ui/sidebar";
import logo from "@/assets/edupay-logo.png";
import { menuItems } from "./sidebar-menu";
import { NavMenuItem } from "./nav-menu-item";

export function AppSidebar() {
  const { state } = useSidebar();

  // Kiểm tra trạng thái mở rộng
  const isExpanded = state === "expanded";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-gray-200 max-w-[200px] shadow-md">
      <SidebarHeader className={`flex flex-row items-center p-4 h-16 border-b border-gray-200 gap-4 ${isExpanded ? "justify-between" : "justify-center"}`}>
        
        {/* Chỉ hiển thị khối Logo khi Sidebar đang mở rộng */}
        {isExpanded && (
          <div className="flex items-center gap-2 overflow-hidden transition-all">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-8 h-8 rounded-md border border-gray-200/50 p-0.5 flex-shrink-0" 
            />
            <div className="flex flex-col justify-center whitespace-nowrap">
              <span className="font-bold text-md">EduPay Portal</span>
              <span className="text-[11px] font-semibold text-[#97969a]">Phiên bản 1.0.0</span>
            </div>
          </div>
        )}

        {/* Nút Trigger luôn hiển thị, nhưng sẽ tự căn giữa khi đóng nhờ justify-center ở cha */}
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <NavMenuItem 
              key={item.id}
              item={item}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-4 flex items-center justify-center">
        {isExpanded && (
          <span className="text-[11px] text-[#97969a] font-semibold text-center">
            © 2024 EduPay Portal System
          </span>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}


