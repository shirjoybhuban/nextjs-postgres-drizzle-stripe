import useSWR from "swr"
import { axiosFetcher } from "../axios"
import { Constants } from "@/const/constant"

export function useBlogList(
  pageIndex: number,
  pageSize: number,
  searchParam: string,
  selectedStatus: string
) {
  const { data, error, isLoading, mutate } = useSWR(
    `${Constants.Api.blog.list}/?search=${searchParam}&status=${selectedStatus}&page=${pageIndex + 1}&limit=${pageSize}`,
    axiosFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  return {
    blogs: data,
    isLoading,
    isError: error,
    mutate: mutate,
  }
}
