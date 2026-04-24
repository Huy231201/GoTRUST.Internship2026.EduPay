import PageHeader from "../components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import { Search, Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { Separator } from "@/components/ui/separator";
import { AddGradeModal } from "@/components/grade/AddGradeModal";
import { UpdateGradeModal } from "@/components/grade/UpdateGradeModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// ✅ STORE
import { useGradeStore } from "@/stores/useGradeStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { STATUS_MAP, STATUS_OPTIONS } from "@/constants/status";
import type { Grade } from "@/lib/api/grade";

export default function GradePage() {
    const { grades, setStatus, fetchGrades, status } = useGradeStore();
    const { branchId, schoolYearId } = useAppFilterStore();

    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

    const { search, setSearch, deleteGrade } = useGradeStore();

    // ✅ NEW: loading state cho delete
    const [deleting, setDeleting] = useState(false);

    // ================= PAGINATION STATE =================
    const [currentPage, setCurrentPage] = useState(1);
    const [goToPage, setGoToPage] = useState("1");

    const itemsPerPage = 6;
    const totalPages = Math.ceil(grades.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > 1 && currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
            setGoToPage(String(totalPages || 1));
        }
    }, [grades.length, totalPages, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        setGoToPage("1");
    }, [search, status, branchId, schoolYearId]);

    const currentItems = grades.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ================= HANDLERS =================
    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            setDeleting(true);
            await deleteGrade(selectedId);
            setConfirmOpen(false);
            setSelectedId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        if (!branchId || !schoolYearId) return;

        const delay = setTimeout(() => {
            fetchGrades();
        }, 400);

        return () => clearTimeout(delay);
    }, [branchId, schoolYearId, search, status]);

    const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(goToPage);
            if (!isNaN(pageNum)) {
                const validPage = Math.min(Math.max(pageNum, 1), totalPages || 1);
                setCurrentPage(validPage);
                setGoToPage(String(validPage));
            }
        }
    };

    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <PageHeader
                        title="Quản lý khối học"
                        subtitle="Quản lý thông tin khối học trong hệ thống"
                    />
                    <Button
                        className="bg-black text-white text-xs hover:bg-black/60 flex items-center gap-4"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="size-3" strokeWidth={3} />
                        Thêm khối học
                    </Button>
                </div>

                {/* FILTER */}
                <Card className="flex flex-col gap-4 bg-white py-5 shadow-medium">
                    <CardHeader>
                        <CardTitle className="text-[13px] font-bold">
                            Bộ lọc
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold">Tìm kiếm</label>
                            <div className="relative flex items-center">
                                <Search className="text-gray-400 size-[12px] absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    type="search"
                                    placeholder="Tìm theo tên khối"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 !h-8 border-gray-200 bg-gray-50/50 !text-xs font-medium text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold">Trạng thái</label>
                            <Select
                                defaultValue="all"
                                onValueChange={(value) => {
                                    setStatus(STATUS_MAP[value]);
                                }}
                            >
                                <SelectTrigger className="w-full text-xs text-gray-400 !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    {STATUS_OPTIONS.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                            className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* LIST */}
                <div className="grid grid-cols-3 gap-5">
                    {currentItems.map((grade) => (
                        <Card key={grade.id} className="bg-white shadow-medium">
                            <CardContent className="flex flex-col gap-4 p-5">
                                <div className="flex justify-between items-center">
                                    <label className="font-bold text-[13px]">
                                        {grade.name}
                                    </label>
                                    <div className="mr-4 flex items-center gap-5">
                                        <SquarePen
                                            onClick={() => {
                                                setOpenUpdate(true)
                                                setSelectedGrade(grade)
                                            }}
                                            className="size-4 text-blue-500 cursor-pointer hover:text-blue-600"
                                        />
                                        <Trash2
                                            onClick={() => {
                                                setConfirmOpen(true);
                                                setSelectedId(grade.id);
                                            }}
                                            className="size-4 text-red-500 cursor-pointer hover:text-red-600"
                                        />
                                    </div>
                                </div>

                                <span className="font-bold">
                                    {grade.description || "-"}
                                </span>

                                <div className="flex justify-between items-center">
                                    <label className="font-bold text-xs">
                                        Trạng thái:
                                    </label>
                                    <div
                                        className={`px-3 py-[1.5px] font-bold text-xs text-white rounded-lg ${grade.status ? "bg-black" : "bg-red-500"
                                            }`}
                                    >
                                        {grade.status ? "Hoạt động" : "Không hoạt động"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Separator className="w-full bg-gray-300 h-[0.5px]" />

                {/* PAGINATION */}
                <div className="flex items-center justify-end gap-3">
                    <Pagination className="justify-end w-auto mx-0">
                        <PaginationContent className="flex items-center">
                            <PaginationItem className="!p-0">
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1)
                                            setCurrentPage((prev) => prev - 1);
                                    }}
                                    className={
                                        totalPages <= 1 || currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationLink className="bg-black text-white hover:bg-black/80 hover:text-white rounded h-8 w-8">
                                    {currentPage}
                                </PaginationLink>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages)
                                            setCurrentPage((prev) => prev + 1);
                                    }}
                                    className={
                                        totalPages <= 1 || currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <div className="!mr-7 flex items-center gap-1 text-xs font-medium">
                        <span className="text-sm">Đi đến:</span>
                        <Input
                            value={goToPage}
                            onChange={(e) => setGoToPage(e.target.value)}
                            onKeyDown={handlePageInput}
                            disabled={totalPages <= 1}
                            className="h-8 !pl-3 w-14 text-start p-0 border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-gray-300 disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            <AddGradeModal open={open} onOpenChange={setOpen} />
            {selectedGrade && (
                <UpdateGradeModal
                    open={openUpdate}
                    onOpenChange={setOpenUpdate}
                    data={selectedGrade}
                />
            )}

            <Dialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    setConfirmOpen(open);
                    if (!open) setSelectedId(null);
                }}
            >
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Xác nhận xóa khối học</DialogTitle>
                    </DialogHeader>
                    <div className="font-medium text-sm text-gray-700 mt-2">
                        Bạn có chắc chắn muốn xóa khối học này không? Hành động này không thể hoàn tác.
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4 border-t border-none">
                        <Button className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors" variant="outline" onClick={() => setConfirmOpen(false)}>Hủy</Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-500 text-white hover:bg-red-600 px-3 font-bold disabled:opacity-50"
                        >
                            {deleting ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}