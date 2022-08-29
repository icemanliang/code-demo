/* eslint-disable @typescript-eslint/ban-types */
import { api, APIPromise } from 'framework';
import { statusResponse, AcRequest, SingleRequest } from './types';

export function getUserInfo(data: AcRequest): APIPromise<statusResponse> {
  return api.commonRequest.get('account/get_binding_requests/');
}

export function unbindInfo(data: SingleRequest): APIPromise<{}> {
  return api.commonRequest.get('account/unbind_account/');
}
