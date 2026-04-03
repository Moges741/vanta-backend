import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  // Create Test User
  const user = await prisma.user.upsert({
    where: { email: 'test@vanta.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@vanta.com',
      name: 'Vanta Tester',
      password: 'mockpassword', // Since auth isn't fully set up yet
    },
  });

  // Create Category
  const category = await prisma.category.upsert({
    where: { name: 'Technology' },
    update: {},
    create: {
      name: 'Technology',
    },
  });

  // Recreate Event to ensure a predictable ID exists
  await prisma.event.deleteMany({ where: { id: 'test-event-id' } }).catch(() => {});
  
  const event = await prisma.event.create({
    data: {
      id: 'test-event-id', // Predictable ID
      title: 'Vanta Beta Launch Party',
      description: 'Testing the new Engagement Modules!',
      duration: 120,
      categoryId: category.id,
      creatorId: user.id,
    },
  });

  console.log('Database Seeded Successfully! ✅');
  console.log(`Test User ID: ${user.id}`);
  console.log(`Test Event ID: ${event.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
