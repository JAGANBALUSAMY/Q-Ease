const { prisma } = require('./index')

async function seedDatabase() {
  console.log('Seeding database...')
  
  // Create default roles
  const roles = [
    {
      id: 'role_super_admin',
      name: 'SUPER_ADMIN',
      description: 'Super administrator with full access',
    },
    {
      id: 'role_org_admin',
      name: 'ORGANISATION_ADMIN',
      description: 'Organisation administrator',
    },
    {
      id: 'role_staff',
      name: 'STAFF',
      description: 'Staff member',
    },
    {
      id: 'role_user',
      name: 'USER',
      description: 'Regular user',
    }
  ]
  
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: {
        id: role.id,
        name: role.name,
        description: role.description
      }
    })
  }
  
  console.log('Database seeded successfully!')
}

if (require.main === module) {
  seedDatabase()
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

module.exports = { seedDatabase }