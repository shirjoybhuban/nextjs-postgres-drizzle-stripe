'use client';

import BlogTable from '@/components/blog/BlogTable';
import { useDebounce } from '@/hook/useDebounce';
import { useBlogList } from '@/lib/blog';
import { Blog } from '@/lib/blog/colums';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, Pencil, Trash2 } from 'lucide-react';
//import { blogColumns } from '@/lib/blog/colums';
import { useState } from 'react';


export default function BlogPostPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const [searchParam, setSearchParam] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 1000);
  const { blogs, isLoading, isError, mutate } = useBlogList(pageIndex,pageSize,debouncedSearchParam);

  const blogColumns: ColumnDef<Blog>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "TITLE",
    },
    {
        accessorKey: "slug",
        header: "SLUG",
    },
    {
        accessorKey: "image",
        header: "FEATUREIMAGE",
        cell: ({ row }) => {
          return <img className="rounded-full h-7 w-7" src={row.getValue("image")} alt="blog_post" />
        },
    },
    {
        accessorKey: "status",
        header: "STATE",
        cell: ({ row }) => {
            return <div className="text-center text-xs font-semibold text-green-200 bg-slate-800 px-2 py-1 rounded">{row.getValue("status")}</div>
          },
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => {
          return <div className="flex gap-1"><Pencil className='cursor-pointer h-4 hover:text-green-500'/><Copy className='cursor-pointer h-4 hover:text-green-500'/><Trash2 className='cursor-pointer h-4 hover:text-green-500'/></div>
        },
    },
]

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Blog Post
      </h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
        className="border p-2 w-full"
      />
      {
        !isLoading ? <BlogTable columns={blogColumns} data={blogs?.data} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} setPageSize={setPageSize}/> : <h1>Loading</h1>
      }
    </section>
  );
}
