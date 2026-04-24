import PageHeader from "../components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SchoolYearCard } from "../components/school-year/SchoolYearCard";
import { useState, useEffect } from "react";
import { AddSchoolYearModal } from "../components/school-year/AddSchoolYearModal";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";

export default function SchoolYearPage() {
  const [open, setOpen] = useState(false);

  const {
    schoolYears,
    fetchSchoolYears,
    setSearch,
    search
  } = useSchoolYearStore();

  // load lần đầu
  useEffect(() => {
    fetchSchoolYears();
  }, []);

  // auto search khi nhập
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSchoolYears();
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader
          title="Khai báo năm học"
          subtitle="Quản lý thông tin các năm học và học kỳ"
        />

        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Tìm kiếm năm học ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white w-60 text-xs text-gray-400 font-medium border-gray-300 focus-visible:border-2 focus-visible:border-gray-300"
          />

          <Button
            className="bg-black text-white text-xs hover:bg-black/60 flex items-center gap-4 shadow-sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-3" strokeWidth={3} />
            Thêm năm học
          </Button>
        </div>
      </div>

      {/* render list */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {schoolYears.map((item) => (
          <SchoolYearCard key={item.id} data={item} />
        ))}
      </div>

      <AddSchoolYearModal open={open} onOpenChange={setOpen} />
    </div>
  );
}