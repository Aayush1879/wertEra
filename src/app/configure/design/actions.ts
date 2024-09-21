"use server"

import { db } from "@/db"
import { ShirtColor, ShirtNeck, ShirtSize, ShirtSleeve, ShirtQuantity } from "@prisma/client"

export type SaveConfigArgs = {
    color : ShirtColor
    sleeve : ShirtSleeve
    size : ShirtSize
    neck : ShirtNeck   
    quantity : ShirtQuantity 
    configId: string
}
export async function saveConfig(
    {
        color,
        sleeve,
        size,
        neck,
        quantity,
        configId,
    }:
    SaveConfigArgs
) {
    await db.configuration.update({
        where: { id: configId },
        data: { color, sleeve, size, neck ,quantity},
    })
    
}