export default interface UserInterface {
    id: number;
    name: string;
    email: string;
    username: string;
    password?: string;
    salary?: number;
    salarySubtraction?: boolean;
}
