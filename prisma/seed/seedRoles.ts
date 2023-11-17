import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRoles() {
  console.log(`Start seeding roles...`);

  const roles = [
    { name: RoleName.Admin },
    { name: RoleName.Moderator },
    { name: RoleName.Participant },
    { name: RoleName.Crowd },
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name },
    });

    if (!existingRole) {
      const roleRecord = await prisma.role.create({
        data: role,
      });
      console.log(`Created role with id: ${roleRecord.id}`);
    } else {
      console.log(`Role ${role.name} already exists`);
    }
  }

  console.log(`Role seeding finished.`);
}

export default seedRoles;
