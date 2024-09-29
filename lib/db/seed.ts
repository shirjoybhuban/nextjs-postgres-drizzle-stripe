import {
  blogData,
  permissionData,
  roleData,
  rolePermissionData,
  teamMemberData,
} from "@/const/seedData"
import { hashPassword } from "@/lib/auth/session"
import { sql } from "drizzle-orm"
import { stripe } from "../payments/stripe"
import { db } from "./drizzle"
import {
  blogs,
  permissions,
  rolePermissions,
  roles,
  teamMembers,
  teams,
  users,
} from "./schema"

async function createStripeProducts() {
  console.log("Creating Stripe products and prices...")

  const baseProduct = await stripe.products.create({
    name: "Base",
    description: "Base subscription plan",
  })

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: "usd",
    recurring: {
      interval: "month",
      trial_period_days: 7,
    },
  })

  const plusProduct = await stripe.products.create({
    name: "Plus",
    description: "Plus subscription plan",
  })

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: "usd",
    recurring: {
      interval: "month",
      trial_period_days: 7,
    },
  })

  console.log("Stripe products and prices created successfully.")
}

async function seed() {
  await db.execute(sql`TRUNCATE TABLE team_members RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE teams RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE blogs RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE roles RESTART IDENTITY CASCADE`)
  await db.execute(sql`TRUNCATE TABLE permissions RESTART IDENTITY CASCADE`)
  await db.execute(
    sql`TRUNCATE TABLE role_permissions RESTART IDENTITY CASCADE`
  )
  console.log("Truncate all tables.")

  await db.insert(roles).values(roleData)
  await db.insert(permissions).values(permissionData)
  await db.insert(rolePermissions).values(rolePermissionData)
  console.log("Added roles, permissions and their relations")

  const password = "admin123"
  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values([
      {
        email: "owner@test.com",
        passwordHash: passwordHash,
        role: "owner",
        roleId: 1,
      },
      {
        email: "author@test.com",
        passwordHash: passwordHash,
        role: "author",
        roleId: 2,
      },
      {
        email: "member@test.com",
        passwordHash: passwordHash,
        role: "member",
        roleId: 3,
      },
    ])
    .returning()
  console.log("Added 3 users with different role.")
  const [team] = await db
    .insert(teams)
    .values({
      name: "Test Team",
    })
    .returning()
  console.log("Added team.")
  await db.insert(teamMembers).values(teamMemberData)
  console.log("Added team member.")
  await db.insert(blogs).values(blogData)
  console.log("Added 4 blogs.")
  //await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error)
    process.exit(1)
  })
  .finally(() => {
    console.log("Seed process finished. Exiting...")
    process.exit(0)
  })
