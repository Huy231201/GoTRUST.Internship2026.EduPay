

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";

// ✅ chỉ dùng cho "Khai báo dữ liệu"
function countChildren(item: any): number {
  if (!item.children || item.children.length === 0) return 0;

  return item.children.reduce((total: number, child: any) => {
    return total + 1 + countChildren(child);
  }, 0);
}

export function NavMenuItem({
  item,
  depth = 0
}: {
  item: any;
  depth?: number;
}) {
  const Icon = item.icon;

  const hasChildren =
    item.children && item.children.length > 0;

  const location = useLocation();

  const isActive =
    location.pathname === item.path;

  const isChildActive = hasChildren
    ? item.children.some((child: any) =>
        location.pathname.startsWith(child.path)
      )
    : false;

  const active = isActive;

  const activeStyles = active
    ? "bg-red-50 font-bold border-r-2 border-red-600"
    : "text-gray-600";

  const isKhaiBao =
    item.id === "ht-khai-bao-du-lieu";

  const childCount = isKhaiBao
    ? countChildren(item)
    : 0;

  // =========================================================
  // MENU CÓ CHILDREN
  // =========================================================

  if (hasChildren) {
    const content = (
      <>
        {depth > 0 ? (
          <>
            <ChevronRight className="ml-[15px] !size-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90 text-gray-500 group-data-[collapsible=icon]:hidden" />

            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>

            {childCount > 0 && (
              <span className="ml-auto text-xs text-gray-400 group-data-[collapsible=icon]:hidden">
                {childCount}
              </span>
            )}
          </>
        ) : (
          <>
            <ChevronRight className="!size-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90 text-gray-500 group-data-[collapsible=icon]:hidden" />

            {item.isSpecial ? (
              <div className="!w-4 !h-5 flex items-center justify-center border-gray-600 border">
                <Icon className="!size-3" />
              </div>
            ) : (
              Icon && <Icon className="!size-4" />
            )}

            <span className="font-medium text-md hover:text-red-600 group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>

            {childCount > 0 && (
              <span className="ml-auto text-xs text-gray-500 group-data-[collapsible=icon]:hidden">
                {childCount}
              </span>
            )}
          </>
        )}
      </>
    );

    // =========================
    // SUB MENU
    // =========================

    if (depth > 0) {
      return (
        <SidebarMenuSubItem>
          <Collapsible
            asChild
            defaultOpen={isChildActive}
          >
            <div>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  className={cn(
                    "flex items-center gap-2 rounded-none hover:bg-gray-100",
                    activeStyles
                  )}
                >
                  {content}
                </SidebarMenuSubButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub className="border-l border-gray-300 group-data-[collapsible=icon]:hidden">
                  {item.children.map((child: any) => (
                    <NavMenuItem
                      key={child.id}
                      item={child}
                      depth={depth + 1}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </SidebarMenuSubItem>
      );
    }

    // =========================
    // ROOT MENU
    // =========================

    return (
      <Collapsible
        asChild
        defaultOpen={isChildActive}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn(
                "flex items-center gap-2 group group-data-[collapsible=icon]:justify-center rounded-none hover:bg-red-50",
                activeStyles
              )}
            >
              {content}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="border-l border-gray-300 group-data-[collapsible=icon]:hidden">
              {item.children.map((child: any) => (
                <NavMenuItem
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // =========================================================
  // SUB MENU ITEM
  // =========================================================

  if (depth > 0) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild>
          <Link
            to={item.path}
            className={cn(
              "flex w-full items-center gap-3 rounded-none hover:bg-gray-100",
              activeStyles
            )}
          >
            <div
              className={cn(
                "size-1 rounded-full ml-[19px] shrink-0 flex-none group-data-[collapsible=icon]:hidden",
                active
                  ? "bg-red-600"
                  : "bg-gray-400"
              )}
            />

            <span
              className={cn(
                "text-sm font-medium group-data-[collapsible=icon]:hidden",
                active
                  ? "text-red-600"
                  : "text-gray-600"
              )}
            >
              {item.title}
            </span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  // =========================================================
  // ROOT MENU ITEM
  // =========================================================

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={item.path}
          className={cn(
            "flex items-center gap-2 group-data-[collapsible=icon]:!justify-center rounded-none hover:bg-red-50",
            activeStyles
          )}
        >
          <div className="w-3 h-3 flex items-center justify-center group-data-[collapsible=icon]:hidden">
            <div
              className={cn(
                "size-1 rounded-full shrink-0 flex-none",
                active
                  ? "bg-red-600"
                  : "bg-gray-400"
              )}
            />
          </div>

          {Icon && (
            <Icon
              className={cn(
                "!size-4",
                active
                  ? "text-red-600"
                  : "text-gray-600"
              )}
            />
          )}

          <span
            className={cn(
              "font-medium text-medium hover:text-red-600 group-data-[collapsible=icon]:hidden",
              active
                ? "text-red-600"
                : "text-gray-600"
            )}
          >
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}