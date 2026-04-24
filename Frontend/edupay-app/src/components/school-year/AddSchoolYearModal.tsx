

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
import { useEffect, useState } from "react";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";
import { vi } from "date-fns/locale";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AddSchoolYearModal({ open, onOpenChange }: Props) {

    const { createSchoolYear } = useSchoolYearStore();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setName("");
            setDescription("");
            setStartDate(undefined);
            setEndDate(undefined);
            setError(null);
            setLoading(false);
        }
    }, [open]);

    const handleCreate = async () => {
        setError(null);
        setLoading(true);

        if (!name || !startDate || !endDate) {
            setLoading(false);
            setError("Năm học, ngày bắt đầu và ngày kết thúc là bắt buộc");
            return;
        }

        if (startDate > endDate) {
            setLoading(false);
            setError("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        // VALIDATE FORMAT YYYY-YYYY
        const parts = name.split("-");

        if (
            parts.length !== 2 ||
            isNaN(Number(parts[0])) ||
            isNaN(Number(parts[1]))
        ) {
            setLoading(false);
            setError("Tên năm học phải có dạng YYYY-YYYY");
            return;
        }

        const startYear = Number(parts[0]);
        const endYear = Number(parts[1]);

        if (startYear >= endYear) {
            setLoading(false);
            setError("Khoảng năm học không hợp lệ");
            return;
        }

        // VALIDATE DATE NẰM TRONG RANGE
        if (
            startDate.getFullYear() < startYear ||
            startDate.getFullYear() > endYear
        ) {
            setLoading(false);
            setError("Ngày bắt đầu phải nằm trong khoảng năm học");
            return;
        }

        if (
            endDate.getFullYear() < startYear ||
            endDate.getFullYear() > endYear
        ) {
            setLoading(false);
            setError("Ngày kết thúc phải nằm trong khoảng năm học");
            return;
        }

        try {
            await createSchoolYear({
                name,
                description,
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            });

            setName("");
            setDescription("");
            setStartDate(undefined);
            setEndDate(undefined);

            setError(null);
            onOpenChange(false);

        } catch (err: any) {
            setError(
                "Tạo năm học thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white sm:max-w-[430px] rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Thêm năm học mới
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Tên năm học</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: 2024-2025"
                            className="font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Mô tả</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="VD: Năm học hiện tại"
                            className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                    </div>

                    <div className="flex gap-3">
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
                                        initialFocus
                                        className="w-full"
                                        captionLayout="dropdown"
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

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
                                        initialFocus
                                        captionLayout="dropdown"
                                        className="w-full"
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button
                            className="flex-1 bg-black text-white hover:bg-black/60 rounded-lg shadow-md"
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            {loading ? "Đang thêm..." : "Thêm năm học"}
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

                {error && (
                    <div className="flex justify-center text-red-500 text-sm font-medium mt-2">
                        {error}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}