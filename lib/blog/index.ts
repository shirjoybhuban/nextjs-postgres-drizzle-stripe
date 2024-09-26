import useSWR from 'swr'
import { axiosFetcher } from '../axios';
import { Constants } from '@/const/constant';

export function useBlogList (pageIndex:number,pageSize:number) {
    const { data, error, isLoading, mutate } = useSWR(`${Constants.Api.blog.list}/?page=${pageIndex+1}&limit=${pageSize}`, axiosFetcher)
   
    return {
      blogs: data,
      isLoading,
      isError: error,
      mutate: mutate
    }
  }

  // export interface BlogListHook {
  //   blogs: any;
  //   isLoading: boolean;
  //   isError: any;
  // }