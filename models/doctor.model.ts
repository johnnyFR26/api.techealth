export interface Doctor {
    id: number;
    name: string;
    crm: string;
    specialty: string;
    phone?: string;
    email?: string;
    password?: string;
    hireDate?: Date;
}