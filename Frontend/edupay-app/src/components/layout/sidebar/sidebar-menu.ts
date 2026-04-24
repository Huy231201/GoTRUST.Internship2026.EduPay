import { Home, User, GraduationCap, Users, Calendar, DollarSign, Utensils, Newspaper, Bell, ChartColumnIncreasing, Settings } from "lucide-react"

export const menuItems = [
    {
        id: "trang-chu",
        title: "Trang chủ",
        icon: Home,
        path: "/dashboard",
    },

    {
        id: "tai-khoan",
        title: "Tài khoản",
        icon: User,
        children: [
            { id: "tk-ho-so",title: "Hồ sơ cá nhân", path: "#" },
            { id: "tk-doi-mat-khau", title: "Đổi mật khẩu", path: "#" },
        ],
    },

    {
        id: "hoc-sinh",
        title: "Học sinh",
        icon: GraduationCap,
        children: [
            { id: "hs-ho-so", title: "Hồ sơ học sinh", path: "/student" },
            { id: "hs-diem-danh", title: "Điểm danh", path: "#" },
        ],
    },

    {
        id: "giao-vien",
        title: "Giáo viên",
        icon: Users,
        children: [
            { id: "gv-ho-so", title: "Hồ sơ giáo viên", path: "/teacher" },
            { id: "gv-phan-cong", title: "Phân công giảng dạy ", path: "#" }
        ]
    },

    {
        id: "thoi-khoa-bieu",
        title: "Thời khóa biểu",
        icon: Calendar,
        path: "#",
    },

    {
        id: "phi-dich-vu",
        title: "Phí & dịch vụ",
        icon: DollarSign, // Giả sử bạn dùng icon ví
        children: [
            { id: "pdv-cap-nhat", title: "Đang cập nhật", path: "#" },
        ]
    },

    {
        id: "thu-phi",
        title: "Thu phí",
        icon: DollarSign,
        isSpecial: true,
        children: [
            { id: "tp-cap-nhat", title: "Đang cập nhật", path: "#" },
        ]
    },

    {
        id: "quan-ly-thuc-don",
        title: "Quản lý thực đơn",
        icon: Utensils,
        children: [
            { id: "qltd-cap-nhat", title: "Đang cập nhật", path: "#" },
        ]
    },

    {
        id: "quan-ly-tin-tuc",
        title: "Quản lý tin tức",
        icon: Newspaper,
        children: [
            { id: "qltt-cap-nhat", title: "Đang cập nhật", path: "#" },
        ]
    },

    {
        id: "thong-bao-zalo",
        title: "Thông báo Zalo",
        icon: Bell,
        children: [
            { id: "tbz-cap-nhat", title: "Đang cập nhật", path: "#" },
        ]
    },

    {
        id: "bao-cao-thong-ke",
        title: "Báo cáo thống kê",
        icon: ChartColumnIncreasing,
        path: "/report"
    },

    {
        id: "he-thong",
        title: "Hệ thống",
        icon: Settings,
        children: [
            { id: "ht-thong-tin-nha-truong", title: "Thông tin nhà trường", path: "/school-management" },
            {
                id: "ht-khai-bao-du-lieu",
                title: "Khai báo dữ liệu",
                path: "#",
                children:
                    [
                        { id: "ht-thoi-gian-nam-hoc", title: "Thời gian năm học", path: "/school-year" },
                        { id: "ht-to-bo-mon", title: "Tổ bộ môn", path: "#" },
                        { id: "ht-lop-hoc", title: "Lớp học", path: "/class" },
                        { id: "ht-khoi-hoc", title: "Khối học", path: "/grade" },
                        { id: "ht-mon-hoc", title: "Môn học", path: "#" },
                        { id: "ht-chinh-sach-mien-giam", title: "Chính sách miễn giảm", path: "#" },
                        { id: "ht-cau-hinh-tiet-hoc", title: "Cấu hình tiết học", path: "#" },
                        { id: "ht-cau-hinh-ngay-nghi", title: "Cấu hình ngày nghỉ", path: "#" },
                        { id: "ht-don-vi-tinh", title: "Đơn vị tính", path: "/unit-measure" },
                        { id: "ht-ky-tai-chinh", title: "Kỳ tài chính", path: "#" }
                    ]
            },
            { id: "ht-quan-ly-nguoi-dung", title: "Quản lý người dùng", path: "#" },
            { id: "cau-hinh-he-thong", title: "Cấu hình hệ thống", path: "#" },
            { id: "ds-tai-khoan-ngan-hang", title: "Danh sách Tài khoản Ngân hàng", path: "#" }
        ]
    }
]