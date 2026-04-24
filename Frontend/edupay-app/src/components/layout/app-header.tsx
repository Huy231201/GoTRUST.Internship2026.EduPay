

import { useEffect, useState } from "react";
import { Search, Calendar, Bell, Settings, Download, User, LogOut, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useBranchStore } from "@/stores/useBranchStore";
import { useAppFilterStore } from "@/stores/useAppFilterStore";
import { useSchoolYearStore } from "@/stores/useSchoolYearStore";
import { searchApi, type SearchResponse } from "@/lib/api/search";
import { GraduationCap, Users, BookOpen } from "lucide-react";

export function AppHeader() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const fullName = useAuthStore((s) => s.fullName);

  const { branches, fetchBranches } = useBranchStore();
  const { schoolYears, fetchSchoolYears } = useSchoolYearStore();

  const branchId = useAppFilterStore((s) => s.branchId);
  const schoolYearId = useAppFilterStore((s) => s.schoolYearId);
  const setBranchId = useAppFilterStore((s) => s.setBranchId);
  const setSchoolYearId = useAppFilterStore((s) => s.setSchoolYearId);

  // search state
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch data
  useEffect(() => {
    fetchBranches();
    fetchSchoolYears();
  }, []);

  // set mặc định branch
  useEffect(() => {
    if (branches.length > 0) {
      const currentBranchExists = branches.some((branch) => branch.id === branchId);
      if (currentBranchExists) return;

      const mainBranch = branches.find((b) => b.isMain);
      const id = mainBranch ? mainBranch.id : branches[0].id;

      setBranchId(id);
    }
  }, [branches, branchId, setBranchId]);

  // set mặc định schoolYear
  useEffect(() => {
    if (schoolYears.length > 0) {
      const currentSchoolYearExists = schoolYears.some((year) => year.id === schoolYearId);
      if (currentSchoolYearExists) return;

      const id = schoolYears[0].id;
      setSchoolYearId(id);
    }
  }, [schoolYears, schoolYearId, setSchoolYearId]);

  // search API (debounce)
  useEffect(() => {
    if (!keyword.trim()) {
      setResults(null);
      return;
    }

    const fetchSearch = async () => {
      try {
        setLoading(true);

        const res = await searchApi({
          search: keyword,
          branchId,
          schoolYearId,
        });

        setResults(res);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [keyword, branchId, schoolYearId]);

  const closeSearch = () => {
    setResults(null);
    setKeyword("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-[58px] flex items-center justify-between px-6 border-b border-gray-100 bg-white">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <Search className="text-gray-400 size-4 absolute left-3 top-1/2 -translate-y-1/2" />

          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm..."
            className="pl-9 w-[300px] h-[34px] border-gray-300 text-sm text-[#969696] focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:border-gray-300 "
            type="search"
          />

          {/* DROPDOWN SEARCH */}
          {results && (
            <div className="absolute top-full mt-1 w-[300px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-2 text-sm">

              {/* HEADER */}
              <div className="px-2 py-1 text-black font-bold uppercase text-xs tracking-wide mb-2 bg-gray-50 rounded-lg">
                KẾT QUẢ TÌM KIẾM
              </div>

              {/* EMPTY STATE */}
              {results.classes.length === 0 &&
                results.students.length === 0 &&
                results.teachers.length === 0 && (
                  <div className="px-2 py-3 text-gray-400 text-sm font-medium text-center">
                    Không có kết quả phù hợp
                  </div>
                )}

              {/* CLASS */}
              {results.classes.length > 0 && (
                <>
                  <div className="px-2 py-1 text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                    <BookOpen className="size-4 text-blue-500" />
                    Lớp
                  </div>
                  {results.classes.map((c) => (
                    <div
                      key={c.id}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => {
                        navigate(`/class?search=${c.name}`);
                        closeSearch();
                      }}
                    >
                      {c.name}
                    </div>
                  ))}
                </>
              )}

              {/* STUDENT */}
              {results.students.length > 0 && (
                <>
                  <div className="px-2 py-1 text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                    <Users className="size-4 text-blue-500" />
                    Học sinh
                  </div>
                  {results.students.map((s) => (
                    <div
                      key={s.id}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => {
                        navigate(`/student?search=${s.name}`);
                        closeSearch();
                      }}
                    >
                      {s.name} ({s.className})
                    </div>
                  ))}
                </>
              )}

              {/* TEACHER */}
              {results.teachers.length > 0 && (
                <>
                  <div className="px-2 py-1 text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                    <GraduationCap className="size-4 text-blue-500" />
                    Giáo viên
                  </div>
                  {results.teachers.map((t) => (
                    <div
                      key={t.id}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => {
                        navigate(`/teacher?search=${t.name}`)
                        closeSearch();
                      }}
                    >
                      {t.name}
                    </div>
                  ))}
                </>
              )}

              {loading && (
                <div className="px-2 py-2 text-gray-400 text-xs">Đang tìm...</div>
              )}
            </div>
          )}
        </div>

        {/* SCHOOL YEAR SELECT */}
        <Select
          value={schoolYearId}
          onValueChange={(value) => {
            setSchoolYearId(value);
          }}
        >
          <SelectTrigger className="h-10 rounded-lg px-3 bg-white border-gray-200 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-blue-600" />
              <SelectValue placeholder="Chọn năm học" />
            </div>
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
          >
            {schoolYears.map((y) => (
              <SelectItem
                className="data-[highlighted]:bg-gray-100 text-sm font-medium"
                key={y.id}
                value={y.id}
              >
                {y.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* RIGHT (GIỮ NGUYÊN 100%) */}
      <div className="flex items-center gap-2">

        <Select
          value={branchId}
          onValueChange={(value) => {
            setBranchId(value);
          }}
        >
          <SelectTrigger className="w-52 gap-2 border-gray-300 bg-transparent hover:bg-gray-50 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700 min-w-0 w-full">
              <School className="size-4 text-red-600" />
              <div className="text-sm font-medium truncate flex-1 text-left">
                <SelectValue placeholder="Chọn chi nhánh" />
              </div>
            </div>
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            align="start"
            className="z-50 w-[--radix-select-trigger-width] bg-white border border-gray-100 shadow-lg"
          >
            {branches.map((b) => (
              <SelectItem
                className="data-[highlighted]:bg-gray-100 text-sm font-medium"
                key={b.id}
                value={b.id}
              >
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Download className="size-4" />
          <span className="text-sm font-medium">Cài đặt App</span>
        </button>

        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full">
          <Bell className="size-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 ml-1 px-2 py-1 hover:bg-gray-50 rounded-2xl border-none">
              <Avatar className="size-8">
                <AvatarFallback className="bg-red-600 text-white">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{fullName}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mt-2 py-1 bg-white border border-gray-100 shadow-xl rounded-xl">
            <DropdownMenuItem className="gap-2 focus:bg-gray-100 py-2.5 px-3">
              <User className="size-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Hồ sơ cá nhân</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 focus:bg-gray-100 py-2.5 px-3">
              <Settings className="size-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Cài đặt</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 group py-2.5 px-3 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="size-4 group-focus:text-red-500" />
              <span className="text-sm font-semibold group-focus:text-red-600">Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
