// import {
//     Dialog,
//     DialogContent
// } from "@/components/ui/dialog";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { useState } from "react";
// import { TEACHER_STATUS_OPTIONS } from "@/constants/status";
// import type { Teacher } from "@/lib/api/teacher";

// interface Props {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     teacher: Teacher | null;
// }

// export function UpdateTeacherModal({ open, onOpenChange, teacher }: Props) {
//     const [status, setStatus] = useState<string | undefined>();

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl px-6 py-5">
//                 <div className="flex flex-col gap-1">
//                     <label className="text-lg font-semibold">Cập nhật giáo viên</label>
//                     <p className="text-sm text-gray-400 font-semibold">
//                         Chỉnh sửa thông tin giáo viên
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="flex flex-col gap-1">
//                         <label className="flex gap-3 text-sm font-bold">
//                             Mã giáo viên <span className="text-red-500">*</span>
//                         </label>
//                         <Input
//                             placeholder="VD: HS001"
//                             className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <label className="flex gap-3 text-sm font-bold">
//                             Họ và tên <span className="text-red-500">*</span>
//                         </label>
//                         <Input
//                             placeholder="VD: Nguyễn Văn A"
//                             className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <label className="flex gap-3 text-sm font-bold">
//                             Email đăng nhập App <span className="text-red-500">*</span>
//                         </label>
//                         <Input
//                             placeholder="vd@domain.com"
//                             className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <label className="text-sm font-bold">
//                             Số điện thoại
//                         </label>
//                         <Input
//                             placeholder="0123456789"
//                             className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                     <label className="text-sm font-bold">Trạng thái</label>
//                     <Select
//                         value={status} onValueChange={setStatus}
//                     >
//                         <SelectTrigger className="w-full text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200">
//                             <SelectValue placeholder="Chọn trạng thái" />
//                         </SelectTrigger>

//                         <SelectContent className="bg-white border border-gray-100 shadow-lg">
//                             {TEACHER_STATUS_OPTIONS.map((opt) => (
//                                 <SelectItem
//                                     key={opt.value}
//                                     value={opt.value}
//                                     className="data-[highlighted]:bg-gray-200 font-medium"
//                                 >
//                                     {opt.label}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>


//                 <div className="flex justify-end gap-3 mt-3 mb-1">
//                     <Button
//                         variant="outline"
//                         className="bg-white px-4 shadow-sm border-gray-200 text-gray-700 hover:bg-gray-100 font-bold"
//                         onClick={() => onOpenChange(false)}
//                     >
//                         Hủy
//                     </Button>

//                     <Button className="bg-black shadow-sm text-white hover:bg-black/60"
//                     >
//                         Thêm giáo viên
//                     </Button>
//                 </div>



//             </DialogContent>
//         </Dialog>
//     )
// }

import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { TEACHER_STATUS_OPTIONS } from "@/constants/status";
import type { Teacher } from "@/lib/api/teacher";
import { useTeacherStore } from "@/stores/useTeacherStore";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacher: Teacher | null;
}

export function UpdateTeacherModal({ open, onOpenChange, teacher }: Props) {
    const updateTeacher = useTeacherStore((s) => s.updateTeacher);

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [status, setStatus] = useState<string | undefined>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= FILL DATA =================
    useEffect(() => {
        if (open && teacher) {
            setCode(teacher.code || "");
            setName(teacher.name || "");
            setEmail(teacher.email || "");
            setPhoneNumber(teacher.phoneNumber || "");
            setStatus(String(teacher.status));
        }
    }, [open, teacher]);

    // ================= RESET ERROR =================
    useEffect(() => {
        if (!open) {
            setError("");
        }
    }, [open]);

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (!code || !name || !email) {
            setError("Vui lòng nhập đầy đủ các trường bắt buộc");
            return;
        }

        if (!teacher) return;

        try {
            setLoading(true);
            setError("");

            await updateTeacher(teacher.id, {
                code: code.trim(),
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim() || null,
                status: Number(status) || 1,
            });

            onOpenChange(false);
        } catch (err) {
            console.error(err);
            setError("Cập nhật giáo viên thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()} 
            className="sm:max-w-[420px] bg-white rounded-2xl px-6 py-5">
                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold">Cập nhật giáo viên</label>
                    <p className="text-sm text-gray-400 font-semibold">
                        Chỉnh sửa thông tin giáo viên
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="flex gap-3 text-sm font-bold">
                            Mã giáo viên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="VD: HS001"
                            className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex gap-3 text-sm font-bold">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Nguyễn Văn A"
                            className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex gap-3 text-sm font-bold">
                            Email đăng nhập App <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vd@domain.com"
                            className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold">
                            Số điện thoại
                        </label>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0123456789"
                            className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Trạng thái</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>

                        <SelectContent className="bg-white border border-gray-100 shadow-lg">
                            {TEACHER_STATUS_OPTIONS.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="data-[highlighted]:bg-gray-200 font-medium"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                 {error && (
                    <div className="text-red-500 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-3 mb-1">
                    <Button
                        variant="outline"
                        className="bg-white px-4 shadow-sm border-gray-200 text-gray-700 hover:bg-gray-100 font-bold"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Hủy
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-black shadow-sm text-white hover:bg-black/60"
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật giáo viên"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}