

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, SquarePen } from "lucide-react";
import { useEffect } from "react";
import { useSchoolStore } from "@/stores/useSchoolStore";
import { SCHOOL_LEVEL_MAP } from "@/constants/school-constants";

interface Props {
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  loading?: boolean;
}

export function MainSchoolCard({
  totalStudents,
  totalTeachers,
  totalClasses,
  loading,
}: Props) {
  const { school, fetchSchool } = useSchoolStore();

  useEffect(() => {
    fetchSchool();
  }, []);

  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardContent className="px-5 py-1 space-y-5">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="size-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">
              Thông tin trường chính
            </span>

            <span className="text-[9px] leading-none py-0.5 font-semibold bg-gray-100 px-2 rounded">
              Trường chính
            </span>
          </div>

          <Button
            variant="ghost"
            className="text-gray-600 text-xs font-bold hover:bg-gray-50 flex items-center gap-2"
          >
            <SquarePen className="size-3" strokeWidth={3} />
            Chỉnh sửa
          </Button>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Tên trường</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.name || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Số điện thoại</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.phone || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Mã trường</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.code || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Email</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.email || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Loại hình</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.type || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Mã số thuế</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.taxCode || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Cấp học</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.level ? SCHOOL_LEVEL_MAP[school.level] : "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Website</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.website || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Địa chỉ</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.address || "-"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[#808080] text-xs font-medium">Hiệu trưởng</p>
            <p className="text-sm text-gray-800 font-medium">
              {school?.principal || "-"}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 pt-1">

          <div className="bg-[#f2f5fe] rounded-lg py-4 text-center">
            <p className="text-lg font-semibold text-[#435084]">
              {loading ? "..." : totalStudents ?? 0}
            </p>
            <p className="text-sm text-[#5b67bd]">Học sinh</p>
          </div>

          <div className="bg-[#f2fef4] rounded-lg py-4 text-center">
            <p className="text-lg font-semibold text-[#3b4f39]">
              {loading ? "..." : totalTeachers ?? 0}
            </p>
            <p className="text-sm text-[#8da678]">Giáo viên</p>
          </div>

          <div className="bg-purple-50 rounded-lg py-4 text-center">
            <p className="text-lg font-semibold text-[#4d2672]">
              {loading ? "..." : totalClasses ?? 0}
            </p>
            <p className="text-sm text-[#814dd1]">Lớp học</p>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}