export interface Access {
    id: string;
    email: string;
    timestamp: string;
    updatedAt: string;
    patientAcceptedAt?: string;
    professionalAcceptedAt?: string;
}
