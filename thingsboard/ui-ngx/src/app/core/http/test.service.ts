///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { Injectable } from '@angular/core';
import { defaultHttpOptionsFromConfig, RequestConfig } from './http-utils';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageLink } from '@shared/models/page/page-link';
import { PageData } from '@shared/models/page/page-data';
import {
  ClaimRequest,
  ClaimResult,
  Test,
  TestCredentials,
  TestInfo,
  TestSearchQuery
} from '@app/shared/models/test.models';
import { EntitySubtype } from '@app/shared/models/entity-type.models';
import { AuthService } from '@core/auth/auth.service';
import {DashboardInfo} from "@shared/models/dashboard.models";
import {Device, DeviceCredentials, DeviceInfo, DeviceSearchQuery} from "@shared/models/device.models";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private http: HttpClient
  ) { }

  public getTenantTests(pageLink: PageLink,
                              config?: RequestConfig): Observable<PageData<TestInfo>> {
    return this.http.get<PageData<TestInfo>>(`/api/tenant/tests${pageLink.toQuery()}`,
      defaultHttpOptionsFromConfig(config));
  }

  public getTenantTestByTenantId(tenantId: string, pageLink: PageLink,
                                       config?: RequestConfig): Observable<PageData<DashboardInfo>> {
    return this.http.get<PageData<DashboardInfo>>(`/api/tenant/${tenantId}/tests${pageLink.toQuery()}`,
      defaultHttpOptionsFromConfig(config));
  }

  public getCustomerTests(customerId: string, pageLink: PageLink, type: string = '',
                                config?: RequestConfig): Observable<PageData<TestInfo>> {
    return this.http.get<PageData<TestInfo>>(`/api/customer/${customerId}/testInfos${pageLink.toQuery()}&type=${type}`,
      defaultHttpOptionsFromConfig(config));
  }

  public getCustomerTestInfosByTestProfileId(customerId: string, pageLink: PageLink, testProfileId: string = '',
                                                 config?: RequestConfig): Observable<PageData<TestInfo>> {
    console.log("mos valle futem ketu")
    return this.http.get<PageData<TestInfo>>(`/api/customer/${customerId}/testInfos${pageLink.toQuery()}&testProfileId=${testProfileId}`,
      defaultHttpOptionsFromConfig(config));
  }

  public getTest(testId: string, config?: RequestConfig): Observable<Test> {
    return this.http.get<Test>(`/api/test/${testId}`, defaultHttpOptionsFromConfig(config));
  }

  public getTests(testIds: Array<string>, config?: RequestConfig): Observable<Array<Test>> {
    return this.http.get<Array<Test>>(`/api/tests?testIds=${testIds.join(',')}`, defaultHttpOptionsFromConfig(config));
  }

  public getTestInfo(testId: string, config?: RequestConfig): Observable<TestInfo> {
    console.log(testId)

    return this.http.get<TestInfo>(`/api/test/info/${testId}`, defaultHttpOptionsFromConfig(config));
  }

  public saveTest(test: Test,config?: RequestConfig): Observable<Test> {
    console.log("po ktu vi une?" +test)
    return this.http.post<Test>('/api/test', test,defaultHttpOptionsFromConfig(config));
  }

  public deleteTest(testId: string, config?: RequestConfig) {
    console.log("dhe ti me duhesh tani")
    return this.http.delete(`/api/test/${testId}`, defaultHttpOptionsFromConfig(config));
  }

  // public getTestTypes(config?: RequestConfig): Observable<Array<EntitySubtype>> {
  //   return this.http.get<Array<EntitySubtype>>('/api/test/types', defaultHttpOptionsFromConfig(config));
  // }





























}
