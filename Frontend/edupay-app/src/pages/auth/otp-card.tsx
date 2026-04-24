

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOtpApi } from "@/lib/api/auth";
import { ArrowLeft, ShieldCheck } from "lucide-react";

type Props = {
    email: string;
    expiredAt: string;
    onBack: () => void;
    onSuccess: (resetToken: string) => void; // 🔥 sửa
};

export default function OtpCard({
    email,
    expiredAt,
    onBack,
    onSuccess,
}: Props) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        const expire = new Date(expiredAt).getTime();

        const updateTime = () => {
            const diff = Math.max(
                0,
                Math.floor((expire - new Date().getTime()) / 1000)
            );

            setTimeLeft(diff);

            if (diff === 0) {
                setError(null);
            }

            return diff;
        };

        updateTime();

        const interval = setInterval(() => {
            const diff = updateTime();
            if (diff <= 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiredAt]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const handleVerify = async () => {
        if (timeLeft !== null && timeLeft <= 0) return;

        if (otp.length !== 6) {
            setError("Vui lòng nhập đủ 6 số OTP");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const resetToken = await verifyOtpApi({
                email,
                otp,
            });

            onSuccess(resetToken); // trả token
        } catch (err: any) {
            if (timeLeft !== null && timeLeft > 0) {
                setError(err.response?.data?.title || "Xác thực thất bại");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[400px] shadow-xl bg-white flex flex-col gap-6 px-4 py-6">
            <CardHeader className="text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.05)] my-8">
                    <ShieldCheck className="text-blue-600" size={55} />
                </div>
                <h1 className="text-2xl font-bold">Xác thực OTP</h1>
                <p className="text-sm font-medium text-gray-500 mt-2">
                    Nhập mã OTP đã gửi đến {email}
                </p>
            </CardHeader>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                }}
            >
                <CardContent className="flex flex-col gap-6">
                    <div className="flex justify-center items-center gap-2">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            autoFocus
                        >
                            <InputOTPGroup className="flex gap-3 w-full">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <InputOTPSlot
                                        key={i}
                                        index={i}
                                        className="text-center text-xl py-5 w-12"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        {timeLeft !== null && timeLeft > 0 ? (
                            <>
                                OTP hết hạn sau{" "}
                                <span className="font-semibold text-black">
                                    {formatTime(timeLeft)}
                                </span>
                            </>
                        ) : (
                            <span className="font-semibold text-red-500">
                                OTP đã hết hạn
                            </span>
                        )}
                    </p>

                    {error && timeLeft !== null && timeLeft > 0 && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <div className="flex gap-3">
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
                            type="submit"
                            disabled={loading || (timeLeft !== null && timeLeft <= 0)}
                            className="flex-1 bg-black text-white hover:bg-black/60"
                            onMouseDown={(e) => e.preventDefault()} 
                        >
                            {loading ? "Đang xác thực..." : "Xác nhận"}
                        </Button>
                    </div>
                </CardContent>
                </form >
        </Card>
    );
}