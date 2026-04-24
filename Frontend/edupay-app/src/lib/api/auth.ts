
import { api } from "../axios";

export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string; 
  fullName: string;
  schoolId: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}


export interface LogoutRequest {
  refreshToken: string;
}

export const loginApi = async (
  data: LoginRequest
): Promise<LoginResult> => {
  const response = await api.post("/auth/login", data);

  const res = response.data;

  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    fullName: res.user?.fullName,
    schoolId: res.user?.schoolId,
  };
};

// logoutApi nhận refreshToken từ ngoài
export const logoutApi = async (
  data: LogoutRequest
) => {
  const res = await api.post("/auth/logout", data);
  return res.data;
};

export const forgotPasswordApi = async (
  data: ForgotPasswordRequest
) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};

export const verifyOtpApi = async (
  data: VerifyOtpRequest
): Promise<string> => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const resetPasswordApi = async (
  data: ResetPasswordRequest
): Promise<boolean> => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};