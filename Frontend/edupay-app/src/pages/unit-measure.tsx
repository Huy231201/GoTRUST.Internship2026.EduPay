import PageHeader from "../components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function UnitMeasurePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn vị tính"
        subtitle="Quản lý các đơn vị tính cho chi phí và dịch vụ"
      />

      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-md font-bold">Danh sách đơn vị tính</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader className="text-sm">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[44px]">STT</TableHead>
                <TableHead className="" >Mã đơn vị</TableHead>
                <TableHead>Tên đơn vị tính</TableHead>
                <TableHead>Phương pháp tính</TableHead>
                <TableHead>Ví dụ tính toán</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="border-b border-gray-200"> 
                <TableCell>1</TableCell>
                <TableCell className="font-mono text-sm">
                  01KK3VH8MYTR1EE4B4AJZQ17YA
                </TableCell>
                <TableCell>Ngày theo thời khóa biểu</TableCell>
                <TableCell>Theo ngày trong lịch</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[400px] whitespace-normal">
                  Tính theo số ngày trong lịch trình. Ví dụ: Tiền ăn theo số ngày trong tuần (5 ngày), nếu học sinh nghỉ 1 ngày thì vẫn tính tiền cho 5 ngày.
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow className="border-b border-gray-200">
                <TableCell>2</TableCell>
                <TableCell className="font-mono text-sm">
                  01KK3VGNZNBX9QMTVTAVNSCPXR
                </TableCell>
                <TableCell>Tháng</TableCell>
                <TableCell>Cố định</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[400px] whitespace-normal">
                  Số lượng cố định không phụ thuộc vào thời gian sử dụng. Ví dụ: Học phí tháng cố định 1.000.000đ dù học sinh có đi học đầy đủ hay không.
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>3</TableCell>
                <TableCell className="font-mono text-sm">
                  01KK3VG9P3WBV59FQHTCWPSFEM
                </TableCell>
                <TableCell>Ngày điểm danh</TableCell>
                <TableCell>Theo ngày có mặt</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[400px] whitespace-normal">
                  Tính theo số ngày thực tế có mặt. Ví dụ: Tiền ăn theo số ngày học sinh có mặt, nếu nghỉ 1 ngày thì chỉ tính tiền cho 4 ngày.
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-300 shadow-sm hover:bg-gray-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
