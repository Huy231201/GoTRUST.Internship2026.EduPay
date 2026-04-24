

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import logo from "@/assets/edupay-logo.png"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

type LoginCardProps = {
  onForgot: () => void
}

export default function LoginCard({ onForgot }: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const login = useAuthStore(s => s.login)
  const loading = useAuthStore(s => s.loading)

  // reset error khi đổi route
  useEffect(() => {
    setError(null)
  }, [location.pathname])

  const handleLogin = async () => {
    // validate rỗng
    if (!account || !password) {
      setError("Tài khoản và mật khẩu không được để trống")
      return
    }

    setError(null)

    const success = await login(account, password, remember)

    // login fail
    if (!success) {
      setError("Sai tài khoản hoặc mật khẩu")
      return
    }

    // login success
    navigate("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLogin()
  }

  return (
    <Card className="w-[400px] shadow-xl bg-white flex flex-col gap-6 px-2 py-6">
      <CardHeader className="flex flex-col items-center gap-4">
        <img
          src={logo}
          className="w-20 h-20 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] my-8 p-3"
        />

        <h1 className="text-2xl font-bold text-center">
          Đăng nhập <span className="bg-gradient-to-r from-red-600 via-orange-600 to-orange-400 bg-clip-text text-transparent">EduPay Portal</span>
        </h1>

        <p className="text-sm text-gray-500 text-center font-medium">
          Đăng nhập để tiếp tục sử dụng hệ thống quản lý giáo dục
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}
          className="flex flex-col gap-4">

          <div className="space-y-2">
            <Label className="font-bold">Email hoặc Số điện thoại</Label>
            <Input
              className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
              placeholder="name@example.com hoặc 0123456789"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Mật khẩu</Label>
            <div className="relative">
              <Input
                className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />

              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="!h-5 !w-5" /> : <Eye className="!h-5 !w-5" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-small">
            <div className="flex items-center gap-2">
              <Checkbox
                className="h-4 w-4 data-[state=checked]:bg-black data-[state=checked]:text-white"
                checked={remember}
                onCheckedChange={(value) => setRemember(!!value)}
              />
              <span className="font-bold leading-none">Ghi nhớ đăng nhập</span>
            </div>

            <a
              onClick={onForgot}
              className="cursor-pointer font-bold">
              Quên mật khẩu?
            </a>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium mt-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full text-white py-5 bg-black rounded-xl hover:bg-black/60"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}