import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from 'next-runtime-env'
import getPDSClient from "@/lib/pdsClient";

const isServer = typeof window === "undefined";

export const SERVER = env("NEXT_PUBLIC_API_ADDRESS");


export type RequestConfig = AxiosRequestConfig & {
  // 获取完整的axios响应，否则只返回data
  getWholeResponse?: boolean
  // 获取完成的业务数据，否则只返回业务数据的data
  getWholeBizData?: boolean
}

type ConfigWithWholeResponse = AxiosRequestConfig & {
  getWholeResponse: true
}

type ConfigWithWholeBizData = AxiosRequestConfig & {
  getWholeBizData: true
}

type ConfigWithOriginData = AxiosRequestConfig & {
  getWholeResponse: true
  getWholeBizData: true
}

export declare namespace API {
  interface Response<T = any> {
    code: number;
    message: string;
    data: T | null;
    success?: boolean;
    errorData?: Array<{
      errorCode: string
      errorMessage: string
      propertyName: string
    }>
  }
}

export async function requestAPI<T = unknown, O = ConfigWithOriginData>(url: string, config: O): Promise<AxiosResponse<API.Response<T>>>
export async function requestAPI<T = unknown, O = ConfigWithWholeResponse>(url: string, config: O): Promise<AxiosResponse<T>>
export async function requestAPI<T = unknown, O = ConfigWithWholeBizData>(url: string, config: O): Promise<API.Response<T>>
export async function requestAPI<T = unknown, O = RequestConfig>(url: string, config: O): Promise<T>
export async function requestAPI(url: string, config: RequestConfig) {
  // let response = null
  // try {
  //   const token = getPDSClient().session?.accessJwt
  //   response = await axios(`${ SERVER }${ url }`, {
  //     ...config,
  //     headers: {
  //       Authorization: token ? `Bearer ${token}` : token,
  //     },
  //   });
  // } catch (e: any) {
  //   response = {
  //     data: {
  //       code: e.status,
  //       message: e.message,
  //       data: null,
  //     }
  //   }
  // }
  const token = getPDSClient().session?.accessJwt
  const response = await axios(`${ SERVER }${ url }`, {
    ...config,
    headers: {
      Authorization: token ? `Bearer ${token}` : token,
    },
  });

  if (response?.data?.code === 401) {
    // throttleLogout();
  }

  const bizDataOnly = config.getWholeBizData !== true
  if (bizDataOnly)
    response.data = response.data.data
  const getResponse = config.getWholeResponse === true
  return getResponse ? response : response.data
}

export type FetchAPIReturnType<OPTIONS extends AxiosRequestConfig, ReturnDataType> =
  OPTIONS extends ConfigWithOriginData ? Promise<AxiosResponse<API.Response<ReturnDataType | null>>>
    : OPTIONS extends ConfigWithWholeResponse ? Promise<AxiosResponse<ReturnDataType | null>>
      : OPTIONS extends ConfigWithWholeBizData ? Promise<API.Response<ReturnDataType | null>>
        : Promise<ReturnDataType | null>;
