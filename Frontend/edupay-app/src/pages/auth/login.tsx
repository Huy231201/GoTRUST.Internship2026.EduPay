
import { useState } from "react"
import LoginCard from "./login-card"
import ForgotPasswordCard from "./forgot-password-card"
import OtpCard from "./otp-card"
import ResetPasswordCard from "./reset-password-card"

type Step = "login" | "forgot" | "otp" | "reset"

export default function LoginPage() {

  const [step, setStep] = useState<Step>("login")
  const [email, setEmail] = useState("")
  const [expiredAt, setExpiredAt] = useState("")
  const [resetToken, setResetToken] = useState("") 

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6FB]">

      {step === "login" && (
        <LoginCard onForgot={() => setStep("forgot")} />
      )}

      {step === "forgot" && (
        <ForgotPasswordCard
          onBack={() => setStep("login")}
          onSuccess={(email, expiredAt) => {
            setEmail(email)
            setExpiredAt(expiredAt)
            setStep("otp")
          }}
        />
      )}

      {step === "otp" && (
        <OtpCard
          email={email}
          expiredAt={expiredAt}
          onBack={() => setStep("forgot")}
          onSuccess={(token) => { // nhận token
            setResetToken(token)
            setStep("reset")
          }}
        />
      )}

      {step === "reset" && (
        <ResetPasswordCard
          resetToken={resetToken} // truyền token
          onBack={() => setStep("forgot")}
          onSuccess={() => setStep("login")}
        />
      )}

    </div>
  )
}
