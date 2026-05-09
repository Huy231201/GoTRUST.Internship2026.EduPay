import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useSchoolYearStore } from "@/stores/useSchoolYearStore";

// store riêng cho report
import { useReportGradeStore } from "@/stores/useReportGradeStore";
import { useReportClassStore } from "@/stores/useReportClassStore";

import { STUDENT_STATUS_OPTIONS } from "@/constants/status";
import { DxReportViewer, RequestOptions } from "devexpress-reporting-react/dx-report-viewer";

import "devextreme/dist/css/dx.light.css";

import "@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.light.css";
import "devexpress-reporting/dist/css/dx-webdocumentviewer.css";

import { useAppFilterStore } from "@/stores/useAppFilterStore";

export default function StudentReport() {
    // ✅ FIX: dùng "" thay vì undefined
    const [schoolYearId, setSchoolYearId] = useState("");
    const [gradeId, setGradeId] = useState("");
    const [classId, setClassId] = useState("");
    const [status, setStatus] = useState("");

    const { schoolYears } = useSchoolYearStore();
    const { grades, fetchGrades } = useReportGradeStore();
    const { classes, fetchClasses } = useReportClassStore();
    const { branchId } = useAppFilterStore();

    // ===== LOAD DATA =====
    useEffect(() => {
        if (!branchId) return;

        const params: {
            branchId: string;
            schoolYearId?: string;
        } = {
            branchId,
        };

        if (schoolYearId) {
            params.schoolYearId = schoolYearId;
        }

        fetchGrades(params);
        fetchClasses(params);

        setGradeId("");
        setClassId("");
    }, [branchId, schoolYearId]);

    // ===== FILTER CLASS THEO GRADE =====
    useEffect(() => {
        if (!branchId) return;

        const params: {
            branchId: string;
            schoolYearId?: string;
            gradeId?: string;
        } = {
            branchId,
        };

        if (schoolYearId) {
            params.schoolYearId = schoolYearId;
        }

        if (gradeId) {
            params.gradeId = gradeId;
        }

        fetchClasses(params);

        setClassId("");
    }, [gradeId]);

    // ===== BUILD QUERY PARAMS =====
    const queryParams = new URLSearchParams({
        BranchId: branchId || "",
        SchoolYearId: schoolYearId,
        GradeId: gradeId,
        ClassId: classId,
        Status: status,
    }).toString();

    return (
        <>
            {/* Title */}
            <h2 className="text-lg font-bold">
                DANH SÁCH HỌC SINH
            </h2>

            {/* Filter */}
            <Card className="border-gray-200 shadow-lg bg-white rounded-lg">
                <CardContent className="flex flex-col gap-3">

                    {/* Label */}
                    <div className="flex gap-3 text-xs font-bold">
                        Bộ lọc điều kiện
                        <span className="text-gray-400">
                            (DANH SÁCH HỌC SINH)
                        </span>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-4 gap-3">

                        {/* Niên khóa */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold">Niên khóa</label>
                            <Select
                                value={schoolYearId}
                                onValueChange={(val) =>
                                    setSchoolYearId(val === "ALL" ? "" : val)
                                }
                            >
                                <SelectTrigger className="w-full text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Niên khóa" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    <SelectItem
                                        value="ALL"
                                        className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        Tất cả
                                    </SelectItem>

                                    {schoolYears.map((sy) => (
                                        <SelectItem
                                            key={sy.id}
                                            value={sy.id}
                                            className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {sy.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Khối */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold">Khối</label>
                            <Select
                                value={gradeId}
                                onValueChange={(val) =>
                                    setGradeId(val === "ALL" ? "" : val)
                                }
                            >
                                <SelectTrigger className="w-full text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Khối" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    <SelectItem
                                        value="ALL"
                                        className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        Tất cả
                                    </SelectItem>

                                    {grades.map((g) => (
                                        <SelectItem
                                            key={g.id}
                                            value={g.id}
                                            className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Lớp */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold">Lớp</label>
                            <Select
                                value={classId}
                                onValueChange={(val) =>
                                    setClassId(val === "ALL" ? "" : val)
                                }
                            >
                                <SelectTrigger className="w-full text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Lớp" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    <SelectItem
                                        value="ALL"
                                        className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        Tất cả
                                    </SelectItem>

                                    {classes.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={c.id}
                                            className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tình trạng */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold">
                                Tình trạng học
                            </label>
                            <Select
                                value={status}
                                onValueChange={(val) =>
                                    setStatus(val === "ALL" ? "" : val)
                                }
                            >
                                <SelectTrigger className="w-full text-gray-400 text-xs !h-8 bg-gray-50/50 font-medium border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300">
                                    <SelectValue placeholder="Tình trạng học" />
                                </SelectTrigger>

                                <SelectContent
                                    position="popper"
                                    side="bottom"
                                    align="start"
                                    className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
                                >
                                    <SelectItem
                                        value="ALL"
                                        className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                    >
                                        Tất cả
                                    </SelectItem>

                                    {STUDENT_STATUS_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                            className="cursor-pointer data-[highlighted]:bg-gray-100 data-[state=checked]:bg-gray-200 font-medium"
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <div className="border-t border-gray-300 !mt-4 !mb-6" />

            {/* REPORT */}
            <div className="w-full">
                <DxReportViewer
                    reportUrl={`StudentReport?${queryParams}`}
                    height="500px"
                    width="100%"
                >
                    <RequestOptions
                        // host="http://localhost:5000"
                        host={import.meta.env.VITE_API_URL}
                        invokeAction="/DXXRDV"
                    />
                </DxReportViewer>
            </div>
        </>
    );
}