export interface statusResponse {
    total: number;
    title: string;
    list: string[];
}
export interface AcRequest {
    departId: number;
    querName: string;
}
export interface SingleRequest {
    data: string[];
    flag: boolean;
}
export interface UserBaseInfo {
    id: number;
    username: string;
    email: string;
    avatar: string;
  }

export interface UserInfo extends UserBaseInfo {
    likes_count: number;
    goings_count: number;
    past_count: number;
}
export interface PaginateQueryParams {
    offset?: number;
    limit?: number;
}