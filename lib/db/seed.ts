import { sql } from 'drizzle-orm';
import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers, blogs, roles, permissions } from './schema';
import { hashPassword } from '@/lib/auth/session';

const blogData = [
  {
    title: "5 Best Website Builders For Novices: Latest Guide",
    slug: "best-website-builders-for-novices",
    image: "https://content.prolificcloud.com/6ww1y6ej/image/best-website-builder-for-novices.webp",
  },
  {
    title: "Best Wedding Website Builder in 2024 for Your Big Day!",
    slug: "best-wedding-website-builder",
    image: "https://content.prolificcloud.com/6ww1y6ej/image/7-best-wedding-website-builders-1.webp",
  },
  {
    title: "6 Webflow Alternatives You Can Look Upto in 202",
    slug: "6 Webflow Alternatives You Can Look Upto in 202",
    image: "https://content.prolificcloud.com/6ww1y6ej/image/7-best-wedding-website-builders-1.webp",
  },
  {
    title: "9 B2B Website Design Best Practices with Case Studies",
    slug: "9 B2B Website Design Best Practices with Case Studies",
    image: "https://content.prolificcloud.com/6ww1y6ej/image/7-best-wedding-website-builders-1.webp",
  },
]
const roleData = [
  {
    name: "owner",
    slug: "owner",
    description: "this is Superadmin and has all access.",
  },
  {
    name: "author",
    slug: "author",
    description: "this is author and has partial access.",
  },
  {
    name: "member",
    slug: "member",
    description: "this is member and has limited access.",
  },
]
const permissionData = [
  {
    permissionName: "blog_read",
  },
  {
    permissionName: "blog_create",
  },
  {
    permissionName: "blog_edit",
  },
  {
    permissionName: "blog_delete",
  },
]

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  
  await db.execute(sql`TRUNCATE TABLE team_members RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE teams RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE roles RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE permissions RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE role_permissions RESTART IDENTITY CASCADE`);

  await db.insert(roles).values(roleData);
  await db.insert(permissions).values(permissionData);

  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
        roleId: 1,
      },
    ])
    .returning();

  console.log('Initial user created.');

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  await db.insert(blogs).values(blogData);
  //await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
