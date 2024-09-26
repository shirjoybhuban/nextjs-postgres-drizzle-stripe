'use client';

import BlogTable from '@/components/blog/BlogTable';
import { useBlogList } from '@/lib/blog';
import { blogColumns } from '@/lib/blog/colums';
import { useState } from 'react';


export default function BlogPostPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const { blogs, isLoading, isError, mutate } = useBlogList(pageIndex,pageSize);

  if(isLoading){
    return (  
      <section className="flex-1 p-4 lg:p-8">
        <p>Loading</p>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Blog Post
      </h1>
      <BlogTable columns={blogColumns} data={blogs?.data} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} setPageSize={setPageSize}/>
    </section>
  );
}
