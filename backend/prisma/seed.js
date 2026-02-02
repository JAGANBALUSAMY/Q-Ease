const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'System level administrator with ability to create organizations'
    },
    {
      name: 'ORGANISATION_ADMIN',
      description: 'Administrator for a specific organization'
    },
    {
      name: 'STAFF',
      description: 'Staff member who manages queues'
    },
    {
      name: 'USER',
      description: 'End user who joins queues'
    }
  ];

  try {
    // Use createMany with skipDuplicates for efficiency and safety
    const result = await prisma.roleModel.createMany({
      data: roles,
      skipDuplicates: true,
    });

    console.log(`✓ Roles seeded. Count: ${result.count}`);

    // Verify
    const allRoles = await prisma.roleModel.findMany();
    console.log('Current Roles:', allRoles.map(r => r.name));

  } catch (error) {
    console.error('Seeding error:', error);
  }

  console.log('✨ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });