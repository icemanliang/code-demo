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
export interface EventInfo {
  id: number;
  name: string;
  begin_time: number;
  end_time: number;
  description: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  create_time: number;
  update_time: number;
  channel: {
    id: string;
    name: string;
  };
  images: string[];
  location: string;
  goings_count: number;
  likes_count: number;
  me_likes: boolean;
  me_going: boolean;
}

export interface UserState {
  userInfo: UserInfo | null;
  userEvents: EventInfo[];
  hasMore: boolean;
}
