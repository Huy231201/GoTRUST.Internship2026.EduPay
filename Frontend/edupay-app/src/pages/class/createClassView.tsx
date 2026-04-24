import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Save, School } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
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
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useGradeStore } from "@/stores/useGradeStore";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";
import { useClassStore } from "@/stores/useClassStore";

type Props = {
  onBack: () => void;
};

type PreviewClassRow = {
  stt: number;
  className: string;
  gradeName: string;
  schoolYearName: string;
};

export default function CreateClassView({ onBack }: Props) {
  const grades = useGradeStore((s) => s.grades);
  const fetchGrades = useGradeStore((s) => s.fetchGrades);
  const schoolYears = useSchoolYearStore((s) => s.schoolYears);

  const branchId = useAppFilterStore((s) => s.branchId);
  const schoolYearId = useAppFilterStore((s) => s.schoolYearId);

  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [startChar, setStartChar] = useState<string | null>(null);
  const [endChar, setEndChar] = useState<string | null>(null);
  const [startNumber, setStartNumber] = useState<number | null>(null);
  const [endNumber, setEndNumber] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const createBulkClasses = useClassStore((s) => s.createBulkClasses);
  const fetchClasses = useClassStore((s) => s.fetchClasses);
  const classLoading = useClassStore((s) => s.loading);

  useEffect(() => {
    fetchGrades();
  }, [branchId, schoolYearId, fetchGrades]);

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const selectedGrade = useMemo(
    () => grades.find((g) => g.id === selectedGradeId) ?? null,
    [grades, selectedGradeId]
  );
  const selectedGradeName = selectedGrade?.name ?? "Khối chưa chọn";
  const selectedGradeNumber = selectedGradeName.match(/\d+/)?.[0] ?? "";

  const selectedSchoolYearName = useMemo(() => {
    const schoolYear = schoolYears.find((s) => s.id === schoolYearId);
    return schoolYear?.name ?? "Năm học 2024-2025";
  }, [schoolYears, schoolYearId]);

  const isValidRange =
    startChar !== null &&
    endChar !== null &&
    startNumber !== null &&
    endNumber !== null &&
    startChar <= endChar &&
    startNumber <= endNumber;

  const totalClasses = isValidRange
    ? (endChar!.charCodeAt(0) - startChar!.charCodeAt(0) + 1) * (endNumber! - startNumber! + 1)
    : 0;

  const previewRows = useMemo<PreviewClassRow[]>(() => {
    if (!isValidRange) return [];

    const startCharCode = startChar!.charCodeAt(0);
    const endCharCode = endChar!.charCodeAt(0);
    const rows: PreviewClassRow[] = [];

    for (let charCode = startCharCode; charCode <= endCharCode; charCode += 1) {
      const letter = String.fromCharCode(charCode);
      for (let num = startNumber!; num <= endNumber!; num += 1) {
        rows.push({
          stt: rows.length + 1,
          className: `${selectedGradeNumber}${letter}${num}`,
          gradeName: selectedGradeName,
          schoolYearName: selectedSchoolYearName,
        });
      }
    }
    return rows;
  }, [
    endChar,
    endNumber,
    isValidRange,
    selectedGradeName,
    selectedGradeNumber,
    selectedSchoolYearName,
    startChar,
    startNumber,
  ]);

  const canCreate = totalClasses > 0 && showPreview;

  const handleCreateClasses = async () => {
  if (!selectedGradeId || !branchId || !schoolYearId) return;
  if (!startChar || !endChar || !startNumber || !endNumber) return;
  if (!showPreview || totalClasses === 0) return;

  try {
    await createBulkClasses({
      gradeId: selectedGradeId,
      schoolYearId,
      branchId,
      startLetter: startChar.toUpperCase(),
      endLetter: endChar.toUpperCase(),
      startNumber,
      endNumber,
    });
    await fetchClasses();
    setShowPreview(false);
    onBack();
  } catch (e) {
    console.error(e);
  }
};


  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button
          className="flex items-center gap-4 rounded-lg border-gray-300 bg-white text-xs font-bold shadow-sm hover:bg-gray-100/50"
          onClick={onBack}
        >
          <ArrowLeft />
          Quay lại
        </Button>
        <PageHeader
          title="Khai báo nhanh lớp học"
          subtitle="Tạo nhiều lớp học cùng lúc theo pattern tự động"
        />
      </div>

      <div className="flex w-full gap-3">
        <Card className="flex-[2] border border-gray-100 bg-white px-1 py-5 shadow-sm">
          <CardContent className="flex flex-col gap-5">
            <div className="mb-1 flex items-center gap-2">
              <School className="size-4" />
              <label className="font-bold">Cấu hình tạo lớp</label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold">Khối lớp</label>
              <Select value={selectedGradeId ?? undefined} onValueChange={setSelectedGradeId}>
                <SelectTrigger className="!h-9 w-full border-gray-200 bg-gray-50/50 !text-xs font-medium data-[placeholder]:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300">
                  <SelectValue placeholder="Chọn khối" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  avoidCollisions={false}
                  className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-y-auto border border-gray-100 bg-white shadow-lg"
                >
                  <SelectScrollUpButton className="flex items-center justify-center py-1">
                    ▲
                  </SelectScrollUpButton>

                  {grades.map((g) => (
                    <SelectItem
                      key={g.id}
                      value={g.id}
                      className="cursor-pointer font-medium hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                    >
                      {g.name}
                    </SelectItem>
                  ))}

                  <SelectScrollDownButton className="flex items-center justify-center py-1">
                    ▼
                  </SelectScrollDownButton>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-xs font-bold">Chữ cái bắt đầu</label>
                <Select value={startChar ?? undefined} onValueChange={setStartChar}>
                  <SelectTrigger className="!h-9 w-full border-gray-200 bg-gray-50/50 !text-xs font-medium data-[placeholder]:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300">
                    <SelectValue placeholder="Chọn chữ cái bắt đầu" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    avoidCollisions={false}
                    className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-y-auto border border-gray-100 bg-white shadow-lg"
                  >
                    <SelectScrollUpButton className="flex items-center justify-center py-1">
                      ▲
                    </SelectScrollUpButton>

                    {alphabet.map((char) => (
                      <SelectItem
                        key={char}
                        value={char}
                        className="cursor-pointer font-medium hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                      >
                        {char}
                      </SelectItem>
                    ))}

                    <SelectScrollDownButton className="flex items-center justify-center py-1">
                      ▼
                    </SelectScrollDownButton>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <label className="text-xs font-bold">Chữ cái kết thúc</label>
                <Select value={endChar ?? undefined} onValueChange={setEndChar}>
                  <SelectTrigger className="!h-9 w-full border-gray-200 bg-gray-50/50 !text-xs font-medium data-[placeholder]:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300">
                    <SelectValue placeholder="Chọn chữ cái kết thúc" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-y-auto border border-gray-100 bg-white shadow-lg"
                  >
                    <SelectScrollUpButton className="flex items-center justify-center py-1">
                      ▲
                    </SelectScrollUpButton>

                    {alphabet.map((char) => (
                      <SelectItem
                        key={char}
                        value={char}
                        className="cursor-pointer font-medium hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                      >
                        {char}
                      </SelectItem>
                    ))}

                    <SelectScrollDownButton className="flex items-center justify-center py-1">
                      ▼
                    </SelectScrollDownButton>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full items-end gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-xs font-bold">Số thứ tự lớp: 1-12</label>
                <Select
                  value={startNumber !== null ? String(startNumber) : undefined}
                  onValueChange={(v) => setStartNumber(Number(v))}
                >
                  <SelectTrigger className="!h-9 w-full border-gray-200 bg-gray-50/50 !text-xs font-medium data-[placeholder]:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300">
                    <SelectValue placeholder="Chọn số bắt đầu" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-y-auto border border-gray-100 bg-white shadow-lg">
                    <SelectScrollUpButton className="flex items-center justify-center py-1">
                      ▲
                    </SelectScrollUpButton>

                    {numbers.map((num) => (
                      <SelectItem
                        key={num}
                        value={String(num)}
                        className="cursor-pointer font-medium hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                      >
                        {num}
                      </SelectItem>
                    ))}

                    <SelectScrollDownButton className="flex items-center justify-center py-1">
                      ▼
                    </SelectScrollDownButton>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <Select
                  value={endNumber !== null ? String(endNumber) : undefined}
                  onValueChange={(v) => setEndNumber(Number(v))}
                >
                  <SelectTrigger className="!h-9 w-full border-gray-200 bg-gray-50/50 !text-xs font-medium data-[placeholder]:text-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300">
                    <SelectValue placeholder="Chọn số kết thúc" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60 w-[--radix-select-trigger-width] overflow-y-auto border border-gray-100 bg-white shadow-lg">
                    <SelectScrollUpButton className="flex items-center justify-center py-1">
                      ▲
                    </SelectScrollUpButton>

                    {numbers.map((num) => (
                      <SelectItem
                        key={num}
                        value={String(num)}
                        className="cursor-pointer font-medium hover:bg-gray-500 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200"
                      >
                        {num}
                      </SelectItem>
                    ))}

                    <SelectScrollDownButton className="flex items-center justify-center py-1">
                      ▼
                    </SelectScrollDownButton>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-[1] border border-gray-100 bg-white px-1 py-5 shadow-sm">
          <CardContent className="flex flex-col">
            <label className="mb-5 font-bold">Thao tác</label>

            <label className="mb-3 text-xs">
              Sẽ tạo: <span className="text-xs font-bold">{totalClasses} lớp</span>
            </label>

            <Button
              disabled={totalClasses === 0}
              onClick={() => setShowPreview((prev) => !prev)}
              className="mb-2 flex items-center gap-3 bg-black text-xs text-white shadow-sm hover:bg-black/60"
            >
              <Eye />
              {showPreview ? "Ẩn chi tiết" : "Xem trước chi tiết"}
            </Button>

            <Button
              onClick={handleCreateClasses}
              disabled={!canCreate || classLoading}
              className={`flex items-center gap-3 text-xs font-medium shadow-sm transition-colors ${canCreate
                  ? "bg-black text-white hover:bg-black/60"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-100"
                }`}
            >
              <Save />
              Tạo {totalClasses} lớp
            </Button>

          </CardContent>
        </Card>
      </div>

      {showPreview && (
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Chi tiết các lớp sẽ được tạo</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Khối</TableHead>
                  <TableHead>Năm học</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row) => (
                  <TableRow key={row.stt} className="border-b border-gray-200 hover:bg-transparent">
                    <TableCell>{row.stt}</TableCell>
                    <TableCell>{row.className}</TableCell>
                    <TableCell>{row.gradeName}</TableCell>
                    <TableCell>{row.schoolYearName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
