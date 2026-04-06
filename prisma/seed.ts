import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Pass@1234', 10);

  await prisma.rating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.eventAmenity.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.eventStep.deleteMany();
  await prisma.event.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@vanta.dev',
      password: passwordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      bio: 'Platform administrator',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Shambel T',
      email: 'shambel@vanta.dev',
      password: passwordHash,
      role: 'OWNER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      bio: 'Tech event organizer',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Abel M',
      email: 'abel@vanta.dev',
      password: passwordHash,
      role: 'OWNER',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      bio: 'Business and startup mentor',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Hanna K',
      email: 'hanna@vanta.dev',
      password: passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      bio: 'Enjoys learning and networking',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Meron A',
      email: 'meron@vanta.dev',
      password: passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      bio: 'Temporarily suspended account',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Daniel B',
      email: 'daniel@vanta.dev',
      password: passwordHash,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      bio: 'Banned account for moderation testing',
    },
  });

  // Set non-default statuses via SQL to support environments with stale generated Prisma client.
  await prisma.$executeRawUnsafe(
    `UPDATE "users" SET "status" = 'SUSPENDED' WHERE "email" = 'meron@vanta.dev'`,
  );
  await prisma.$executeRawUnsafe(
    `UPDATE "users" SET "status" = 'BANNED' WHERE "email" = 'daniel@vanta.dev'`,
  );

  await prisma.category.createMany({
    data: [
      { name: 'Technology' },
      { name: 'Business' },
      { name: 'Design' },
      { name: 'Marketing' },
    ],
  });

  const categories = await prisma.category.findMany();
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  await prisma.amenity.createMany({
    data: [
      { name: 'Free WiFi' },
      { name: 'Certificate' },
      { name: 'Parking' },
      { name: 'Lunch Included' },
      { name: 'Recording Access' },
    ],
  });

  const amenities = await prisma.amenity.findMany();
  const amenityByName = Object.fromEntries(amenities.map((a) => [a.name, a]));

  const event1 = await prisma.event.create({
    data: {
      title: 'NestJS Backend Bootcamp',
      description: 'Build production-ready APIs using NestJS, Prisma, and PostgreSQL.',
      duration: 180,
      location: 'Online',
      isPaid: true,
      price: 49.99,
      categoryId: categoryByName['Technology'].id,
      creatorId: owner1.id,
      startDate: new Date('2026-04-20T09:00:00Z'),
      endDate: new Date('2026-04-20T12:00:00Z'),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Startup Validation Workshop',
      description: 'Validate your startup idea with market-focused frameworks.',
      duration: 150,
      location: 'Addis Ababa Innovation Hub',
      isPaid: false,
      categoryId: categoryByName['Business'].id,
      creatorId: owner2.id,
      startDate: new Date('2026-04-25T08:30:00Z'),
      endDate: new Date('2026-04-25T11:00:00Z'),
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'UI Design Systems Masterclass',
      description: 'Learn scalable component design and consistent UX patterns.',
      duration: 120,
      location: 'Online',
      isPaid: true,
      price: 35,
      categoryId: categoryByName['Design'].id,
      creatorId: owner1.id,
      startDate: new Date('2026-05-02T10:00:00Z'),
      endDate: new Date('2026-05-02T12:00:00Z'),
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: 'Digital Marketing for Founders',
      description: 'Practical growth tactics for early stage products.',
      duration: 90,
      location: 'Online',
      isPaid: false,
      categoryId: categoryByName['Marketing'].id,
      creatorId: owner2.id,
      startDate: new Date('2026-05-08T14:00:00Z'),
      endDate: new Date('2026-05-08T15:30:00Z'),
    },
  });

  await prisma.eventStep.createMany({
    data: [
      { eventId: event1.id, stepOrder: 1, content: 'Project setup and module architecture' },
      { eventId: event1.id, stepOrder: 2, content: 'Authentication with JWT and guards' },
      { eventId: event1.id, stepOrder: 3, content: 'Prisma schema design and relations' },
      { eventId: event2.id, stepOrder: 1, content: 'Problem interview design' },
      { eventId: event2.id, stepOrder: 2, content: 'MVP planning and feature prioritization' },
      { eventId: event3.id, stepOrder: 1, content: 'Typography and spacing systems' },
      { eventId: event3.id, stepOrder: 2, content: 'Building reusable UI components' },
      { eventId: event4.id, stepOrder: 1, content: 'Audience targeting and positioning' },
      { eventId: event4.id, stepOrder: 2, content: 'Budget-friendly campaign setup' },
    ],
  });

  await prisma.eventImage.createMany({
    data: [
      { eventId: event1.id, url: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759', isFeatured: true },
      { eventId: event1.id, url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', isFeatured: false },
      { eventId: event2.id, url: 'https://images.unsplash.com/photo-1552664730-d307ca884978', isFeatured: true },
      { eventId: event3.id, url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', isFeatured: true },
      { eventId: event4.id, url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', isFeatured: true },
    ],
  });

  await prisma.eventAmenity.createMany({
    data: [
      { eventId: event1.id, amenityId: amenityByName['Free WiFi'].id },
      { eventId: event1.id, amenityId: amenityByName['Certificate'].id },
      { eventId: event1.id, amenityId: amenityByName['Recording Access'].id },
      { eventId: event2.id, amenityId: amenityByName['Parking'].id },
      { eventId: event2.id, amenityId: amenityByName['Lunch Included'].id },
      { eventId: event3.id, amenityId: amenityByName['Certificate'].id },
      { eventId: event3.id, amenityId: amenityByName['Recording Access'].id },
      { eventId: event4.id, amenityId: amenityByName['Free WiFi'].id },
    ],
  });

  await prisma.like.createMany({
    data: [
      { userId: user1.id, eventId: event1.id },
      { userId: user1.id, eventId: event2.id },
      { userId: admin.id, eventId: event1.id },
      { userId: owner2.id, eventId: event3.id },
    ],
  });

  await prisma.bookmark.createMany({
    data: [
      { userId: user1.id, eventId: event3.id },
      { userId: admin.id, eventId: event2.id },
      { userId: owner1.id, eventId: event4.id },
    ],
  });

  await prisma.comment.createMany({
    data: [
      { userId: user1.id, eventId: event1.id, content: 'Great structure and practical examples.' },
      { userId: admin.id, eventId: event2.id, content: 'Solid workshop for first-time founders.' },
      { userId: owner2.id, eventId: event3.id, content: 'Excellent pacing and design depth.' },
      { userId: owner1.id, eventId: event4.id, content: 'Helpful campaign ideas for small teams.' },
    ],
  });

  await prisma.rating.createMany({
    data: [
      { userId: user1.id, eventId: event1.id, rating: 5 },
      { userId: admin.id, eventId: event1.id, rating: 4 },
      { userId: user1.id, eventId: event2.id, rating: 4 },
      { userId: admin.id, eventId: event2.id, rating: 5 },
      { userId: owner2.id, eventId: event3.id, rating: 5 },
      { userId: owner1.id, eventId: event4.id, rating: 4 },
    ],
  });

  await prisma.event.update({
    where: { id: event1.id },
    data: { avgRating: 4.5, totalRatings: 2 },
  });
  await prisma.event.update({
    where: { id: event2.id },
    data: { avgRating: 4.5, totalRatings: 2 },
  });
  await prisma.event.update({
    where: { id: event3.id },
    data: { avgRating: 5.0, totalRatings: 1 },
  });
  await prisma.event.update({
    where: { id: event4.id },
    data: { avgRating: 4.0, totalRatings: 1 },
  });

  console.log('Seed completed with full mock API data.');
  console.log('Login password for all users: Pass@1234');
  console.log('Users: admin@vanta.dev, shambel@vanta.dev, abel@vanta.dev, hanna@vanta.dev');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
