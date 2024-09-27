'use client';

import BlogTable from '@/components/blog/BlogTable';
import TableFilterDropdown from '@/components/table/TableFilterDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hook/useDebounce';
import { useBlogList } from '@/lib/blog';
import { Blog } from '@/lib/blog/colums';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, Pencil, Plus, Search, Trash2 } from 'lucide-react';
//import { blogColumns } from '@/lib/blog/colums';
import { useState } from 'react';


export default function BlogPostPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const [searchParam, setSearchParam] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const debouncedSearchParam = useDebounce(searchParam, 1000);
  const { blogs, isLoading, isError, mutate } = useBlogList(pageIndex,pageSize,debouncedSearchParam,selectedStatus);

  const statusOptions = [
    { id: 1, value: "", label: "All" },
    { id: 2, value: "Published", label: "Publish" },
    { id: 3, value: "Inactive", label: "Inactive" },
  ];

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
          return <div className="flex gap-1"><Pencil className='cursor-pointer h-4 hover:text-orange-600'/><Copy className='cursor-pointer h-4 hover:text-orange-600'/><Trash2 className='cursor-pointer h-4 hover:text-orange-600'/></div>
        },
    },
]

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-1">
            Blog Post
          </h1>
          {blogs?.totalCount > 0 && <p className="text-xs lg:text-sm font-medium text-gray-900 mb-6">{blogs?.totalCount} entries found</p>}
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Create new entry
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="relative w-1/4 max-w-sm mb-5 bg-white">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
        </div>
        <TableFilterDropdown filterOptions={statusOptions} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      </div>
      <BlogTable columns={blogColumns} data={blogs?.data} isLoading={isLoading} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} setPageSize={setPageSize}/>
    </section>
  );
}
