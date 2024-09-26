'use client';

import BlogTable from '@/components/blog/BlogTable';
import { getBlogs } from '@/lib/db/queries';

export default function BlogPostPage() {
  // const blogs = await getBlogs();
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Blog Post
      </h1>
      <BlogTable/>
    </section>
  );
}
