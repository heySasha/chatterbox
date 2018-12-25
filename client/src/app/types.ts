export interface User {
    _id?: string;
    name: string;
    email: string;
    status?: string;
    password?: string;
    token?: string;
    confirm?: string;
    picture?: string;
    description?: string;
}

export interface Message {
    _id?: string;
    timestamp?: number;
    from: string;
    to: string;
    content: string;
}
