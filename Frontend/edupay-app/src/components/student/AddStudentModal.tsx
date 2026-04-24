
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";

import { useClassStore } from "@/stores/useClassStore";
import { useStudentStore } from "@/stores/useStudentStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";

import {
  GENDER_OPTIONS,
  STUDENT_TYPE_OPTIONS,
} from "@/constants/student-constants";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddStudentModal({ open, onOpenChange }: Props) {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();

  const [gender, setGender] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [classId, setClassId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const classes = useClassStore((s) => s.classes);
  const fetchClasses = useClassStore((s) => s.fetchClasses);

  const createStudent = useStudentStore((s) => s.createStudent);
  const fetchStudents = useStudentStore((s) => s.fetchStudents);

  const branchId = useAppFilterStore((s) => s.branchId);
  const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

  useEffect(() => {
    if (open && branchId && schoolYearId) {
      fetchClasses();
    }
  }, [open, branchId, schoolYearId, fetchClasses]);

  const resetForm = () => {
    setCode("");
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setDateOfBirth(undefined);
    setGender(undefined);
    setType(undefined);
    setClassId(undefined);
  };

  // Tự động reset form mỗi khi Modal đóng hoặc mở
  useEffect(() => {
    if (!open) {
      resetForm();
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!branchId || !schoolYearId) return;
    if (!code || !fullName || !dateOfBirth || !gender || !type || !classId) {
      setError("Vui lòng nhập đủ các trường thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);

      await createStudent({
        code: code.trim(),
        fullName: fullName.trim(),
        gender: Number(gender),
        dateOfBirth: format(dateOfBirth, "yyyy-MM-dd"),
        classId,
        type: Number(type),
        branchId,
        schoolYearId,
        email: email.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
      });

      await fetchStudents();
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast.error("Thêm học sinh thất bại", {
                style: {
                    borderLeft: '4px solid #ef4444', // Màu đỏ của Red-500
                    borderRadius: '8px',
                },
            });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px] rounded-xl py-4 px-6">
        <div className="flex flex-col gap-1">
          <label className="text-lg font-semibold">Thêm học sinh nhanh</label>
          <p className="text-sm text-gray-400 font-semibold">
            Nhập thông tin tối thiểu để tạo hồ sơ học sinh
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">
              Mã học sinh <span className="text-red-500">*</span>
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vd@domain.com"
              className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">Số điện thoại</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0123456789"
              className="h-9 bg-gray-50/50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 text-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">
              Giới tính <span className="text-red-500">*</span>
            </label>

            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg">
                {GENDER_OPTIONS.map((g) => (
                  <SelectItem
                    className="data-[highlighted]:bg-gray-200 font-medium"
                    key={g.value}
                    value={String(g.value)}
                  >
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">
              Ngày sinh <span className="text-red-500">*</span>
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 justify-start gap-3 bg-gray-50/50 border-gray-200 text-gray-400 text-sm font-medium"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "dd-MM-yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[240px] bg-white rounded-xl shadow-md border border-gray-300">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  initialFocus
                  captionLayout="dropdown"
                  locale={vi}
                  className="w-full"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">
              Lớp <span className="text-red-500">*</span>
            </label>

            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="w-full text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg">
                {classes.map((c) => (
                  <SelectItem
                    className="data-[highlighted]:bg-gray-200 font-medium"
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex gap-3 text-sm font-bold">
              Loại học sinh <span className="text-red-500">*</span>
            </label>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg">
                {STUDENT_TYPE_OPTIONS.map((t) => (
                  <SelectItem
                    className="data-[highlighted]:bg-gray-200 font-medium"
                    key={t.value}
                    value={String(t.value)}
                  >
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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
            {loading ? "Đang thêm..." : "Thêm học sinh"}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium text-center mt-2">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
