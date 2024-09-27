import { getBlogs } from '@/lib/db/queries';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams: any = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 1;   
    const offset = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    // Fetch paginated data from Drizzle
    const paginatedUsers = await getBlogs(limit, offset, search);
    const totalCount = 2;
    return Response.json({ data: paginatedUsers, totalCount })
  } catch (error) {
    console.error(error);
    return Response.json({ data: null })
  }
}