import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('QwertY24$', 12);

  const admin = await prisma.adminUser.upsert({
    where: { username: 'Oleh' },
    update: {},
    create: {
      username: 'Oleh',
      passwordHash: passwordHash,
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Create sample members (optional)
  const sampleMembers = [
    {
      code: '2002',
      fullName: 'Veronika Sheludko',
      email: 'veronika@opslab.uk',
      position: 'CEO',
      experienceMonths: 60,
      employmentType: 'Full-time',
      isActive: true,
    },
    {
      code: '2003',
      fullName: 'John Smith',
      email: 'john@opslab.uk',
      position: 'CTO',
      experienceMonths: 48,
      employmentType: 'Full-time',
      isActive: true,
    },
  ];

  for (const memberData of sampleMembers) {
    const member = await prisma.member.upsert({
      where: { code: memberData.code },
      update: {},
      create: memberData,
    });
    console.log('✅ Sample member created:', member.fullName);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
