import { ColumnDef } from "@tanstack/react-table"

export type Blog = {
  id: string
  title: string
  slug: string
  image: string
  status: string
}

export const blogColumns: ColumnDef<Blog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return "sss"
    },
  },
]
