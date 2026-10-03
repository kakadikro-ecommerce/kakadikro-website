export interface Contact {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactPayload {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

export interface ContactState {
    loading: boolean;
    success: boolean;
    error: string | null;
}