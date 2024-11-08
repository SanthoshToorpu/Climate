import { PrismaClient } from '@prisma/client'
import { onRampStatus, AuthType } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
export { onRampStatus, AuthType }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma