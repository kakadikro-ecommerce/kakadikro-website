import axios from "@/lib/axios";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

export const registerUser = async (credentials: RegisterInput) => {
    const response = await axios.post("/user/auth/register", credentials);
    return response.data;
};

export const loginUser = async (credentials: LoginInput) => {
    const response = await axios.post("/user/auth/login", credentials);
    return response.data;
};

export const logoutApi = async () => {
    const response = await axios.post("/user/auth/logout");
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axios.get("/user/profile");
    return response.data;
};

export const updateUserProfile = async (data: { name: string }) => {
    const response = await axios.put("/user/profile", data);
    return response.data;
};

export const changePassword = async (
    id: string,
    data: { currentPassword: string; newPassword: string }
) => {
    const response = await axios.put(`/user/profile/password/${id}`, data);
    return response.data;
};
