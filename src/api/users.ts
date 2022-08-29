import requestUser from 'axios';
import {
  UserInfo,
  PaginateQueryParams
} from './types';

export const getUser = function() {
  return requestUser.get<UserInfo>('/user');
}
export const getUserEvents = function(type: string, options: PaginateQueryParams = {}) {
  return requestUser.get<{events: number[];hasMore: boolean}>('/user/events', { ...options, type });
}

