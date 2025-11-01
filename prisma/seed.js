const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample users
  await prisma.user.createMany({
    data: [
      {
        name: 'Alice Johnson',
      },
      {
        name: 'Bob Smith',
      },
      {
        name: 'Charlie Brown',
      },
      {
        name: 'Diana Prince',
      },
      {
        name: 'Eve Adams',
      },
      {
        name: 'Frank Miller',
      },
      {
        name: 'Grace Hopper',
      },
      {
        name: 'Hank Pym',
      },
      {
        name: 'Ivy League',
      },
      {
        name: 'Jack Black', 
      }, 
      {
        name: 'Kathy Sierra',
      },
      {
        name: 'Liam Neeson',
      }
      
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });