import axios from "@/lib/axios";
import { ContactPayload } from "@/types/contact";

export const createContact = async (data: ContactPayload) => {
    const response = await axios.post("/user/contacts", data);
    return response.data;
};
