

// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Mail, ArrowLeft } from "lucide-react"
// import { forgotPasswordApi } from "@/lib/api/auth"
// import { useState } from "react"

// type ForgotPasswordCardProps = {
//   onBack: () => void
//   onSuccess: (email: string, expiredAt: string) => void 
// }

// export default function ForgotPasswordCard({ onBack, onSuccess }: ForgotPasswordCardProps) {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const isValidEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

//   const handleSendOtp = async () => {
//     if (!email.trim()) {
//       setError("Nhập email để gửi mã OTP")
//       return
//     }

//     if (!isValidEmail(email)) {
//       setError("Định dạng email không hợp lệ")
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)

//       const res = await forgotPasswordApi({ email })

//       if (res?.expiredAt) {
//         onSuccess(email, res.expiredAt) 
//         return
//       }

//     } catch (err: any) {
//       setError(err.response?.data?.title || "Gửi OTP thất bại")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="w-[400px] shadow-xl bg-white flex flex-col gap-6 px-2 py-6">

//       <CardHeader className="flex flex-col items-center gap-4">

//         <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.05)] my-8">
//           <Mail className="text-blue-600" size={55} />
//         </div>

//         <h1 className="text-2xl font-bold text-center">
//           Quên mật khẩu
//         </h1>

//         <p className="text-sm text-gray-500 text-center font-medium">
//           Nhập email hoặc số điện thoại để nhận mã OTP đặt lại mật khẩu
//         </p>

//       </CardHeader>

//       <CardContent className="flex flex-col gap-4">

//         <div className="space-y-2">
//           <Label className="font-bold">Email hoặc số điện thoại</Label>
//           <Input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
//             placeholder="Nhập email hoặc số điện thoại"
//           />
//         </div>

//         {error && (
//           <p className="text-red-500 text-sm text-center">{error}</p>
//         )}

//         <div className="flex gap-3 mt-2">

//           <Button
//             variant="default"
//             className="flex-1 bg-gray-200 font-bold hover:bg-gray-200/50"
//             onClick={onBack}
//           >
//             <ArrowLeft strokeWidth={2} className="!w-5 !h-5" />
//             <span className="leading-none">Quay lại</span>
//           </Button>

//           <Button
//             className="flex-1 text-white font-bold bg-black hover:bg-black/60"
//             onClick={handleSendOtp}
//             disabled={loading}
//           >
//             {loading ? "Đang gửi..." : "Gửi mã OTP"}
//           </Button>

//         </div>

//       </CardContent>

//     </Card>
//   )
// }

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"
import { forgotPasswordApi } from "@/lib/api/auth"
import { useState } from "react"

type ForgotPasswordCardProps = {
  onBack: () => void
  onSuccess: (email: string, expiredAt: string) => void 
}

export default function ForgotPasswordCard({ onBack, onSuccess }: ForgotPasswordCardProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Nhập email để gửi mã OTP")
      return
    }

    if (!isValidEmail(email)) {
      setError("Định dạng email không hợp lệ")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await forgotPasswordApi({ email })

      if (res?.expiredAt) {
        onSuccess(email, res.expiredAt) 
        return
      }

    } catch (err: any) {
      setError(err.response?.data?.title || "Gửi OTP thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px] shadow-xl bg-white flex flex-col gap-6 px-2 py-6">

      <CardHeader className="flex flex-col items-center gap-4">

        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.05)] my-8">
          <Mail className="text-blue-600" size={55} />
        </div>

        <h1 className="text-2xl font-bold text-center">
          Quên mật khẩu
        </h1>

        <p className="text-sm text-gray-500 text-center font-medium">
          Nhập email hoặc số điện thoại để nhận mã OTP đặt lại mật khẩu
        </p>

      </CardHeader>

      {/* FORM để hỗ trợ Enter */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendOtp()
        }}
      >
        <CardContent className="flex flex-col gap-4">

          <div className="space-y-2">
            <Label className="font-bold">Email hoặc số điện thoại</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-gray-500 py-5 px-4 bg-gray-50 rounded-md border-none shadow-md text-md"
              placeholder="Nhập email hoặc số điện thoại"
            />
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
              type="submit" // Enter sẽ trigger cái này
              className="flex-1 text-white font-bold bg-black hover:bg-black/60"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>

          </div>

        </CardContent>
      </form>

    </Card>
  )
}
