

import PageHeader from "../components/common/PageHeader";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MainSchoolCard } from "../components/school-management/MainSchoolCard";
import { BranchCard } from "../components/school-management/BranchCard";
import { AddBranchModal } from "../components/school-management/AddBranchModal";

import { useAuthStore } from "@/stores/useAuthStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useStatisticsStore } from "@/stores/useStatisticsStore";

export default function SchoolPage() {
    const [open, setOpen] = useState(false);

    const schoolId = useAuthStore((s) => s.schoolId);
    const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

    const { data, fetchStatistics, loading } = useStatisticsStore();

    useEffect(() => {
        if (schoolId && schoolYearId) {
            fetchStatistics(schoolId, schoolYearId);
        }
    }, [schoolId, schoolYearId]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Quản lý thông tin nhà trường"
                    subtitle="Quản lý thông tin trường chính và các cơ sở phụ"
                />

                <Button
                 className="bg-black text-white text-xs hover:bg-black/60 flex items-center gap-4"
                 onClick={() => setOpen(true)}
                >
                    <Plus className="size-3" strokeWidth={3} />
                    Thêm cơ sở mới
                </Button>
            </div>

            <MainSchoolCard
              totalStudents={data?.totalStudents}
              totalTeachers={data?.totalTeachers}
              totalClasses={data?.totalClasses}
              loading={loading}
            />

            <BranchCard />

            <AddBranchModal open={open} onOpenChange={setOpen} />
        </div>
    );
}