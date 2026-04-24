
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, SquarePen, Trash2 } from "lucide-react";
import { useBranchStore } from "@/stores/useBranchStore";
import { useStatisticsStore } from "@/stores/useStatisticsStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useAuthStore } from "@/stores/useAuthStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { UpdateBranchModal } from "@/components/school-management/UpdateBranchModal";
import type { BranchItem } from "@/lib/api/branch/branch-type";
import { toast } from "sonner";

export function BranchCard() {
  const { branches, fetchBranches, deleteBranch } = useBranchStore();
  const { data, fetchStatistics } = useStatisticsStore();

  const schoolId = useAuthStore((s) => s.schoolId);
  const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  // load branches
  useEffect(() => {
    if (schoolId) fetchBranches();
  }, [schoolId]);

  // load statistics
  useEffect(() => {
    if (schoolId && schoolYearId) {
      fetchStatistics(schoolId, schoolYearId);
    }
  }, [schoolId, schoolYearId]);

  const handleDeleteClick = (branchId: string, isMain: boolean) => {
    if (isMain) {
      toast.error("Không thể xóa cơ sở chính", {
        style: {
          borderLeft: '4px solid #ef4444',
          borderRadius: '8px',
        },
        duration: 1500
      });
      return;
    }
    setSelectedBranchId(branchId);
    setConfirmOpen(true);
  };

  const handleUpdateClick = (branch: BranchItem) => {
    setSelectedBranch(branch);
    setUpdateOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranchId) return;
    try {
      setLoading(true);
      await deleteBranch(selectedBranchId);
      setConfirmOpen(false);
      setSelectedBranchId(null);
    } catch (err) {
      alert("Xóa cơ sở thất bại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 👉 lấy stats theo branchId
  const getStatsByBranch = (branchId: string) => {
    if (!data) return null;

    // main branch
    if (data.mainBranch?.branchId === branchId) {
      return data.mainBranch;
    }

    // sub branches
    return data.subBranches?.find((b) => b.branchId === branchId);
  };

  return (
    <>
      <Card className="rounded-2xl bg-white shadow-lg border-none">
        <CardHeader className="px-5 pt-1 pb-0">
          <CardTitle className="font-semibold text-sm">
            Các cơ sở phụ
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 space-y-5 py-5">
          <div className="grid grid-cols-2 gap-4">
            {branches.map((b, index) => {
              const stats = getStatsByBranch(b.id as string);

              return (
                <Card key={index} className="rounded-xl border border-gray-200 shadow-none">
                  <CardContent className="space-y-3">

                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="font-bold text-sm leading-tight text-gray-800">
                        {b.isMain ? `Chi nhánh chính - ${b.name}` : b.name}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <SquarePen
                          className="size-4 cursor-pointer text-blue-600 transition-colors"
                          onClick={() => handleUpdateClick(b)}
                        />

                        <Trash2
                          className={`size-4 cursor-pointer transition-colors ${b.isMain
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-500 hover:text-red-600"
                            }`}
                          onClick={() =>
                            handleDeleteClick(b.id as string, b.isMain)
                          }
                        />
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="text-[12px] text-gray-500 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-600" />
                        <span>{b.address || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-600" />
                        <span>{b.phone || "-"}</span>
                      </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="bg-[#f2f5fe] rounded-lg text-center py-2.5">
                        <div className="font-bold text-[#435084] text-xs">
                          {stats?.studentCount ?? 0}
                        </div>
                        <div className="text-[10px] text-[#5b67bd] font-medium">
                          Học sinh
                        </div>
                      </div>

                      <div className="bg-[#f2fef4] rounded-lg text-center py-2.5">
                        <div className="font-bold text-[#3b4f39] text-xs">
                          {stats?.teacherCount ?? 0}
                        </div>
                        <div className="text-[10px] text-[#8da678] font-medium">
                          Giáo viên
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg text-center py-2.5">
                        <div className="font-bold text-[#4d2672] text-xs">
                          {stats?.classCount ?? 0}
                        </div>
                        <div className="text-[10px] text-[#814dd1] font-medium">
                          Lớp học
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Xác nhận xóa cơ sở
            </DialogTitle>
          </DialogHeader>

          <div className="font-medium text-sm text-gray-700 mt-2">
            Bạn có chắc chắn muốn xóa cơ sở này không? Hành động này không thể hoàn tác.
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4 border-t border-none">
            <Button
              className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Hủy
            </Button>

            <Button
              className="bg-red-500 text-white hover:bg-red-600 px-3 font-bold"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpdateBranchModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        branch={selectedBranch}
      />
    </>
  );
}