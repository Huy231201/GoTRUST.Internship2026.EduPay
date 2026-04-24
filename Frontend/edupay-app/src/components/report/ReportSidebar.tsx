import { useState } from "react";
import { ChevronDown, Search, Settings, DollarSign, GraduationCap, Users, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

export default function ReportSidebar({
    active,
    onChange
} : {
    active?: string;
    onChange?: (val: string) => void;
}
) {
  const [open, setOpen] = useState<string[]>([""]);

  const toggle = (key: string) => {
    setOpen((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="w-64 bg-white border-r h-[700px] p-3 text-xs border-gray-200">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Tìm kiếm báo cáo..."
          className="rounded-md pl-8 text-gray-400 font-medium h-9 placeholder:text-xs bg-gray-50/50 border-gray-200"
        />
      </div>

      {/* Line ngăn cách */}
      <div className="border-t border-gray-200 mt-1 mb-2 -mx-3" />

      {/* Menu */}
      <div className="flex flex-col gap-3">

        {/* System */}
        <MenuItem label="Báo cáo hệ thống" count={0} icon={Settings} />

        {/* Student */}
        <CollapsibleMenuItem
          label="Báo cáo học sinh"
          icon={Users}
          count={1}
          open={open.includes("student")}
          onToggle={() => toggle("student")}
        >
          <SubItem
            label="DANH SÁCH HỌC SINH"
            active={active === "student-list"}
            onClick={() => onChange?.("student-list")}
            icon={FileText}
          />
        </CollapsibleMenuItem>

        {/* Study */}
        <CollapsibleMenuItem
          label="Báo cáo học tập"
          icon={GraduationCap}
          count={1}
          open={open.includes("study")}
          onToggle={() => toggle("study")}
        >
          <SubItem
            label="Đang cập nhật"
            active={active === "study-1"}
            onClick={() => onChange?.("study-1")}
          />
        </CollapsibleMenuItem>

        {/* Finance */}
        <CollapsibleMenuItem
          label="Báo cáo tài chính"
          icon={DollarSign}
          count={4}
          open={open.includes("finance")}
          onToggle={() => toggle("finance")}
        >
          {[1, 2, 3, 4].map((i) => (
            <SubItem
              key={i}
              label={`Đang cập nhật ${i}`}
              active={active === `finance-${i}`}
              onClick={() => onChange?.(`finance-${i}`)}
            />
          ))}
        </CollapsibleMenuItem>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function MenuItem({
  label,
  count,
  icon: Icon,
}: {
  label: string;
  count?: number;
  icon?: any;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 cursor-pointer font-bold">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4" />}
        <span>{label}</span>
      </div>

      {count !== undefined && (
        <span className="text-gray-400 text-xs">({count})</span>
      )}
    </div>
  );
}

function CollapsibleMenuItem({
  label,
  icon: Icon,
  count,
  open,
  onToggle,
  children,
}: {
  label: string;
  icon?: any;
  count?: number;
  open?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-100"
      >
        <div className="flex items-center gap-2 font-bold">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{label}</span>
          {count !== undefined && (
            <span className="text-gray-400 text-xs">({count})</span>
          )}
        </div>

        <ChevronDown
          className={clsx(
            "w-4 h-4 transition",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="ml-3 mt-1 space-y-1 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: any;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer",
        !active && "hover:bg-gray-100",
        active && "bg-red-50 text-red-600 font-medium border border-red-300"
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <span>{label}</span>
    </div>
  );
}