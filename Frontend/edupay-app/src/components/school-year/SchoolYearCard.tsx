import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Plus, SquarePen, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import type { SchoolYear } from "@/lib/api/schoolYear";
import { useState } from "react";
import { UpdateSchoolYearModal } from "./UpdateSchoolYearModal";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";
import { format } from "date-fns";



interface Props {
    data: SchoolYear;
}

export function SchoolYearCard({ data }: Props) {
    const [updateOpen, setUpdateOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { deleteSchoolYear } = useSchoolYearStore();

    const handleDelete = async () => {
        if (!data.id) return;
        try {
            setLoading(true);
            await deleteSchoolYear(data.id);
            setConfirmOpen(false);
        } catch (error) {
            console.error("Xóa không thành công", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) =>
        format(new Date(date), "dd/MM/yyyy");

    return (
        <>
            <Card className="bg-white">
                <CardHeader className="flex flex-col gap-1">
                    <div className="w-full flex justify-end items-center gap-3">
                        <div
                            onClick={() => setUpdateOpen(true)}
                            className="flex justify-center items-center w-8 h-8 rounded-lg border-blue-500 border-[1px] hover:bg-blue-50">
                            <SquarePen className="size-4 text-blue-500 hover:cursor-pointer"
                            />
                        </div>
                        <div
                            onClick={() => setConfirmOpen(true)}
                            className="flex justify-center items-center w-8 h-8 rounded-lg border-red-500 border-[1px] hover:bg-red-50">
                            <Trash2 className="size-4 text-red-500 hover:cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="flex bg-blue-100 w-10 h-10 rounded-lg items-center justify-center">
                            <Calendar className="size-5 text-blue-600" />
                        </div>
                        <span className="font-bold text-[15px]">{data.name}</span>
                    </div>

                    <div className="w-full flex items-center justify-between mt-4">
                        <span className="text-xs font-medium text-gray-500">
                            Thời gian:
                        </span>
                        <span className="text-xs font-bold">
                            {formatDate(data.startDate)} - {formatDate(data.endDate)}
                        </span>
                    </div>

                    <Separator className="w-full bg-gray-300 h-[0.5px] mt-4" />
                </CardHeader>

                <CardContent className="pb-4">
                    <span className="text-xs font-bold">Các học kỳ</span>

                    <div className="flex flex-col gap-3 mt-3 items-center">
                        <Calendar className="text-gray-400" />
                        <span className="text-gray-500 font-medium">
                            Chưa có học kỳ nào
                        </span>

                        <Button className="flex gap-3 border-gray-300 shadow-sm text-xs">
                            <Plus />
                            Thêm học kỳ
                        </Button>
                    </div>
                </CardContent>
            </Card>


            {/* Confirm Delete Modal */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Xác nhận xóa năm học</DialogTitle>
                    </DialogHeader>
                    <div className="font-medium text-sm text-gray-700 mt-2">
                        Bạn có chắc chắn muốn xóa năm học này không? Hành động này không thể hoàn tác.
                    </div>
                    <DialogFooter className="flex justify-end gap-2 mt-4 border-t border-none">
                        <Button className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors" variant="outline" onClick={() => setConfirmOpen(false)}>Hủy</Button>
                        <Button
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-500 text-white hover:bg-red-600 px-3 font-bold"
                        >
                            {loading ? "Đang xóa..." : "Xóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UpdateSchoolYearModal open={updateOpen} onOpenChange={setUpdateOpen} data={data} />
        </>
    );
}
