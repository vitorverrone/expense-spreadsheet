export interface UserCreateUpdateInterface {
    name: string;
    email: string;
    username: string;
    password?: string;
    salary?: number;
    salarySubtraction?: boolean;
}
