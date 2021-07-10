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

import { BaseData } from '@shared/models/base-data';
import { TenantId } from '@shared/models/id/tenant-id';
import { CustomerId } from '@shared/models/id/customer-id';
import { TestCredentialsId } from '@shared/models/id/test-credentials-id';
import { EntitySearchQuery } from '@shared/models/relation.models';
import { RuleChainId } from '@shared/models/id/rule-chain-id';
import { EntityInfoData } from '@shared/models/entity.models';
import { KeyFilter } from '@shared/models/query/query.models';
import { TimeUnit } from '@shared/models/time/time.models';
import * as _moment from 'moment';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { OtaPackageId } from '@shared/models/id/ota-package-id';
import { DashboardId } from '@shared/models/id/dashboard-id';
import { DataType } from '@shared/models/constants';
import {TestProfileId} from "@shared/models/id/test-profile-id";
import {TestId} from "@shared/models/id/test-id";

export enum TestProfileType {
  DEFAULT = 'DEFAULT',
  SNMP = 'SNMP'
}

export enum TestTransportType {
  DEFAULT = 'DEFAULT',
  MQTT = 'MQTT',
  COAP = 'COAP',
  LWM2M = 'LWM2M',
  SNMP = 'SNMP'
}

export enum TransportPayloadType {
  JSON = 'JSON',
  PROTOBUF = 'PROTOBUF'
}

export enum CoapTransportTestType {
  DEFAULT = 'DEFAULT',
  EFENTO = 'EFENTO'
}

export enum TestProvisionType {
  DISABLED = 'DISABLED',
  ALLOW_CREATE_NEW_TESTS = 'ALLOW_CREATE_NEW_TESTS',
  CHECK_PRE_PROVISIONED_TESTS = 'CHECK_PRE_PROVISIONED_TESTS'
}

export interface TestConfigurationFormInfo {
  hasProfileConfiguration: boolean;
  hasTestConfiguration: boolean;
}

export const testProfileTypeTranslationMap = new Map<TestProfileType, string>(
  [
    [TestProfileType.DEFAULT, 'test-profile.type-default']
  ]
);

export const testProfileTypeConfigurationInfoMap = new Map<TestProfileType, TestConfigurationFormInfo>(
  [
    [
      TestProfileType.DEFAULT,
      {
        hasProfileConfiguration: false,
        hasTestConfiguration: false,
      }
    ],
    [
      TestProfileType.SNMP,
      {
        hasProfileConfiguration: true,
        hasTestConfiguration: true,
      }
    ]
  ]
);

export const testTransportTypeTranslationMap = new Map<TestTransportType, string>(
  [
    [TestTransportType.DEFAULT, 'test-profile.transport-type-default'],
    [TestTransportType.MQTT, 'test-profile.transport-type-mqtt'],
    [TestTransportType.COAP, 'test-profile.transport-type-coap'],
    [TestTransportType.LWM2M, 'test-profile.transport-type-lwm2m'],
    [TestTransportType.SNMP, 'test-profile.transport-type-snmp']
  ]
);






export const transportPayloadTypeTranslationMap = new Map<TransportPayloadType, string>(
  [
    [TransportPayloadType.JSON, 'test-profile.transport-test-payload-type-json'],
    [TransportPayloadType.PROTOBUF, 'test-profile.transport-test-payload-type-proto']
  ]
);






export interface DefaultTestProfileConfiguration {
  [key: string]: any;
}

export type TestProfileConfigurations = DefaultTestProfileConfiguration;

export interface TestProfileConfiguration extends TestProfileConfigurations {
  type: TestProfileType;
}

export interface DefaultTestProfileTransportConfiguration {
  [key: string]: any;
}



export interface CoapTestProfileTransportConfiguration {
  coapTestTypeConfiguration?: {
    coapTestType?: CoapTransportTestType;
    transportPayloadTypeConfiguration?: {
      transportPayloadType?: TransportPayloadType;
      [key: string]: any;
    };
  };
}





export interface SnmpMapping {
  oid: string;
  key: string;
  dataType: DataType;
}



export interface TestProvisionConfiguration {
  type: TestProvisionType;
  provisionTestSecret?: string;
  provisionTestKey?: string;
}

export function createTestProfileConfiguration(type: TestProfileType): TestProfileConfiguration {
  let configuration: TestProfileConfiguration = null;
  if (type) {
    switch (type) {
      case TestProfileType.DEFAULT:
        const defaultConfiguration: DefaultTestProfileConfiguration = {};
        configuration = {...defaultConfiguration, type: TestProfileType.DEFAULT};
        break;
    }
  }
  return configuration;
}

export function createTestConfiguration(type: TestProfileType): TestConfiguration {
  let configuration: TestConfiguration = null;
  if (type) {
    switch (type) {
      case TestProfileType.DEFAULT:
        const defaultConfiguration: DefaultTestConfiguration = {};
        configuration = {...defaultConfiguration, type: TestProfileType.DEFAULT};
        break;
    }
  }
  return configuration;
}



export enum AlarmConditionType {
  SIMPLE = 'SIMPLE',
  DURATION = 'DURATION',
  REPEATING = 'REPEATING'
}

export const AlarmConditionTypeTranslationMap = new Map<AlarmConditionType, string>(
  [
    [AlarmConditionType.SIMPLE, 'test-profile.condition-type-simple'],
    [AlarmConditionType.DURATION, 'test-profile.condition-type-duration'],
    [AlarmConditionType.REPEATING, 'test-profile.condition-type-repeating']
  ]
);

export interface AlarmConditionSpec{
  type?: AlarmConditionType;
  unit?: TimeUnit;
  value?: number;
  count?: number;
}

export interface AlarmCondition {
  condition: Array<KeyFilter>;
  spec?: AlarmConditionSpec;
}

export enum AlarmScheduleType {
  ANY_TIME = 'ANY_TIME',
  SPECIFIC_TIME = 'SPECIFIC_TIME',
  CUSTOM = 'CUSTOM'
}

export const AlarmScheduleTypeTranslationMap = new Map<AlarmScheduleType, string>(
  [
    [AlarmScheduleType.ANY_TIME, 'test-profile.schedule-any-time'],
    [AlarmScheduleType.SPECIFIC_TIME, 'test-profile.schedule-specific-time'],
    [AlarmScheduleType.CUSTOM, 'test-profile.schedule-custom']
  ]
);

export interface AlarmSchedule{
  type: AlarmScheduleType;
  timezone?: string;
  daysOfWeek?: number[];
  startsOn?: number;
  endsOn?: number;
  items?: CustomTimeSchedulerItem[];
}

export interface CustomTimeSchedulerItem{
  enabled: boolean;
  dayOfWeek: number;
  startsOn: number;
  endsOn: number;
}

export interface AlarmRule {
  condition: AlarmCondition;
  alarmDetails?: string;
  dashboardId?: DashboardId;
  schedule?: AlarmSchedule;
}

export function alarmRuleValidator(control: AbstractControl): ValidationErrors | null {
  const alarmRule: AlarmRule = control.value;
  return alarmRuleValid(alarmRule) ? null : {alarmRule: true};
}

function alarmRuleValid(alarmRule: AlarmRule): boolean {
  if (!alarmRule || !alarmRule.condition || !alarmRule.condition.condition || !alarmRule.condition.condition.length) {
    return false;
  }
  return true;
}

export interface TestProfileAlarm {
  id: string;
  alarmType: string;
  createRules: {[severity: string]: AlarmRule};
  clearRule?: AlarmRule;
  propagate?: boolean;
  propagateRelationTypes?: Array<string>;
}

export function testProfileAlarmValidator(control: AbstractControl): ValidationErrors | null {
  const testProfileAlarm: TestProfileAlarm = control.value;
  if (testProfileAlarm && testProfileAlarm.id && testProfileAlarm.alarmType &&
    testProfileAlarm.createRules) {
    const severities = Object.keys(testProfileAlarm.createRules);
    if (severities.length) {
      let alarmRulesValid = true;
      for (const severity of severities) {
        const alarmRule = testProfileAlarm.createRules[severity];
        if (!alarmRuleValid(alarmRule)) {
          alarmRulesValid = false;
          break;
        }
      }
      if (alarmRulesValid) {
        if (testProfileAlarm.clearRule && !alarmRuleValid(testProfileAlarm.clearRule)) {
          alarmRulesValid = false;
        }
      }
      if (alarmRulesValid) {
        return null;
      }
    }
  }
  return {testProfileAlarm: true};
}


export interface TestProfileData {
  configuration: TestProfileConfiguration;
  alarms?: Array<TestProfileAlarm>;
  provisionConfiguration?: TestProvisionConfiguration;
}

export interface TestProfile extends BaseData<TestProfileId> {
  tenantId?: TenantId;
  name: string;

  image?: string;

  provisionType: TestProvisionType;
  provisionTestKey?: string;
  defaultRuleChainId?: RuleChainId;
  defaultDashboardId?: DashboardId;
  defaultQueueName?: string;
  firmwareId?: OtaPackageId;
  softwareId?: OtaPackageId;
  profileData: TestProfileData;
}

export interface TestProfileInfo extends EntityInfoData {
  type: TestProfileType;

  image?: string;
  defaultDashboardId?: DashboardId;
}

export interface DefaultTestConfiguration {
  [key: string]: any;
}

export type TestConfigurations = DefaultTestConfiguration;

export interface TestConfiguration extends TestConfigurations {
  type: TestProfileType;
}



export enum SnmpTestProtocolVersion {
  V1 = 'V1',
  V2C = 'V2C',
  V3 = 'V3'
}

export enum SnmpAuthenticationProtocol {
  SHA_1 = 'SHA_1',
  SHA_224 = 'SHA_224',
  SHA_256 = 'SHA_256',
  SHA_384 = 'SHA_384',
  SHA_512 = 'SHA_512',
  MD5 = 'MD%'
}

export const SnmpAuthenticationProtocolTranslationMap = new Map<SnmpAuthenticationProtocol, string>([
  [SnmpAuthenticationProtocol.SHA_1, 'SHA-1'],
  [SnmpAuthenticationProtocol.SHA_224, 'SHA-224'],
  [SnmpAuthenticationProtocol.SHA_256, 'SHA-256'],
  [SnmpAuthenticationProtocol.SHA_384, 'SHA-384'],
  [SnmpAuthenticationProtocol.SHA_512, 'SHA-512'],
  [SnmpAuthenticationProtocol.MD5, 'MD5']
]);

export enum SnmpPrivacyProtocol {
  DES = 'DES',
  AES_128 = 'AES_128',
  AES_192 = 'AES_192',
  AES_256 = 'AES_256'
}

export const SnmpPrivacyProtocolTranslationMap = new Map<SnmpPrivacyProtocol, string>([
  [SnmpPrivacyProtocol.DES, 'DES'],
  [SnmpPrivacyProtocol.AES_128, 'AES-128'],
  [SnmpPrivacyProtocol.AES_192, 'AES-192'],
  [SnmpPrivacyProtocol.AES_256, 'AES-256'],
]);

export interface SnmpTestTransportConfiguration {
  host?: string;
  port?: number;
  protocolVersion?: SnmpTestProtocolVersion;
  community?: string;
  username?: string;
  securityName?: string;
  contextName?: string;
  authenticationProtocol?: SnmpAuthenticationProtocol;
  authenticationPassphrase?: string;
  privacyProtocol?: SnmpPrivacyProtocol;
  privacyPassphrase?: string;
  engineId?: string;
}




export interface Test extends BaseData<TestId> {
  tenantId?: TenantId;
  name: string;
  road:string;
  accidentType:string
  nrOfVehicles:number
  description:string



}

export interface TestInfo extends Test {
  // tenantId?: TenantId;
  // name: string;
  // road:string;
  // accidentType:string
  // nrOfVehicles:number
  // description:string
}

export enum TestCredentialsType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  X509_CERTIFICATE = 'X509_CERTIFICATE',
  MQTT_BASIC = 'MQTT_BASIC',
  LWM2M_CREDENTIALS = 'LWM2M_CREDENTIALS'
}

export const credentialTypeNames = new Map<TestCredentialsType, string>(
  [
    [TestCredentialsType.ACCESS_TOKEN, 'Access token'],
    [TestCredentialsType.X509_CERTIFICATE, 'X.509'],
    [TestCredentialsType.MQTT_BASIC, 'MQTT Basic'],
    [TestCredentialsType.LWM2M_CREDENTIALS, 'LwM2M Credentials']
  ]
);

export interface TestCredentials extends BaseData<TestCredentialsId> {
  testId: TestId;
  credentialsType: TestCredentialsType;
  credentialsId: string;
  credentialsValue: string;
}



export interface TestSearchQuery extends EntitySearchQuery {
  testTypes: Array<string>;
}

export interface ClaimRequest {
  secretKey: string;
}

export enum ClaimResponse {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CLAIMED = 'CLAIMED'
}

export interface ClaimResult {
  test: Test;
  response: ClaimResponse;
}

export const dayOfWeekTranslations = new Array<string>(
  'test-profile.schedule-day.monday',
  'test-profile.schedule-day.tuesday',
  'test-profile.schedule-day.wednesday',
  'test-profile.schedule-day.thursday',
  'test-profile.schedule-day.friday',
  'test-profile.schedule-day.saturday',
  'test-profile.schedule-day.sunday'
);

export function getDayString(day: number): string {
  switch (day) {
    case 0:
      return 'test-profile.schedule-day.monday';
    case 1:
      return this.translate.instant('test-profile.schedule-day.tuesday');
    case 2:
      return this.translate.instant('test-profile.schedule-day.wednesday');
    case 3:
      return this.translate.instant('test-profile.schedule-day.thursday');
    case 4:
      return this.translate.instant('test-profile.schedule-day.friday');
    case 5:
      return this.translate.instant('test-profile.schedule-day.saturday');
    case 6:
      return this.translate.instant('test-profile.schedule-day.sunday');
  }
}

export function timeOfDayToUTCTimestamp(date: Date | number): number {
  if (typeof date === 'number' || date === null) {
    return 0;
  }
  return _moment.utc([1970, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds(), 0]).valueOf();
}

export function utcTimestampToTimeOfDay(time = 0): Date {
  return new Date(time + new Date(time).getTimezoneOffset() * 60 * 1000);
}

function timeOfDayToMoment(date: Date | number): _moment.Moment {
  if (typeof date === 'number' || date === null) {
    return _moment([1970, 0, 1, 0, 0, 0, 0]);
  }
  return _moment([1970, 0, 1, date.getHours(), date.getMinutes(), 0, 0]);
}

export function getAlarmScheduleRangeText(startsOn: Date | number, endsOn: Date | number): string {
  const start = timeOfDayToMoment(startsOn);
  const end = timeOfDayToMoment(endsOn);
  if (start < end) {
    return `<span><span class="nowrap">${start.format('hh:mm A')}</span> – <span class="nowrap">${end.format('hh:mm A')}</span></span>`;
  } else if (start.valueOf() === 0 && end.valueOf() === 0 || start.isSame(_moment([1970, 0])) && end.isSame(_moment([1970, 0]))) {
    return '<span><span class="nowrap">12:00 AM</span> – <span class="nowrap">12:00 PM</span></span>';
  }
  return `<span><span class="nowrap">12:00 AM</span> – <span class="nowrap">${end.format('hh:mm A')}</span>` +
    ` and <span class="nowrap">${start.format('hh:mm A')}</span> – <span class="nowrap">12:00 PM</span></span>`;
}
