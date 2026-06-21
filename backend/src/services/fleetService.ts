import prisma from "../prisma.ts"
import { VEHICLE_STATES, DRIVER_STATES } from "../../domain/states.ts"



/*|--------------------------------------------------------------------------
| GET AVAILABLE RESOURCES BY BRANCH
|--------------------------------------------------------------------------
|
*/

export async function getAvailableResourcesByBranch(userId: string) {

    const user = await prisma.usuario.findUnique({
        where: { id: userId }
    })

    if (!user) {
        throw new Error("Usuario no encontrado")
    }
    
    const branchId = user.sucursalId

    if (!branchId) {
        throw new Error("Usuario no asignado a ninguna sucursal")
    }

    const vehiculos = await prisma.vehiculo.findMany({
        where: {
            sucursalId: branchId,
            estado: VEHICLE_STATES.AVAILABLE
        }
    })
    const conductores = await prisma.conductor.findMany({
        where: {
            sucursalId: branchId,
            estado: DRIVER_STATES.AVAILABLE
        }
    })
    
    return {
        vehiculos,
        conductores
    }
}