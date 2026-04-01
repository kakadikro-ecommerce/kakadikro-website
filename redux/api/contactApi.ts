import axios from "@/lib/axios";

export const createContact = async (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
}) => {
    const response = await axios.post("/v1/user/contacts", data);
    return response.data;
};
