

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Eye, EyeOff, Check, ArrowLeft, LockKeyhole } from "lucide-react"
import { resetPasswordApi } from "@/lib/api/auth"

type Props = {
    resetToken: string
    onBack: () => void
    onSuccess: () => void
}

export default function ResetPasswordCard({ resetToken, onBack, onSuccess }: Props) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const passwordRules = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }

    const isPasswordValid = Object.values(passwordRules).every(Boolean)
    const isMatch = password && confirmPassword && password === confirmPassword
    const isFormValid = isPasswordValid && isMatch

    const handleReset = async () => {
        if (!isFormValid) return

        try {
            setLoading(true)
            setError(null)

            await resetPasswordApi({
                resetToken,
                newPassword: password,
            })

            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.title || "Đổi mật khẩu thất bại")
        } finally {
            setLoading(false)
        }
    }

    const renderRule = (valid: boolean, text: string) => (
        <li className={`flex items-center gap-2 text-sm font-medium ${valid ? "text-green-600" : "text-gray-400"}`}>
            <Check className={`w-4 h-4 ${valid ? "opacity-100" : "opacity-30"}`} strokeWidth={3} />
            {text}
        </li>
    )

    return (
        <Card className="w-[400px] shadow-xl bg-white flex flex-col gap-6 px-2 py-6">

            <CardHeader className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.05)] my-2">
                    <LockKeyhole className="text-blue-600" size={55} />
                </div>
                <h1 className="text-2xl font-bold text-center">
                    Đặt lại mật khẩu
                </h1>

                <p className="text-sm text-gray-500 text-center font-medium">
                    Nhập mật khẩu mới của bạn
                </p>
            </CardHeader>

            {/* FORM */}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleReset()
                }}
            >
                <CardContent className="flex flex-col gap-4">

                    <div className="space-y-3">
                        <Label className="font-bold">Mật khẩu mới</Label>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
                                placeholder="Nhập mật khẩu mới"
                            />

                            <Button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff className="!w-5 !h-5" /> : <Eye className="!w-5 !h-5" />}
                            </Button>
                        </div>

                        <ul className="space-y-1 mt-2">
                            {renderRule(passwordRules.length, "Ít nhất 8 ký tự")}
                            {renderRule(passwordRules.upper, "Có chữ hoa (A-Z)")}
                            {renderRule(passwordRules.lower, "Có chữ thường (a-z)")}
                            {renderRule(passwordRules.number, "Có số (0-9)")}
                            {renderRule(passwordRules.special, "Có ký tự đặc biệt")}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <Label className="font-bold">Xác nhận mật khẩu</Label>

                        <div className="relative">
                            <Input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
                                placeholder="Nhập lại mật khẩu"
                            />

                            <Button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirm ? <EyeOff className="!w-5 !h-5" /> : <Eye className="!w-5 !h-5" />}
                            </Button>
                        </div>

                        {confirmPassword && (
                            <p className={`text-sm font-medium flex items-center gap-2 ${isMatch ? "text-green-600" : "text-red-500"}`}>
                                <Check className={`w-4 h-4 ${isMatch ? "opacity-100" : "opacity-30"}`} strokeWidth={3} />
                                {isMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <Button
                            type="button" 
                            variant="default"
                            className="flex-1 bg-gray-200 font-bold hover:bg-gray-200/50"
                            onClick={onBack}
                        >
                            <ArrowLeft strokeWidth={2} className="!w-5 !h-5" />
                            <span className="leading-none">Quay lại</span>
                        </Button>

                        <Button
                            type="submit" // enter chạy ở đây
                            disabled={!isFormValid || loading}
                            className="flex-1 bg-black text-white font-bold hover:bg-black/60"
                        >
                            {loading ? "Đang xử lý..." : "Thay đổi"}
                        </Button>
                    </div>

                </CardContent>
            </form>
        </Card>
    )
}