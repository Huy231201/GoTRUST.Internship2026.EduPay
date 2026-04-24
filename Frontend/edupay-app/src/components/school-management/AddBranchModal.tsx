
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
import { Save } from "lucide-react";
import { SCHOOL_LEVEL_MAP, SCHOOL_TYPE_MAP } from "@/constants/school-constants";
import { useBranchStore } from "@/stores/useBranchStore";
import { useState, useEffect } from "react";
import type { BranchLevel, BranchType } from "@/lib/api/branch/branch-type";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBranchModal({ open, onOpenChange }: Props) {
  const { createBranch } = useBranchStore();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [taxCode, setTaxCode] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [type, setType] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Reset form function
  const resetForm = () => {
    setName("");
    setCode("");
    setAddress("");
    setPhone(null);
    setEmail(null);
    setTaxCode(null);
    setLevel(null);
    setType(null);
    setError(null);
  };

  // ✅ Reset khi đóng modal
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSave = async () => {
    if (!name || !code || !address) {
      setError("Tên cơ sở, Mã cơ sở và Địa chỉ là bắt buộc");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createBranch({
        name,
        code,
        address,
        phone,
        email,
        taxCode,
        level: level as BranchLevel,
        type: type as BranchType,
      });

      resetForm(); // ✅ reset sau khi tạo thành công
      onOpenChange(false);
    } catch (err: any) {
      setError("Tạo cơ sở thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Thêm cơ sở mới</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Tên cơ sở */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Tên cơ sở *</label>
            <Input
              placeholder="Nhập tên cơ sở"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
            />
          </div>

          {/* Mã cơ sở + Loại hình */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Mã cơ sở *</label>
              <Input
                placeholder="Nhập mã cơ sở"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Loại hình</label>
              <Select onValueChange={(value) => setType(Number(value) as BranchType)}>
                <SelectTrigger className="w-full data-[placeholder]:text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                >
                  {Object.entries(SCHOOL_TYPE_MAP).map(([key, label]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="cursor-pointer hover:bg-gray-500
                      data-[highlighted]:bg-gray-100
                      data-[state=checked]:bg-gray-200 font-medium"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cấp học */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Cấp học</label>
            <Select onValueChange={(value) => setLevel(Number(value) as BranchLevel)}>
              <SelectTrigger className="w-full data-[placeholder]:text-gray-400 !h-9 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                <SelectValue placeholder="Chọn cấp học" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
              >
                {Object.entries(SCHOOL_LEVEL_MAP).map(([key, label]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="cursor-pointer hover:bg-gray-500
                    data-[highlighted]:bg-gray-100
                    data-[state=checked]:bg-gray-200 font-medium"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Địa chỉ */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Địa chỉ *</label>
            <Textarea
              placeholder="Nhập địa chỉ"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              className="resize-none font-medium border-gray-200 placeholder:text-gray-400 h-14 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
            />
          </div>

          {/* SĐT + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value || null)}
                className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Email</label>
              <Input
                placeholder="Nhập email"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value || null)}
                className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
              />
            </div>
          </div>

          {/* Mã số thuế */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold">Mã số thuế</label>
            <Input
              placeholder="Nhập mã số thuế"
              value={taxCode || ""}
              onChange={(e) => setTaxCode(e.target.value || null)}
              className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-200 shadow-sm font-bold px-3 hover:bg-gray-100 hover:border-gray-300 transition-colors"
            >
              Hủy
            </Button>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-black text-white hover:bg-black/60 shadow-sm transition-colors"
            >
              <div className="flex gap-3 items-center">
                <Save size={16} />
                {loading ? "Đang lưu..." : "Lưu"}
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}