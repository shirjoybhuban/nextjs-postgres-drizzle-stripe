import {
  getBlogs,
  getTotalBlogs,
  isAuthenticate,
  isAuthorized,
} from "@/lib/db/queries"
import { type NextRequest } from "next/server"

const HEADER = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
export async function GET(request: NextRequest) {
  try {
    const isLogin: any = await isAuthenticate()
    if (!isLogin.checked) {
      return Response.json(
        { data: null, message: "Please, Login First!" },
        {
          status: 401,
          headers: HEADER,
        }
      )
    }
    const hasAuthorization: any = await isAuthorized(
      isLogin.userId,
      "blog",
      "read"
    )
    if (!hasAuthorization) {
      return Response.json(
        { data: null, message: "Permission denied!" },
        {
          status: 403,
          headers: HEADER,
        }
      )
    }
    const searchParams: any = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page")) || 1
    const limit = parseInt(searchParams.get("limit")) || 1
    const offset = (page - 1) * limit
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    // Fetch paginated data from Drizzle
    const paginatedUsers = await getBlogs(limit, offset, search, status)
    const result: any = await getTotalBlogs()
    const totalCount = parseInt(result[0]?.totalRows || 0)

    return Response.json(
      { data: paginatedUsers, totalCount, message: "Success" },
      {
        status: 200,
        headers: HEADER,
      }
    )
  } catch (error) {
    console.error(error)
    return Response.json({ data: null })
  }
}
