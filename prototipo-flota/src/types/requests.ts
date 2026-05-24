

export interface Request {
    id: string;
    cliente: string;
    destino: string;
    cargaRequerida: number;
    fechaLimite: string;
    estado: string;
    trabajoId: string | null;
}