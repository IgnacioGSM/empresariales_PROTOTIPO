declare namespace Express {
    export interface Request {
        user?: {
            userId: string
            rol: string
            sucursalId: string
            conductorId?: string
        };
    }
}