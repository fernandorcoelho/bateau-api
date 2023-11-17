import seedRoles from './seedRoles';
import seedUsers from './seedUsers';

async function main() {
  console.log('Start seeding...');

  await seedRoles();
  await seedUsers();

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Aqui, você pode desconectar o Prisma Client, se necessário
  });
