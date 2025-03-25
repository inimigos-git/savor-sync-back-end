import {
  PrismaClient,
  PriceRange,
  Status,
  Role,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type RestaurantHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

async function createUsers() {
  const users = [];
  const userRoles = [UserRole.customer, UserRole.admin, UserRole.restaurant];

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.users.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password_hash: await bcrypt.hash('password123', 10),
        phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: userRoles[Math.floor(Math.random() * userRoles.length)],
      },
    });
    users.push(user);
  }
  return users;
}

async function createRestaurants() {
  const defaultHours: RestaurantHours = {
    monday: '9:00-22:00',
    tuesday: '9:00-22:00',
    wednesday: '9:00-22:00',
    thursday: '9:00-22:00',
    friday: '9:00-23:00',
    saturday: '10:00-23:00',
    sunday: '10:00-21:00',
  };

  const cuisineTypes = [
    'Italian',
    'Chinese',
    'Mexican',
    'Indian',
    'Japanese',
  ] as const;
  const restaurants = [];

  for (let i = 1; i <= 10; i++) {
    const restaurant = await prisma.restaurants.create({
      data: {
        name: `Restaurant ${i}`,
        description: `Description for Restaurant ${i}`,
        address: `${i} Main St, City, Country`,
        latitude: Number((Math.random() * 180 - 90).toFixed(6)),
        longitude: Number((Math.random() * 360 - 180).toFixed(6)),
        cuisine_type:
          cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)],
        price_range: Object.values(PriceRange)[
          Math.floor(Math.random() * 4)
        ] as PriceRange,
        opening_hours: defaultHours,
      },
    });
    restaurants.push(restaurant);
  }
  return restaurants;
}

async function createTables(restaurants: any[]) {
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.tables.create({
      data: {
        capacity: Math.floor(Math.random() * 6) + 2,
        table_number: `T${i}`,
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
      },
    });
    tables.push(table);
  }
  return tables;
}

async function createReservations(
  users: any[],
  restaurants: any[],
  tables: any[],
) {
  const statuses = [Status.pending, Status.confirmed, Status.cancelled];

  for (let i = 1; i <= 10; i++) {
    await prisma.reservations.create({
      data: {
        usersId: users[Math.floor(Math.random() * users.length)].id,
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        tablesId: tables[Math.floor(Math.random() * tables.length)].id,
        reservation_date: new Date(
          Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        reservation_time: new Date(
          Date.now() + Math.random() * 24 * 60 * 60 * 1000,
        ),
        party_size: Math.floor(Math.random() * 6) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      },
    });
  }
}

async function createReviews(users: any[], restaurants: any[]) {
  for (let i = 1; i <= 10; i++) {
    await prisma.reviews.create({
      data: {
        usersId: users[Math.floor(Math.random() * users.length)].id,
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: `This is review ${i}. The food was great!`,
      },
    });
  }
}

async function createRestaurantAdmins(users: any[], restaurants: any[]) {
  const roles = [Role.owner, Role.manager];

  for (let i = 1; i <= 10; i++) {
    await prisma.restaurantAdmins.create({
      data: {
        usersId: users[Math.floor(Math.random() * users.length)].id,
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        role: roles[Math.floor(Math.random() * roles.length)],
      },
    });
  }
}

async function createMenuItems(restaurants: any[]) {
  const categories = [
    'Appetizer',
    'Main Course',
    'Dessert',
    'Beverage',
  ] as const;

  for (let i = 1; i <= 10; i++) {
    await prisma.menuItems.create({
      data: {
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        name: `Dish ${i}`,
        description: `Description for Dish ${i}`,
        price: Math.floor(Math.random() * 3000 + 500) / 100,
        category: categories[Math.floor(Math.random() * categories.length)],
      },
    });
  }
}

async function createRestaurantPhotos(restaurants: any[]) {
  for (let i = 1; i <= 10; i++) {
    await prisma.restaurantPhotos.create({
      data: {
        restaurantsId:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        photo_url: `https://example.com/restaurant-photo-${i}.jpg`,
        is_primary: i === 1,
      },
    });
  }
}

async function main() {
  try {
    console.log('Starting seeding...');

    const users = await createUsers();
    console.log('Created users');

    const restaurants = await createRestaurants();
    console.log('Created restaurants');

    const tables = await createTables(restaurants);
    console.log('Created tables');

    await createReservations(users, restaurants, tables);
    console.log('Created reservations');

    await createReviews(users, restaurants);
    console.log('Created reviews');

    await createRestaurantAdmins(users, restaurants);
    console.log('Created restaurant admins');

    await createMenuItems(restaurants);
    console.log('Created menu items');

    await createRestaurantPhotos(restaurants);
    console.log('Created restaurant photos');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
