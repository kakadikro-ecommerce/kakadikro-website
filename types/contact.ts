export interface Contact {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactState {
    loading: boolean;
    success: boolean;
    error: string | null;
}