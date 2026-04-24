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
import { RefreshCw } from "lucide-react";
import { SCHOOL_LEVEL_MAP, SCHOOL_TYPE_MAP } from "@/constants/school-constants";
import { useBranchStore } from "@/stores/useBranchStore";
import type { BranchType, BranchLevel, BranchItem } from "@/lib/api/branch/branch-type";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: BranchItem | null;
}

export function UpdateBranchModal({ open, onOpenChange, branch }: Props) {
  const { updateBranch } = useBranchStore();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [taxCode, setTaxCode] = useState<string | null>(null);
  const [level, setLevel] = useState<BranchLevel | null>(null);
  const [type, setType] = useState<BranchType | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (open) {
    setError(null);

    if (branch) {
      setName(branch.name);
      setCode(branch.code);
      setAddress(branch.address);
      setPhone(branch.phone ?? null);
      setEmail(branch.email ?? null);
      setTaxCode(branch.taxCode ?? null);
      setLevel(branch.level ?? null);
      setType(branch.type ?? null);
    }
  }
}, [open, branch]);

  const handleUpdate = async () => {
    if (!branch) return;

    if (!name || !code || !address) {
      setError("Tên cơ sở, Mã cơ sở và Địa chỉ là bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateBranch(branch.id, {
        name,
        code,
        address,
        phone,
        email,
        taxCode,
        level,
        type
      });

      onOpenChange(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật cơ sở");
    } finally {
      setLoading(false);
    }
  }




  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent  onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[400px] bg-white rounded-2xl px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Cập nhật cơ sở
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}


          <div className="flex flex-col gap-3">
            {/* Tên cơ sở */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Tên cơ sở *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên cơ sở"
                className="font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
              />
            </div>

            {/* Mã cơ sở + Loại hình */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Mã cơ sở *</label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã cơ sở"
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
                        className="
                        cursor-pointer
                        data-[highlighted]:bg-gray-100
                        data-[state=checked]:bg-gray-200
                        font-medium
                      "
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
              <Select

               onValueChange={(value) => setLevel(Number(value) as BranchLevel)}>
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
                      className="
                      cursor-pointer
                      data-[highlighted]:bg-gray-100
                      data-[state=checked]:bg-gray-200
                      font-medium
                    "
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
                value={address || ""}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ"
                className="resize-none font-medium border-gray-200 placeholder:text-gray-400 h-14 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
              />
            </div>

            {/* SĐT + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Số điện thoại</label>
                <Input
                  value={phone || ""}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold">Email</label>
                <Input
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  className="bg-gray-50/50 font-medium border-gray-200 placeholder:text-gray-400 h-9 focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300"
                />
              </div>
            </div>

            {/* Mã số thuế */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Mã số thuế</label>
              <Input
                value={taxCode || ""}
                onChange={(e) => setTaxCode(e.target.value)}
                placeholder="Nhập mã số thuế"
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
                onClick={handleUpdate}
                disabled={loading}
                className="bg-black text-white hover:bg-black/60 shadow-sm transition-colors">
                <div className="flex gap-3 items-center">
                  <RefreshCw size={16} />
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}