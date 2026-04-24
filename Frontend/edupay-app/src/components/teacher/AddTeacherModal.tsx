// import {
//     Dialog,
//     DialogContent
// } from "@/components/ui/dialog";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// interface Props {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export function AddTeacherModal({ open, onOpenChange }: Props) {
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl px-6 py-5">
//                 <div className="flex flex-col gap-1">
//                     <label className="text-lg font-semibold">Thêm giáo viên nhanh</label>
//                     <p className="text-sm text-gray-400 font-semibold">
//                         Nhập thông tin tối thiểu để tạo hồ sơ giáo viên
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
import { useState, useEffect } from "react";

import { useTeacherStore } from "@/stores/useTeacherStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddTeacherModal({ open, onOpenChange }: Props) {
    // ===== form state =====
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ===== store =====
    const createTeacher = useTeacherStore((s) => s.createTeacher);

    const branchId = useAppFilterStore((s) => s.branchId);
    const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

    // ===== reset form =====
    const resetForm = () => {
        setCode("");
        setName("");
        setEmail("");
        setPhoneNumber("");
        setError(null);
    };

    useEffect(() => {
        if (!open) resetForm();
    }, [open]);

    // ===== submit =====
    const handleSubmit = async () => {
       
        if (!code.trim() || !name.trim() || !email.trim()) {
            setError("Vui lòng nhập đầy đủ các trường bắt buộc");
            return;
        }

        if (!branchId || !schoolYearId) {
            setError("Vui lòng chọn chi nhánh và năm học");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createTeacher({
                code: code.trim(),
                name: name.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim() || null,
                branchId,
                schoolYearId,
            });

            resetForm();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Thêm giáo viên thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl px-6 py-5">
                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold">Thêm giáo viên nhanh</label>
                    <p className="text-sm text-gray-400 font-semibold">
                        Nhập thông tin tối thiểu để tạo hồ sơ giáo viên
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

                  {/* ===== ERROR ===== */}
                {error && (
                    <div className="mt-2 text-sm text-red-600 text-center font-medium">
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
                        className="bg-black shadow-sm text-white hover:bg-black/60"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang thêm..." : "Thêm giáo viên"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}