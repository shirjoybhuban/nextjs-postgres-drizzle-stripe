import useSWR from 'swr'
import { axiosFetcher } from '../axios';
import { Constants } from '@/const/constant';

export function useBlogList () {
    const { data, error, isLoading } = useSWR(Constants.Api.blog.list, axiosFetcher)
   
    return {
      blogs: data,
      isLoading,
      isError: error
    }
  }