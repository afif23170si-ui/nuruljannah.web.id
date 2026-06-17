import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const albums = await prisma.galleryAlbum.findMany({
    include: {
      images: true,
    },
  })
  console.dir(albums, { depth: null })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
