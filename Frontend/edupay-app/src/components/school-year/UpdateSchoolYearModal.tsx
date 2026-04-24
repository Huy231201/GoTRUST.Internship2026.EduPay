import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import type { SchoolYear } from "@/lib/api/schoolYear";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";
import { vi } from "date-fns/locale";


type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: SchoolYear;

};

export function UpdateSchoolYearModal({ open, onOpenChange, data }: Props) {
    const { updateSchoolYear } = useSchoolYearStore();

    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && data) {
            setName(data.name);
            setDescription(data.description || "");
            setStartDate(data.startDate ? new Date(data.startDate) : undefined);
            setEndDate(data.endDate ? new Date(data.endDate) : undefined);
        }
    }, [data, open]);

    useEffect(() => {
        if (!open) {
            setError(null);
            setLoading(false);
        }
    }, [open]);


    const handleUpdate = async () => {

        setError(null);

        if (!name || !startDate || !endDate) {
            setError("Năm học, ngày bắt đầu và ngày kết thúc là bắt buộc");
            return;
        }

        if (startDate > endDate) {
            setError("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        try {
            setLoading(true);

            await updateSchoolYear(data.id, {
                name,
                description,
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            });

            onOpenChange(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="bg-white sm:max-w-[430px] rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Cập nhật năm học
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    {/* NAME */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Tên năm học</label>
                        <Input
                            value={name}
                            // autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: 2024-2025"
                            className="font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                    </div>

                    {/* DESC */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Mô tả</label>
                        <Input
                            value={description}
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="VD: Năm học hiện tại"
                            className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                    </div>

                    {/* DATE */}
                    <div className="flex gap-3">
                        {/* START */}
                        <div className="flex-1">
                            <label className="text-sm font-bold">Ngày bắt đầu</label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="mt-1 w-full justify-start gap-4 bg-white border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100"
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {startDate
                                            ? format(startDate, "dd-MM-yyyy")
                                            : "Chọn ngày"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[240px] bg-white rounded-xl shadow-md border border-gray-300">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        className="w-full"
                                        captionLayout="dropdown"
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* END */}
                        <div className="flex-1">
                            <label className="text-sm font-bold">Ngày kết thúc</label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="mt-1 w-full justify-start gap-4 bg-white border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100"
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {endDate
                                            ? format(endDate, "dd-MM-yyyy")
                                            : "Chọn ngày"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-[240px] bg-white rounded-xl shadow-md border border-gray-300">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        className="w-full"
                                        captionLayout="dropdown"
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {error && (
                    <div className="text-red-500 text-sm text-center mt-2">
                        {error}
                    </div>
                )}

                    {/* ACTION */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            className="flex-1 bg-black text-white hover:bg-black/60 rounded-lg shadow-md"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 font-bold bg-white border-gray-300 text-gray-700 hover:bg-gray-200 rounded-lg shadow-md"
                            onClick={() => onOpenChange(false)}
                        >
                            Hủy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}