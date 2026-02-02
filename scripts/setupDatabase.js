const { execSync } = require('child_process');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

try {
  console.log('🚀 Creating database...');
  run('node scripts/createDatabase.js');

  console.log('📦 Generating Prisma client...');
  run('npx prisma generate');

  console.log('🧱 Creating tables...');
  run('cd backend && npx prisma migrate dev --name init');

  console.log('🌱 Seeding database...');
  run('cd backend && npx prisma db seed');

  console.log('🎉 DATABASE SETUP COMPLETE');
} catch (err) {
  console.error('❌ Setup failed', err);
}