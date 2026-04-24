import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { STATUS_OPTIONS_MODAL } from "@/constants/status";
import { useEffect, useState } from "react";
import { useGradeStore } from "@/stores/useGradeStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddGradeModal({ open, onOpenChange }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { createGrade } = useGradeStore();

    useEffect(() => {
    if (!open) {
        setName("");
        setDescription("");
        setStatus(true);
        setError(null);
        setLoading(false);
    }
}, [open]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Tên khối không được để trống");
            return;
        }

        const { branchId, schoolYearId } = useAppFilterStore.getState();

        if (!branchId || !schoolYearId) {
            setError("Vui lòng chọn chi nhánh và năm học");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createGrade({
                name,
                description,
                status,
                branchId,
                schoolYearId
            });

            // reset form
            setName("");
            setDescription("");
            setStatus(true);

            onOpenChange(false);

        } catch (err: any) {
            setError(err?.response?.data?.message || "Tạo khối thất bại");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl px-6 py-5">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Thêm khối học mới
                    </DialogTitle>
                </DialogHeader>

                {/* BODY */}
                <div className="flex flex-col gap-4">

                    {/* Tên khối */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Tên khối *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên khối học"
                            className="font-medium border-gray-200 placeholder:text-gray-400 h-10 
              focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                    </div>

                    {/* Mô tả */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Mô tả</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả khối học"
                            className="font-medium border-gray-200 placeholder:text-gray-400 h-20 
              focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                        />
                        <span className="text-[11px] text-gray-400 text-right font-medium">
                            0 / 500 ký tự
                        </span>
                    </div>

                    {/* Trạng thái */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">Trạng thái</label>
                        <Select
                            defaultValue="active"
                            onValueChange={(value) => setStatus(value === "active")}
                        >
                            <SelectTrigger
                                className="w-full data-[placeholder]:text-gray-400 !h-10 bg-gray-50/50 
    font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                            >
                                <SelectValue placeholder="Hoạt động" />
                            </SelectTrigger>

                            <SelectContent className="bg-white border border-gray-100 shadow-lg">
                                {STATUS_OPTIONS_MODAL.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                        className="font-medium data-[highlighted]:bg-gray-100"
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-gray-200 font-bold px-4 hover:bg-gray-100"
                        >
                            Hủy
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-black text-white hover:bg-black/60 shadow-sm transition-colors"
                        >
                            <div className="flex gap-2 items-center">
                                {loading ? "Đang lưu..." : "Thêm mới"}
                            </div>
                        </Button>
                    </div>
                </div>
            {error && (
                <div className="text-red-500 text-sm font-medium text-center px-3 py-2 rounded-md border-none">
                    {error}
                </div>
            )}
            </DialogContent>
        </Dialog>
    );
}