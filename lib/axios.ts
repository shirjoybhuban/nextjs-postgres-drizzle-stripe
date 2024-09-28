import { Constants } from "@/const/constant"
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: Constants.BASE_URL_API, // Example base URL
  timeout: 10000,
})

export const axiosFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data)
