
import PageHeader from "../../components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Upload, School, Search, SquarePen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGradeStore } from "@/stores/useGradeStore";
import { useClassFilterStore } from "@/stores/useClassFilterStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useClassStore } from "@/stores/useClassStore";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSearchParams } from "react-router-dom"; // 🔥 thêm

type Props = {
    onCreate: () => void;
    onImport: () => void;
};

export default function ClassListView({ onCreate, onImport }: Props) {
    const grades = useGradeStore((s) => s.grades);
    const fetchGrades = useGradeStore((s) => s.fetchGrades);

    const classes = useClassStore((s) => s.classes);
    const fetchClasses = useClassStore((s) => s.fetchClasses);

    const branchId = useAppFilterStore((s) => s.branchId);
    const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

    const gradeId = useClassFilterStore((s) => s.gradeId);
    const setGradeId = useClassFilterStore((s) => s.setGradeId);

    const search = useClassStore((s) => s.search);
    const setSearch = useClassStore((s) => s.setSearch);

    const deleteClassById = useClassStore((s) => s.deleteClassById);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // LẤY SEARCH TỪ URL
    const [params] = useSearchParams();
    const searchParam = params.get("search") || "";

    // SYNC URL → STORE
    useEffect(() => {
        setSearch(searchParam);
    }, [searchParam, setSearch]);

    const handleDeleteClick = (classId: string) => {
        setSelectedClassId(classId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedClassId) return;

        try {
            setLoading(true);
            await deleteClassById(selectedClassId);
            setConfirmOpen(false);
            setSelectedClassId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //  fetch grades khi đổi header
    useEffect(() => {
        fetchGrades();
        setGradeId(undefined);
    }, [branchId, schoolYearId, fetchGrades, setGradeId]);

    // fetch classes khi filter đổi
    useEffect(() => {
        fetchClasses();
    }, [branchId, schoolYearId, gradeId, search, fetchClasses]);

    return (
        <>
            <div className="flex flex-col gap-5 ">
                <div className="flex justify-between items-center">
                    <PageHeader
                        title="Khai báo lớp học"
                        subtitle="Quản lý danh sách lớp học và thông tin giáo viên chủ nhiệm"
                    />

                    <div className="flex gap-3">
                        <Button
                            onClick={onImport}
                            className="flex gap-3 bg-white text-xs shadow-sm font-medium border-gray-200 hover:bg-gray-100/50">
                            <Upload className="size-[12px]" />
                            Import CSV
                        </Button>

                        <Button
                            onClick={onCreate}
                            className="flex gap-3 bg-black text-xs shadow-sm text-white hover:bg-black/60">
                            <School className="size-[12px]" />
                            Khai báo lớp học
                        </Button>
                    </div>
                </div>

                <Card className="bg-white rounded-lg pt-9 shadow-sm">
                    <CardContent className="grid grid-cols-2 gap-4">
                        {/* Search box */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold">Tìm kiếm</label>
                            <div className="relative flex items-center">
                                <Search className="text-gray-400 size-[12px] absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="search"
                                    placeholder="Tên lớp, giáo viên chủ nhiệm..."
                                    className="pl-10 !h-8 border-gray-200 bg-gray-50/50 !text-xs font-medium text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Grade select */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold">Khối lớp</label>
                            <Select
                                value={gradeId || "all"}
                                onValueChange={(val) => {
                                    setGradeId(val === "all" ? undefined : val);
                                }}
                            >
                                <SelectTrigger className="w-full text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Tất cả khối" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    <SelectItem
                                        value="all"
                                        className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        Tất cả
                                    </SelectItem>

                                    {grades.map((g) => (
                                        <SelectItem
                                            key={g.id}
                                            value={g.id}
                                            className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-5 overflow-x-auto">
                    {classes.map((item) => (
                        <Card key={item.id} className="bg-white shadow-sm rounded-lg pt-8">
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex gap-3 items-center">
                                    <School className="text-blue-500 size-7" />
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold text-[13px]">Lớp {item.name}</label>
                                        <label className="text-xs text-gray-400 font-medium">
                                            {item.gradeName} - {item.name}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <label className="text-xs font-medium text-gray-400">Mã lớp:</label>
                                    <label className="text-xs font-bold">{item.code}</label>
                                </div>

                                <div className="flex justify-between">
                                    <label className="text-xs font-medium text-gray-400">Chi nhánh:</label>

                                    <label className="text-xs font-bold max-w-[200px] text-right">
                                        {item.isMain
                                            ? `Chi nhánh chính - ${item.branchName.toUpperCase()}`
                                            : item.branchName.toUpperCase()}
                                    </label>

                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex flex-1 items-center border-gray-300 shadow-sm hover:bg-gray-100/50">
                                        <SquarePen />
                                        Sửa
                                    </Button>

                                    <Button
                                        onClick={() => handleDeleteClick(item.id)}
                                        className="flex flex-1 items-center border-gray-300 shadow-sm text-red-600 hover:bg-gray-100/50">
                                        <Trash2 className="text-red-600" />
                                        Xóa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Xác nhận xóa lớp</DialogTitle>
                    </DialogHeader>

                    <div className="font-medium text-sm text-gray-700 mt-2">
                        Bạn có chắc chắn muốn xóa lớp này không? Hành động này không thể hoàn tác.
                    </div>

                    <DialogFooter className="flex justify-end gap-2 mt-4 border-t border-none">
                        <Button
                            variant="outline"
                            className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors"
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
        </>
    );
}



