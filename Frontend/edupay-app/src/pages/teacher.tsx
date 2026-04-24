// import PageHeader from "@/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";
// import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
// import { TEACHER_STATUS_OPTIONS } from "@/constants/status";

// import { AddTeacherModal } from "@/components/teacher/AddTeacherModal";
// import { UpdateTeacherModal } from "@/components/teacher/UpdateTeacherModal";

// import { useTeacherStore } from "@/stores/useTeacherStore";
// import { useAppFilterStore } from "@/stores/useAppFilterStore";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// export default function TeacherPage() {
//     const [open, setOpen] = useState(false);
//     const [updateOpen, setUpdateOpen] = useState(false);
//     const [confirmOpen, setConfirmOpen] = useState(false);

//     const teachers = useTeacherStore((s) => s.teachers);
//     const loading = useTeacherStore((s) => s.loading);

//     const search = useTeacherStore((s) => s.search);
//     const setSearch = useTeacherStore((s) => s.setSearch);

//     const status = useTeacherStore((s) => s.status);
//     const setStatus = useTeacherStore((s) => s.setStatus);
//     const fetchTeachers = useTeacherStore((s) => s.fetchTeachers);

//     const branchId = useAppFilterStore((s) => s.branchId);
//     const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

//     const [selectedStatus, setSelectedStatus] = useState("all");
//     const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
//     const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
//     const deleteTeacher = useTeacherStore((s) => s.deleteTeacher);

//     // 🔥 thêm loading riêng cho delete
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [goToPage, setGoToPage] = useState("1");

//     const itemsPerPage = 5;

//     const totalPages = Math.ceil(teachers.length / itemsPerPage) || 1;

//     const currentItems = useMemo(
//         () =>
//             teachers.slice(
//                 (currentPage - 1) * itemsPerPage,
//                 currentPage * itemsPerPage
//             ),
//         [teachers, currentPage]
//     );

//     const handlePageInput = (e: KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter") {
//             const pageNum = parseInt(goToPage, 10);
//             if (!Number.isNaN(pageNum)) {
//                 const validPage = Math.min(Math.max(pageNum, 1), totalPages);
//                 setCurrentPage(validPage);
//                 setGoToPage(String(validPage));
//             }
//         }
//     };

//     const handleConfirmDelete = async () => {
//         if (!selectedTeacherId) return;

//         try {
//             setDeleteLoading(true);

//             await deleteTeacher(selectedTeacherId);

//             // 🔥 lùi trang nếu xóa item cuối
//             if (currentPage > 1 && currentItems.length === 1) {
//                 const prevPage = currentPage - 1;
//                 setCurrentPage(prevPage);
//                 setGoToPage(String(prevPage));
//             }

//             setConfirmOpen(false);
//             setSelectedTeacherId(null);

//         } catch (err) {
//             console.error(err);
//             alert("Xóa thất bại!");
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!branchId || !schoolYearId) return;
//         fetchTeachers();
//     }, [branchId, schoolYearId, search, status]);

//     // 🔥 reset pagination khi filter / context đổi
//     useEffect(() => {
//         setCurrentPage(1);
//         setGoToPage("1");
//     }, [search, status, branchId, schoolYearId]);

//     // 🔥 sync input page
//     useEffect(() => {
//         setGoToPage(String(currentPage));
//     }, [currentPage]);

//     return (
//         <>
//             <div className="flex flex-col gap-5">
//                 <div className="flex justify-between items-center">
//                     <PageHeader
//                         title="Quản lý giáo viên"
//                         subtitle="Quản lý thông tin và hồ sơ giáo viên"
//                     />

//                     <Button
//                         onClick={() => setOpen(true)}
//                         className="flex gap-3 bg-black text-xs shadow-sm text-white hover:bg-black/60">
//                         <Plus className="size-[12px]" />
//                         Thêm giáo viên
//                     </Button>
//                 </div>

//                 <Card className="bg-white shadow-sm flex flex-col py-5 gap-4">
//                     <CardHeader>
//                         <CardTitle className="text-[13px] font-bold">
//                             Bộ lọc
//                         </CardTitle>
//                     </CardHeader>

//                     <CardContent className="flex items-center gap-3 mt-2">
//                         <div className="flex-[1] flex flex-col gap-1">
//                             <label className="text-xs font-bold">Tìm kiếm</label>
//                             <div className="relative flex items-center flex-[1]">
//                                 <Search className="text-gray-400 size-[12px] absolute left-3 top-1/2 -translate-y-1/2" />
//                                 <Input
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     type="search"
//                                     placeholder="Tìm theo tên hoặc mã giáo viên"
//                                     className="pl-10 !h-8 border-gray-200 bg-gray-50/50 !text-xs font-medium text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex-[1] flex flex-col gap-1">
//                             <label className="text-xs font-bold ">Tổ bộ môn</label>
//                             <Select>
//                                 <SelectTrigger className="w-full text-xs text-gray-400 !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
//                                     <SelectValue placeholder="Tất cả" />
//                                 </SelectTrigger>

//                                 <SelectContent
//                                     position="popper"
//                                     side="bottom"
//                                     align="start"
//                                     className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg">
//                                     <SelectItem value="all" className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">Tất cả</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="flex-[1] flex flex-col gap-1">
//                             <label className="text-xs font-bold">Trạng thái</label>
//                             <Select
//                                 value={selectedStatus}
//                                 onValueChange={(val) => {
//                                     setSelectedStatus(val);
//                                     setStatus(val === "all" ? undefined : Number(val));
//                                 }}
//                             >
//                                 <SelectTrigger className="w-full text-xs text-gray-400 !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
//                                     <SelectValue placeholder="Tất cả" />
//                                 </SelectTrigger>

//                                 <SelectContent
//                                     position="popper"
//                                     side="bottom"
//                                     align="start"
//                                     className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
//                                 >
//                                     <SelectItem value="all" className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">
//                                         Tất cả
//                                     </SelectItem>

//                                     {TEACHER_STATUS_OPTIONS.map((opt) => (
//                                         <SelectItem key={opt.value} value={opt.value} className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">
//                                             {opt.label}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="rounded-xl shadow-sm bg-white border-gray-300 mt-5">
//                     <CardContent className="p-0">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="text-xs border-gray-200">
//                                     <TableHead className="font-bold px-4 py-3">Mã GV</TableHead>
//                                     <TableHead className="font-bold px-4 py-3">Họ và tên</TableHead>
//                                     <TableHead className="font-bold px-4 py-3">Email đăng nhập App</TableHead>
//                                     <TableHead className="font-bold px-4 py-3">Số điện thoại</TableHead>
//                                     <TableHead className="font-bold px-4 py-3">Tổ bộ môn</TableHead>
//                                     <TableHead className="font-bold px-4 py-3">Thao tác</TableHead>
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody>
//                                 {currentItems.map((t) => (
//                                     <TableRow key={t.id} className="text-xs font-medium hover:bg-gray-50 border-gray-200">
//                                         <TableCell className="px-4 py-3 font-bold">{t.code}</TableCell>
//                                         <TableCell className="px-4 py-3">{t.name}</TableCell>
//                                         <TableCell className="px-4 py-3">{t.email}</TableCell>
//                                         <TableCell className="px-4 py-3">{t.phoneNumber || "-"}</TableCell>
//                                         <TableCell className="px-4 py-3">-</TableCell>

//                                         <TableCell className="px-4 py-3">
//                                             <div className="flex gap-3">
//                                                 <div className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
//                                                     <Eye className="size-[12px] cursor-pointer hover:text-black/50" />
//                                                 </div>

//                                                 <div
//                                                     onClick={() => {
//                                                         setSelectedTeacher(t);
//                                                         setUpdateOpen(true)
//                                                     }}
//                                                     className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
//                                                     <SquarePen className="size-[12px] cursor-pointer hover:text-black/50" />
//                                                 </div>

//                                                 <div className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
//                                                     <Trash2
//                                                         onClick={() => {
//                                                             setConfirmOpen(true);
//                                                             setSelectedTeacherId(t.id);
//                                                         }}
//                                                         className="size-[12px] cursor-pointer hover:text-black/50" />
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}

//                                 {!loading && currentItems.length === 0 && (
//                                     <TableRow>
//                                         <TableCell colSpan={6} className="text-center py-8 text-sm text-gray-500">
//                                             Không có dữ liệu giáo viên
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>

//                         <div className="flex items-center justify-end gap-3 mt-4 mb-4">
//                             <Pagination className="justify-end w-auto mx-0">
//                                 <PaginationContent>
//                                     <PaginationItem>
//                                         <PaginationPrevious
//                                             href="#"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//                                             }}
//                                             className={
//                                                 totalPages <= 1 || currentPage === 1
//                                                     ? "pointer-events-none opacity-50"
//                                                     : "cursor-pointer"
//                                             }
//                                         />
//                                     </PaginationItem>

//                                     <PaginationItem>
//                                         <PaginationLink className="bg-black text-white rounded h-8 w-8">
//                                             {currentPage}
//                                         </PaginationLink>
//                                     </PaginationItem>

//                                     <PaginationItem>
//                                         <PaginationNext
//                                             href="#"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//                                             }}
//                                             className={
//                                                 totalPages <= 1 || currentPage === totalPages
//                                                     ? "pointer-events-none opacity-50"
//                                                     : "cursor-pointer"
//                                             }
//                                         />
//                                     </PaginationItem>
//                                 </PaginationContent>
//                             </Pagination>

//                             <div className="!mr-7 flex items-center gap-1 text-xs font-medium">
//                                 <span className="text-sm">Đi đến:</span>
//                                 <Input
//                                     value={goToPage}
//                                     onChange={(e) => setGoToPage(e.target.value)}
//                                     onKeyDown={handlePageInput}
//                                     disabled={totalPages <= 1}
//                                     className="h-8 !pl-3 w-14 text-start p-0 border-gray-200 bg-white focus-visible:ring-1 focus-visible:ring-gray-300 disabled:bg-gray-50"
//                                 />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
//                 <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
//                     <DialogHeader>
//                         <DialogTitle className="text-lg font-semibold">Xác nhận xóa giáo viên</DialogTitle>
//                     </DialogHeader>

//                     <div className="font-medium text-sm text-gray-700 mt-2">
//                         Bạn có chắc chắn muốn xóa giáo viên này không? Hành động này không thể hoàn tác.
//                     </div>

//                     <DialogFooter className="flex justify-end gap-2 mt-4 border-t border-none">
//                         <Button
//                             variant="outline"
//                             className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors"
//                             onClick={() => setConfirmOpen(false)}
//                         >
//                             Hủy
//                         </Button>
//                         <Button
//                             className="bg-red-500 text-white hover:bg-red-600 px-3 font-bold"
//                             onClick={handleConfirmDelete}
//                             disabled={deleteLoading}
//                         >
//                             {deleteLoading ? "Đang xóa..." : "Xóa"}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             <AddTeacherModal open={open} onOpenChange={setOpen} />
//             <UpdateTeacherModal teacher={selectedTeacher} open={updateOpen} onOpenChange={setUpdateOpen} />
//         </>
//     );
// }


import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { TEACHER_STATUS_OPTIONS } from "@/constants/status";

import { AddTeacherModal } from "@/components/teacher/AddTeacherModal";
import { UpdateTeacherModal } from "@/components/teacher/UpdateTeacherModal";

import { useTeacherStore } from "@/stores/useTeacherStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useSearchParams } from "react-router-dom";

export default function TeacherPage() {
    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const teachers = useTeacherStore((s) => s.teachers);
    const loading = useTeacherStore((s) => s.loading);

    const search = useTeacherStore((s) => s.search);
    const setSearch = useTeacherStore((s) => s.setSearch);

    const status = useTeacherStore((s) => s.status);
    const setStatus = useTeacherStore((s) => s.setStatus);
    const fetchTeachers = useTeacherStore((s) => s.fetchTeachers);

    const branchId = useAppFilterStore((s) => s.branchId);
    const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const deleteTeacher = useTeacherStore((s) => s.deleteTeacher);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [goToPage, setGoToPage] = useState("1");

    const [searchParams] = useSearchParams();

    const itemsPerPage = 5;
    const totalPages = Math.ceil(teachers.length / itemsPerPage) || 1;

    const currentItems = useMemo(
        () =>
            teachers.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ),
        [teachers, currentPage]
    );

    const handlePageInput = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const pageNum = parseInt(goToPage, 10);
            if (!Number.isNaN(pageNum)) {
                const validPage = Math.min(Math.max(pageNum, 1), totalPages);
                setCurrentPage(validPage);
                setGoToPage(String(validPage));
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedTeacherId) return;

        try {
            setDeleteLoading(true);

            await deleteTeacher(selectedTeacherId);

            if (currentPage > 1 && currentItems.length === 1) {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                setGoToPage(String(prevPage));
            }

            setConfirmOpen(false);
            setSelectedTeacherId(null);

        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        } finally {
            setDeleteLoading(false);
        }
    };

    //  sync search từ URL
    useEffect(() => {
        const urlSearch = searchParams.get("search");
        if (urlSearch) {
            setSearch(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!branchId || !schoolYearId) return;
        fetchTeachers();
    }, [branchId, schoolYearId, search, status]);

    useEffect(() => {
        setCurrentPage(1);
        setGoToPage("1");
    }, [search, status, branchId, schoolYearId]);

    useEffect(() => {
        setGoToPage(String(currentPage));
    }, [currentPage]);

    useEffect(() => {
        return () => {
            // reset filter khi rời trang
            setSearch("");
            setStatus(undefined);
            setSelectedStatus("all");

            // reset pagination
            setCurrentPage(1);
            setGoToPage("1");
        };
    }, []);

    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <PageHeader
                        title="Quản lý giáo viên"
                        subtitle="Quản lý thông tin và hồ sơ giáo viên"
                    />

                    <Button
                        onClick={() => setOpen(true)}
                        className="flex gap-3 bg-black text-xs shadow-sm text-white hover:bg-black/60">
                        <Plus className="size-[12px]" />
                        Thêm giáo viên
                    </Button>
                </div>

                <Card className="bg-white shadow-sm flex flex-col py-5 gap-4">
                    <CardHeader>
                        <CardTitle className="text-[13px] font-bold">
                            Bộ lọc
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-center gap-3 mt-2">
                        <div className="flex-[1] flex flex-col gap-1">
                            <label className="text-xs font-bold">Tìm kiếm</label>
                            <div className="relative flex items-center flex-[1]">
                                <Search className="text-gray-400 size-[12px] absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="search"
                                    placeholder="Tìm theo tên hoặc mã giáo viên"
                                    className="pl-10 !h-8 border-gray-200 bg-gray-50/50 !text-xs font-medium text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex-[1] flex flex-col gap-1">
                            <label className="text-xs font-bold ">Tổ bộ môn</label>
                            <Select>
                                <SelectTrigger className="w-full text-xs text-gray-400 !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg">
                                    <SelectItem value="all" className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">Tất cả</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-[1] flex flex-col gap-1">
                            <label className="text-xs font-bold">Trạng thái</label>
                            <Select
                                value={selectedStatus}
                                onValueChange={(val) => {
                                    setSelectedStatus(val);
                                    setStatus(val === "all" ? undefined : Number(val));
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
                                    <SelectItem value="all" className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">
                                        Tất cả
                                    </SelectItem>

                                    {TEACHER_STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm bg-white border-gray-300 mt-5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="text-xs border-gray-200">
                                    <TableHead className="font-bold px-4 py-3">Mã GV</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Họ và tên</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Email đăng nhập App</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Số điện thoại</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Tổ bộ môn</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentItems.map((t) => (
                                    <TableRow key={t.id} className="text-xs font-medium hover:bg-gray-50 border-gray-200">
                                        <TableCell className="px-4 py-3 font-bold">{t.code}</TableCell>
                                        <TableCell className="px-4 py-3">{t.name}</TableCell>
                                        <TableCell className="px-4 py-3">{t.email}</TableCell>
                                        <TableCell className="px-4 py-3">{t.phoneNumber || "-"}</TableCell>
                                        <TableCell className="px-4 py-3">-</TableCell>

                                        <TableCell className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <div className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <Eye className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        setSelectedTeacher(t);
                                                        setUpdateOpen(true)
                                                    }}
                                                    className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <SquarePen className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>

                                                <div className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <Trash2
                                                        onClick={() => {
                                                            setConfirmOpen(true);
                                                            setSelectedTeacherId(t.id);
                                                        }}
                                                        className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!loading && currentItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-sm text-gray-500">
                                            Không có dữ liệu giáo viên
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-end gap-3 mt-4 mb-4">
                            <Pagination className="justify-end w-auto mx-0">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                                            }}
                                            className={
                                                totalPages <= 1 || currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationLink className="bg-black text-white rounded h-8 w-8">
                                            {currentPage}
                                        </PaginationLink>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
                    </CardContent>
                </Card>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Xác nhận xóa giáo viên</DialogTitle>
                    </DialogHeader>

                    <div className="font-medium text-sm text-gray-700 mt-2">
                        Bạn có chắc chắn muốn xóa giáo viên này không? Hành động này không thể hoàn tác.
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
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AddTeacherModal open={open} onOpenChange={setOpen} />
            <UpdateTeacherModal teacher={selectedTeacher} open={updateOpen} onOpenChange={setUpdateOpen} />
        </>
    );
}