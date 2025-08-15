import defineAPI from "@/server/defineAPI";
import { RequestConfig } from "@/lib/request";

export default function server<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  params: Record<string, any> = {},
  options?: RequestConfig,
): Promise<T> {
  return defineAPI(url, method)(
    params,
    options,
  ) as Promise<T>;
}
