
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Upload,
  Circle,
  Download,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { downloadStudentTemplate } from "@/lib/api/student";
import { useStudentStore } from "@/stores/useStudentStore";
import { toast } from "sonner";

type Props = {
  onBack: () => void;
};

export default function ImportStudentView({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const { branchId, schoolYearId } = useAppFilterStore();
  const { importStudentsFromFile } = useStudentStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "text/csv": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
    },
  });

  const handleDownloadTemplate = async () => {
    if (!branchId || !schoolYearId) return;

    try {
      const blob = await downloadStudentTemplate(branchId, schoolYearId);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "student-import-template.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const getStepStyle = (current: number) =>
    step >= current ? "bg-black text-white" : "bg-gray-100 text-gray-500";

  const getTextStyle = (current: number) =>
    step >= current ? "text-black" : "text-gray-500";

  const handleNext = async () => {
    if (step === 1) {
      if (!file) {
        toast.error("Vui lòng chọn tệp Excel trước khi tiếp tục", {
          style: {
            borderLeft: "4px solid #ef4444",
            borderRadius: "8px",
          },
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      try {
        const res = await importStudentsFromFile(file!);
        setResult(res);
        setStep(3);
      } catch (err) {
        toast.error("Import thất bại");
      }
    } else if (step === 3) {
      onBack();
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(1);
      setFile(null);
      setResult(null);
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    onBack();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Nhập danh sách học sinh từ CSV"
        subtitle="Thực hiện nhập danh sách học sinh từ tệp"
      />

      <div>
        <Card className="bg-white border-gray-300 shadow-md pb-1">
          <CardContent className="flex flex-col pb-2">
            {/* STEP HEADER */}
            <div className="flex items-center justify-center pt-5 gap-3">
              <div className="flex gap-2 items-center">
                <div
                  className={`flex w-8 h-8 rounded-full items-center justify-center text-xs font-medium ${getStepStyle(
                    1
                  )}`}
                >
                  1
                </div>
                <label className={`text-xs font-bold ${getTextStyle(1)}`}>
                  Tải lên tệp
                </label>
              </div>

              <div className="w-10 h-[0.5px] bg-gray-200" />

              <div className="flex gap-2 items-center">
                <div
                  className={`flex w-8 h-8 rounded-full items-center justify-center text-xs font-medium ${getStepStyle(
                    2
                  )}`}
                >
                  2
                </div>
                <label className={`text-xs font-bold ${getTextStyle(2)}`}>
                  Xác nhận
                </label>
              </div>

              <div className="w-10 h-[0.5px] bg-gray-200" />

              <div className="flex gap-2 items-center">
                <div
                  className={`flex w-8 h-8 rounded-full items-center justify-center text-xs font-medium ${getStepStyle(
                    3
                  )}`}
                >
                  3
                </div>
                <label className={`text-xs font-bold ${getTextStyle(3)}`}>
                  Hoàn tất
                </label>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div
                {...getRootProps()}
                className={`mt-6 border border-dashed rounded-xl p-9 flex flex-col items-center justify-center text-center cursor-pointer
                ${
                  isDragActive
                    ? "border-blue-600 bg-blue-100"
                    : "border-blue-500 bg-blue-50/30"
                }
                `}
                style={{
                  backgroundColor: "#F8FAFF",
                  backgroundImage: `
                    repeating-linear-gradient(
                      -10deg,
                      rgba(59,130,246,0.02),
                      rgba(59,130,246,0.02) 2px,
                      transparent 8px,
                      transparent 16px
                    )
                  `,
                }}
              >
                <input {...getInputProps()} />

                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                  <FileSpreadsheet className="text-blue-500 size-6" />
                </div>

                <p className="text-medium font-bold text-[14px] mb-3">
                  {isDragActive ? "Thả file vào đây..." : "Kéo thả tệp Excel vào đây"}
                </p>

                <p className="text-xs font-bold text-gray-400 mb-3">
                  hoặc nhấn để chọn tệp từ máy tính
                </p>

                <Button className="flex gap-2 bg-blue-600 text-white text-xs h-8 px-4">
                  <Upload />
                  Chọn tệp Excel
                </Button>

                <div className="flex items-center mt-4 text-gray-500 text-xs gap-1">
                  <p>Hỗ trợ các định dạng: .xlsx, .xls, .csv</p>
                  <Circle className="size-1 fill-current" />
                  <p>Tối đa 10MB</p>
                </div>

                {file && <p className="mt-3 text-sm text-blue-600">Đã chọn: {file.name}</p>}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && file && (
              <div className="mt-6 p-4 border rounded flex flex-col items-center">
                <p className="text-sm font-medium">File đã chọn:</p>
                <p className="text-blue-600">{file.name}</p>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && result && (
              <div className="mt-6 p-4 border rounded flex flex-col items-center">
                <p>Tổng: {result.totalRows}</p>
                <p>Thành công: {result.successCount}</p>
                <p>Thất bại: {result.failedCount}</p>

                {result.errors?.map((err: string, i: number) => (
                  <p key={i} className="text-red-500">
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* DOWNLOAD TEMPLATE */}
            <div className="mt-6 w-full rounded-lg border border-blue-100 bg-blue-50/60 px-5 py-5 flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-md bg-blue-100 flex items-center justify-center">
                  <Download className="text-blue-600 size-5" />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-[#5b6490]">
                    Tải xuống mẫu tệp CSV
                  </p>

                  <p className="text-sm text-blue-600 font-medium">
                    Sử dụng mẫu tệp CSV để đảm bảo dữ liệu được nhập chính xác và tránh
                    lỗi khi xử lý
                  </p>

                  <div>
                    <Button
                      onClick={handleDownloadTemplate}
                      variant="outline"
                      className="flex gap-3 bg-white mt-2 text-xs h-7 px-3 border-blue-200 text-blue-600 shadow-sm hover:text-blue-700"
                    >
                      <Download />
                      Tải xuống mẫu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-100 px-0 pt-0">
            <div className="flex pt-5 pb-7 bg-gray-50/50 w-full justify-between items-center px-8">
              <Button
                onClick={handleBack}
                className="flex gap-4 rounded-lg bg-white shadow-sm border-gray-100 font-md text-xs hover:bg-gray-100/50"
              >
                <ChevronLeft />
                Quay lại
              </Button>

              <Button
                onClick={handleNext}
                className="flex gap-4 rounded-lg bg-black shadow-sm border-gray-100 text-xs text-white font-md hover:bg-black/60"
              >
                Tiếp tục
                <ChevronRight />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
