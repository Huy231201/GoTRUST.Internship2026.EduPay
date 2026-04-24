
import PageHeader from "@/components/common/PageHeader";
import ReportSidebar from "@/components/report/ReportSidebar";
import { useState } from "react";
import StudentReport from "@/components/report/StudentReport";

export default function ReportPage() {
  const [activeMenu, setActiveMenu] = useState<string>();

  return (
    <>
      {/* Header */}
      <div className="px-5 py-2 bg-white border-b border-gray-200">
        <PageHeader
          title="Báo cáo thống kê"
          subtitle="Xem và quản lý các báo cáo hệ thống"
        />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <ReportSidebar
          active={activeMenu}
          onChange={setActiveMenu}
        />

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {activeMenu === "student-list" && <StudentReport />}

          
        </div>
      </div>
    </>
  );
}