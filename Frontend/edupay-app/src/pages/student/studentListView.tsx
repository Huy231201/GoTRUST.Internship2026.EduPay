
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Search, SquarePen, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectContent,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useStudentStore } from "@/stores/useStudentStore";
import { useClassStore } from "@/stores/useClassStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { STUDENT_STATUS, STUDENT_STATUS_OPTIONS } from "@/constants/status";
import AddStudentModal from "@/components/student/AddStudentModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import UpdateStudentModal from "@/components/student/UpdateStudentModal";
import { format } from "date-fns";

type Props = {
    onImport: () => void;
};

export default function StudentListView({ onImport }: Props) {
    const [searchParams] = useSearchParams();

    const [open, setOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const students = useStudentStore((s) => s.students);
    const studentLoading = useStudentStore((s) => s.loading);

    const search = useStudentStore((s) => s.search);
    const setSearch = useStudentStore((s) => s.setSearch);

    const status = useStudentStore((s) => s.status);
    const classId = useStudentStore((s) => s.classId);

    const setStatus = useStudentStore((s) => s.setStatus);
    const setClassId = useStudentStore((s) => s.setClassId);
    const fetchStudents = useStudentStore((s) => s.fetchStudents);

    const classes = useClassStore((s) => s.classes);
    const fetchClasses = useClassStore((s) => s.fetchClasses);

    const branchId = useAppFilterStore((s) => s.branchId);
    const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

    const [selectedClassId, setSelectedClassId] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [goToPage, setGoToPage] = useState("1");

    const itemsPerPage = 10;

    // SYNC SEARCH TỪ URL
    useEffect(() => {
        const keyword = searchParams.get("search");
        if (keyword) {
            setSearch(keyword);
        }
    }, [searchParams, setSearch]);

    // FIX: reset filter khi rời trang
    useEffect(() => {
        return () => {
            useStudentStore.setState({
                search: "",
                status: undefined,
                classId: undefined,
            });
        };
    }, []);

    const totalPages = Math.ceil(students.length / itemsPerPage) || 1;

    const currentItems = useMemo(
        () =>
            students.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ),
        [students, currentPage]
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

    const getGenderLabel = (gender: number) => (gender === 1 ? "Nam" : "Nữ");

    const getStatusLabel = (status: number) =>
        status === STUDENT_STATUS.STUDYING ? "Đang học" : "Đã nghỉ học";

    useEffect(() => {
        fetchClasses();

        setSelectedClassId("all");
        setClassId(undefined);

        setSelectedStatus("all");
        setStatus(undefined);

        setCurrentPage(1);
        setGoToPage("1");
    }, [branchId, schoolYearId]);

    useEffect(() => {
        if (!branchId || !schoolYearId) return;

        fetchStudents();
    }, [branchId, schoolYearId, search, classId, status]);

    useEffect(() => {
        setCurrentPage(1);
        setGoToPage("1");
    }, [search, classId, status, branchId, schoolYearId]);

    const deleteStudent = useStudentStore((s) => s.deleteStudent);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteClick = (studentId: string) => {
        setSelectedStudentId(studentId);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedStudentId) return;

        try {
            setDeleteLoading(true);
            await deleteStudent(selectedStudentId);

            if (currentPage > 1 && currentItems.length === 1) {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                setGoToPage(String(prevPage));
            }

            setConfirmOpen(false);
            setSelectedStudentId(null);

            await fetchStudents();
        } catch (err) {
            alert("Xóa học sinh thất bại!");
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "dd-MM-yyyy");
        } catch {
            return dateString;
        }
    };

    useEffect(() => {
        setGoToPage(String(currentPage));
    }, [currentPage]);

    return (
        <>
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <PageHeader
                        title="Quản lý học sinh"
                        subtitle="Quản lý thông tin và hồ sơ học sinh"
                    />

                    <div className="flex gap-3">
                        <Button
                            onClick={onImport}
                            className="flex gap-3 bg-white text-xs shadow-sm font-medium border-gray-200 hover:bg-gray-100/50"
                        >
                            <Upload className="size-[12px]" />
                            Import CSV
                        </Button>

                        <Button
                            onClick={() => setOpen(true)}
                            className="flex gap-3 bg-black text-xs shadow-sm text-white hover:bg-black/60">
                            <Plus className="size-[12px]" />
                            Thêm học sinh
                        </Button>
                    </div>
                </div>

                <Card className="rounded-xl shadow-sm bg-white border-gray-300 py-9 mt-5">
                    <CardContent className="flex items-center gap-3">
                        <div className="relative flex items-center flex-[1]">
                            <Search className="text-gray-400 size-[12px] absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="search"
                                placeholder="Tìm kiếm học sinh..."
                                className="pl-10 !h-8 border-gray-200 bg-gray-50/50 !text-xs font-medium text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                            />
                        </div>

                        {/* SELECT LỚP */}
                        <Select
                            value={selectedClassId}
                            onValueChange={(val) => {
                                setSelectedClassId(val);
                                setClassId(val === "all" ? undefined : val);
                            }}
                        >
                            <SelectTrigger className="text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 flex-[1]">
                                <SelectValue placeholder="Tất cả lớp" />
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
                                    Tất cả lớp
                                </SelectItem>

                                {classes.map((c) => (
                                    <SelectItem
                                        key={c.id}
                                        value={c.id}
                                        className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* SELECT TRẠNG THÁI */}
                        <Select
                            value={selectedStatus}
                            onValueChange={(val) => {
                                setSelectedStatus(val);
                                setStatus(val === "all" ? undefined : Number(val));
                            }}
                        >
                            <SelectTrigger className="flex-[1] text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                <SelectValue placeholder="Tất cả trạng thái" />
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
                                    Tất cả trạng thái
                                </SelectItem>

                                {STUDENT_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="cursor-pointer hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card className="rounded-xl shadow-sm bg-white border-gray-300 mt-5">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="text-xs border-gray-200">
                                    <TableHead className="font-bold px-4 py-3">Mã HS</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Họ và tên</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Lớp</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Ngày sinh</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Giới tính</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Trạng thái</TableHead>
                                    <TableHead className="font-bold px-4 py-3">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentItems.map((s) => (
                                    <TableRow key={s.id} className="text-xs font-medium hover:bg-gray-50 border-gray-200">
                                        <TableCell className="px-4 py-3 font-bold">{s.code}</TableCell>
                                        <TableCell className="px-4 py-3">{s.fullName}</TableCell>
                                        <TableCell className="px-4 py-3">{s.className}</TableCell>
                                        <TableCell className="px-4 py-3">{formatDate(s.dateOfBirth)}</TableCell>
                                        <TableCell className="px-4 py-3">{getGenderLabel(s.gender)}</TableCell>

                                        <TableCell className="px-4 py-3">
                                            <span
                                                className={`px-2 py-[2px] rounded-lg font-medium ${s.status === STUDENT_STATUS.STUDYING
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-50 text-red-500"
                                                    }`}
                                            >
                                                {getStatusLabel(s.status)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-4 py-3">
                                            <div className="flex gap-3">
                                                <div className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <Eye className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        setSelectedStudent(s)
                                                        setUpdateOpen(true)
                                                    }}
                                                    className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <SquarePen className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>

                                                <div
                                                    onClick={() => handleDeleteClick(s.id)}
                                                    className="flex px-2 py-1 items-center justify-center border-gray-400 border-[1px] shadow-sm rounded-md">
                                                    <Trash2 className="size-[12px] cursor-pointer hover:text-black/50" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!studentLoading && currentItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-sm text-gray-500">
                                            Không có dữ liệu học sinh
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
                                        <PaginationLink className="bg-black text-white hover:bg-black/80 hover:text-white rounded h-8 w-8">
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


            <AddStudentModal open={open} onOpenChange={setOpen} />
            <UpdateStudentModal student={selectedStudent} open={updateOpen} onOpenChange={setUpdateOpen} />

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Xác nhận xóa học sinh</DialogTitle>
                    </DialogHeader>

                    <div className="font-medium text-sm text-gray-700 mt-2">
                        Bạn có chắc chắn muốn xóa học sinh này không? Hành động này không thể hoàn tác.
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
        </>
    );
}

