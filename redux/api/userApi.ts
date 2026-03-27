import axios from "@/lib/axios";

export const registerUser = async (credentials: any) => {
    const response = await axios.post("/auth/register", credentials);
    return response.data;
};
export const loginUser = async (credentials: any) => {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axios.get("/users/get-profile");
    return response.data;
};

export const updateUserProfile = async (data: { name: string }) => {
    const response = await axios.put("/users/update-profile", data);
    return response.data;
};

export const changePassword = async (
    id: string,
    data: { currentPassword: string; newPassword: string }
) => {
    const response = await axios.put(`/users/change-password/${id}`, data);
    return response.data;
};
