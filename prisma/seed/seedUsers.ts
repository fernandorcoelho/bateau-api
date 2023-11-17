import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log(`Start seeding users...`);

  const roles = Object.values(RoleName); // ['Admin', 'Moderator', 'Participant', 'Crowd']
  const passwordHash = await bcrypt.hash('bateau123!', 10);

  for (const role of roles) {
    // Criar um perfil para o usuário (opcional, dependendo do seu esquema)
    const profile = await prisma.profile.create({
      data: {
        cpf: Math.random().toPrecision(11).replace('0.', ''),
        name: `Profile for ${role}`,
        nickname: `Nickname for ${role}`,
        age: 30, // Exemplo, você pode mudar isso
      },
    });

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}@example.com`,
        password: passwordHash,
        profileId: profile.id,
      },
    });

    console.log(`Created user with id: ${user.id}`);

    // Buscar role pelo nome
    const roleRecord = await prisma.role.findUnique({
      where: { name: role },
    });

    if (roleRecord) {
      // Associar usuário ao role
      await prisma.usersRoles.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id,
        },
      });

      console.log(`Assigned role ${role} to user ${user.id}`);
    }
  }

  console.log(`User seeding finished.`);
}

export default seedUsers;
