
import * as apis from '../api/users';
import {
  UserInfo,
  PaginateQueryParams,
  EventInfo,
  UserState
} from './types';
import { UserEventType } from 'framework';
import { ActionTree, MutationTree, Module } from 'vuex';

const state: UserState = {
  userInfo: null,
  userEvents: [],
  hasMore: true
};

const mutations: MutationTree<UserState> = {
  updateUserInfo(state,userInfo: UserInfo): void {
    state.userInfo = userInfo;
  },
  initUserEvents(state,data: {events: EventInfo[];has_more: boolean}): void {
    state.userEvents = data.events;
    state.hasMore = data.has_more;
  },
  clearUserEvents(state): void{
    state.userEvents = [];
    state.hasMore = true;
  },
  updateUserEvents(state,data: {events: EventInfo[];has_more: boolean}): void {
    state.userEvents.push(...data.events);
    state.hasMore = data.has_more;
  }
};

const actions: ActionTree<UserState> = {
  async getUser({commit}): Promise<void> {
    const userInfo = await apis.getUser();
    commit('updateUserInfo', userInfo);
  },
  async getUserEvents({commit},{type,options}: {type: UserEventType;options?: PaginateQueryParams}): Promise<void> {
    const data = await apis.getUserEvents(type, options);
    commit('initUserEvents', data);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
} as Module<UserState>;