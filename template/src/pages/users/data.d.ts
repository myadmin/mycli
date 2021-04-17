export interface SingleUserType {
    id: number | undefined;
    name: string;
    email: string;
    create_time: string;
    update_time: string;
    status: number;
}

export interface FormValues {
    [name: string]: any;
}
