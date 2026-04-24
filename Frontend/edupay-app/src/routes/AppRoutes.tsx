import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/login"
import AppLayout from "@/components/layout/app-layout"
import Dashboard from "@/pages/dashboard"
import SchoolPage from "@/pages/school-management"
import ProtectedRoute from "./ProtectedRoute"
import SchoolYearPage from "@/pages/school-year"
import UnitMeasurePage from "@/pages/unit-measure"
import GradePage from "@/pages/grade"
import ClassPage from "@/pages/class/class"
import StudentPage from "@/pages/student/student"
import TeacherPage from "@/pages/teacher"
import ReportPage from "@/pages/report"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
         {/*default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage/>} />
        
         {/* Dashboard layout */}
        <Route element=
        {
          <ProtectedRoute>
             <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/school-management" element={<SchoolPage />} />
          <Route path="/school-year" element={<SchoolYearPage />} />
          <Route path="/unit-measure" element={<UnitMeasurePage/>} />
          <Route path="/grade" element={<GradePage />} />
          <Route path="/class" element={<ClassPage />}/>
          <Route path="/student" element={<StudentPage />}/>
          <Route path="/teacher" element={<TeacherPage />}/>
          <Route path="/report" element={<ReportPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}