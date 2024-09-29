import { desc, and, eq, isNull, like, sql } from "drizzle-orm"
import { db } from "./drizzle"
import {
  activityLogs,
  blogs,
  permissions,
  rolePermissions,
  roles,
  teamMembers,
  teams,
  users,
} from "./schema"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth/session"

export async function getUser() {
  const sessionCookie = cookies().get("session")
  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  const sessionData = await verifyToken(sessionCookie.value)
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null
  }

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      roleId: roles.id,
      role: roles.name,
      permissions: sql`array_agg(permissions.permission_name)`.as(
        "permissions"
      ),
    })
    .from(users)
    .leftJoin(roles, eq(roles.id, users.roleId))
    .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .leftJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .groupBy(users.id, roles.id)

  if (user.length === 0) {
    return null
  }

  return user[0]
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1)

  return result.length > 0 ? result[0] : null
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null
    stripeProductId: string | null
    planName: string | null
    subscriptionStatus: string
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId))
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1)

  return result[0]
}

export async function getActivityLogs() {
  const user = await getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10)
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return result?.teamMembers[0]?.team || null
}

//Get blogs

export async function getBlogs(
  limit: number = 10,
  offset: number = 10,
  search: string = "",
  status: string = ""
) {
  const user = await getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const data = db
    .select()
    .from(blogs)
    .orderBy(desc(blogs.createdAt))
    .limit(limit)
    .offset(offset)

  if (search && search != "") {
    data.where(like(blogs.title, `%${search}%`))
  } else if (status && status != "") {
    data.where(eq(blogs.status, status))
  }

  return await data
}

//Get all blogs count
export async function getTotalBlogs() {
  const user = await getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }
  const data = db
    .select({
      totalRows: sql<number>`COUNT(*)`,
    })
    .from(blogs)
  return data
}

export async function isAuthenticate() {
  const sessionCookie = cookies().get("session")
  if (!sessionCookie || !sessionCookie.value) {
    return { checked: false, useId: null }
  }

  const sessionData = await verifyToken(sessionCookie.value)
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return { checked: false, useId: null }
  }

  if (new Date(sessionData.expires) < new Date()) {
    return { checked: false, useId: null }
  }

  return { checked: true, userId: sessionData.user.id }
}

export async function isAuthorized(
  userId: number,
  module: string,
  action: string
) {
  const permission = module + "_" + action

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      roleId: roles.id,
      role: roles.name,
    })
    .from(users)
    .leftJoin(roles, eq(roles.id, users.roleId))
    .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .leftJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(
      and(eq(users.id, userId), eq(permissions.permissionName, permission))
    )
    .groupBy(users.id, roles.id)

  return user?.length > 0 ? true : false
}
