import { IObject } from '@/utils/commonInterface'
// export * from './basic'
// export * from './order'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
    baseURL?: string;
    url: string;
    data?: IObject;
    params?: IObject;
    method?: Method;
    headers?: IObject;
    timeout?: number;
    responseType?: ResponseType;
}

export interface AxiosResponse {
    data: IObject;
    headers: IObject;
    request?: IObject;
    status: number;
    statusText: string;
    config: AxiosRequest;
}

export interface CustomResponse {
    readonly status: boolean;
    readonly message: string;
    data: IObject;
    origin?: any;
}
