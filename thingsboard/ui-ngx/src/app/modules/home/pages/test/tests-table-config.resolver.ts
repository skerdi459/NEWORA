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

import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import {
  CellActionDescriptor,
  checkBoxCell,
  DateEntityTableColumn,
  EntityTableColumn,
  EntityTableConfig,
  GroupActionDescriptor,
  HeaderActionDescriptor
} from '@home/models/entity/entities-table-config.models';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { EntityType, entityTypeResources, entityTypeTranslations } from '@shared/models/entity-type.models';
import { AddEntityDialogData, EntityAction } from '@home/models/entity/entity-component.models';
import { Test, TestCredentials, TestInfo } from '@app/shared/models/test.models';
import { TestComponent } from '@modules/home/pages/test/test.component';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectAuthUser } from '@core/auth/auth.selectors';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { AppState } from '@core/core.state';
import { Authority } from '@app/shared/models/authority.enum';
import { CustomerService } from '@core/http/customer.service';
import { Customer } from '@app/shared/models/customer.model';
import { NULL_UUID } from '@shared/models/id/has-uuid';
import { BroadcastService } from '@core/services/broadcast.service';
import { TestTableHeaderComponent } from '@modules/home/pages/test/test-table-header.component';
import { MatDialog } from '@angular/material/dialog';
import {
  TestCredentialsDialogComponent,
  TestCredentialsDialogData
} from '@modules/home/pages/test/test-credentials-dialog.component';
import { DialogService } from '@core/services/dialog.service';
import {
  AssignToCustomerDialogComponent,
  AssignToCustomerDialogData
} from '@modules/home/dialogs/assign-to-customer-dialog.component';
import { TestId } from '@app/shared/models/id/test-id';
import {
  AddEntitiesToCustomerDialogComponent,
  AddEntitiesToCustomerDialogData
} from '../../dialogs/add-entities-to-customer-dialog.component';
import { TestTabsComponent } from '@home/pages/test/test-tabs.component';
import { HomeDialogsService } from '@home/dialogs/home-dialogs.service';
import { TestWizardDialogComponent } from '@home/components/wizard/test-wizard-dialog.component';
import { BaseData, HasId } from '@shared/models/base-data';
import { isDefinedAndNotNull } from '@core/utils';
import { EdgeService } from '@core/http/edge.service';
import {
  AddEntitiesToEdgeDialogComponent,
  AddEntitiesToEdgeDialogData
} from '@home/dialogs/add-entities-to-edge-dialog.component';
import {TestService} from "@core/http/test.service";
import {DeviceTableHeaderComponent} from "@home/pages/device/device-table-header.component";

@Injectable()
export class TestTableConfigResolver implements Resolve<EntityTableConfig<TestInfo | Test>> {

  private readonly config: EntityTableConfig<TestInfo> = new EntityTableConfig<TestInfo>();

  private customerId: string;

  constructor(private store: Store<AppState>,
              private broadcast: BroadcastService,
              private testService: TestService,
              private customerService: CustomerService,
              private dialogService: DialogService,
              private edgeService: EdgeService,
              private homeDialogs: HomeDialogsService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              private router: Router,
              private dialog: MatDialog) {

    this.config.entityType = EntityType.TEST;
    this.config.entityComponent = TestComponent;
    this.config.entityTabsComponent = TestTabsComponent;
    this.config.entityTranslations = entityTypeTranslations.get(EntityType.TEST);
    this.config.entityResources = entityTypeResources.get(EntityType.TEST);

    this.config.addDialogStyle = {width: '600px'};

    this.config.deleteEntityTitle = test => this.translate.instant('test.delete-test-title', {testName: test.name});
    this.config.deleteEntityContent = () => this.translate.instant('test.delete-test-text');
    this.config.deleteEntitiesTitle = count => this.translate.instant('test.delete-tests-title', {count});
    this.config.deleteEntitiesContent = () => this.translate.instant('test.delete-tests-text');


    this.config.loadEntity = id => this.testService.getTest(id.id);
    this.config.saveEntity = device => {
      console.log("de" + device.id)
      console.log(device)

      return this.testService.saveTest(device).pipe(
        tap(() => {
          console.log("sdsd")
          this.broadcast.broadcast('savedTest');
        }),
        mergeMap((savedTest) => this.testService.getTest(savedTest.id.id)
        ));
    };
    this.config.detailsReadonly = () => (this.config.componentsData.deviceScope === 'customer_user' || this.config.componentsData.deviceScope === 'edge_customer_user');

    this.config.headerComponent = TestTableHeaderComponent;
  }
  resolve(route: ActivatedRouteSnapshot): Observable<EntityTableConfig<TestInfo>> {
    const routeParams = route.params;
    this.config.componentsData = {
      testScope: route.data.testsType,
      customerId: routeParams.customerId,

      edgeId: routeParams.edgeId
    };
    this.customerId = routeParams.customerId;
    this.config.componentsData.edgeId = routeParams.edgeId;
    return this.store.pipe(select(selectAuthUser), take(1)).pipe(
      tap((authUser) => {
        if (authUser.authority === Authority.CUSTOMER_USER) {
          if (route.data.testsType === 'edge') {
            this.config.componentsData.testScope = 'edge_customer_user';
          } else {
            this.config.componentsData.testScope = 'customer_user';
          }
          this.customerId = authUser.customerId;
        }
      }),
      mergeMap(() =>
        this.config.componentsData.customerId ?
          this.customerService.getCustomer(this.config.componentsData.customerId) : of(null as Customer)
      ),
      map((parentCustomer) => {
        if (parentCustomer) {
          if (parentCustomer.additionalInfo && parentCustomer.additionalInfo.isPublic) {
            this.config.tableTitle = this.translate.instant('customer.public-test');
          } else {
            this.config.tableTitle = parentCustomer.title + ': ' + this.translate.instant('test.test');
          }
        } else if (this.config.componentsData.testScope === 'edge') {
          this.edgeService.getEdge(this.config.componentsData.edgeId).subscribe(
            edge => this.config.tableTitle = edge.name + ': ' + this.translate.instant('test.test')
          );
        } else {
          this.config.tableTitle = this.translate.instant('test.test' +
            '' +
            '');
        }
        this.config.columns = this.configureColumns(this.config.componentsData.testScope);
        this.configureEntityFunctions(this.config.componentsData.testScope);
        // this.config.cellActionDescriptors = this.configureCellActions(this.config.componentsData.testScope);
        this.config.groupActionDescriptors = this.configureGroupActions(this.config.componentsData.testScope);
        this.config.addActionDescriptors = this.configureAddActions(this.config.componentsData.testScope);
        this.config.addEnabled = !(this.config.componentsData.testScope === 'customer_user' || this.config.componentsData.testScope === 'edge_customer_user');
        this.config.entitiesDeleteEnabled = this.config.componentsData.testScope === 'tenant';
        this.config.deleteEnabled = () => this.config.componentsData.testScope === 'tenant';
        return this.config;
      })
    );
  }








  configureColumns(testScope: string): Array<EntityTableColumn<TestInfo>> {
    const columns: Array<EntityTableColumn<TestInfo>> = [
      new DateEntityTableColumn<TestInfo>('createdTime', 'common.created-time', this.datePipe, '150px'),
      new EntityTableColumn<TestInfo>('name', 'test.name', '25%'),
      new EntityTableColumn<TestInfo>('road', 'test.road', '25%'),
      new EntityTableColumn<TestInfo>('accidentType', 'test.accidentType', '25%'),
      new EntityTableColumn<TestInfo>('nrOfVehicles', 'test.nrOfVehicles', '25%')


    ];


    return columns;
  }

  configureEntityFunctions(testScope: string): void {
    if (testScope === 'tenant') {
      this.config.entitiesFetchFunction = pageLink =>
        this.testService.getTenantTests(pageLink);
      this.config.deleteEntity = id => this.testService.deleteTest(id.id);
    }  else {
      this.config.entitiesFetchFunction = pageLink =>
        this.testService.getCustomerTestInfosByTestProfileId(this.customerId, pageLink,
          this.config.componentsData.testProfileId !== null ?
            this.config.componentsData.testProfileId.id : '');
    }
  }

  // configureCellActions(testScope: string): Array<CellActionDescriptor<TestInfo>> {
  //   const actions: Array<CellActionDescriptor<TestInfo>> = [];
  //   if (testScope === 'tenant') {
  //     actions.push(
  //       {
  //         name: this.translate.instant('test.make-public'),
  //         icon: 'share',
  //         isEnabled: (entity) => (!entity.customerId || entity.customerId.id === NULL_UUID),
  //         onAction: ($event, entity) => this.makePublic($event, entity)
  //       },
  //       {
  //         name: this.translate.instant('test.assign-to-customer'),
  //         icon: 'assignment_ind',
  //         isEnabled: (entity) => (!entity.customerId || entity.customerId.id === NULL_UUID),
  //         onAction: ($event, entity) => this.assignToCustomer($event, [entity.id])
  //       },
  //       {
  //         name: this.translate.instant('test.unassign-from-customer'),
  //         icon: 'assignment_return',
  //         isEnabled: (entity) => (entity.customerId && entity.customerId.id !== NULL_UUID && !entity.customerIsPublic),
  //         onAction: ($event, entity) => this.unassignFromCustomer($event, entity)
  //       },
  //       {
  //         name: this.translate.instant('test.make-private'),
  //         icon: 'reply',
  //         isEnabled: (entity) => (entity.customerId && entity.customerId.id !== NULL_UUID && entity.customerIsPublic),
  //         onAction: ($event, entity) => this.unassignFromCustomer($event, entity)
  //       },
  //       {
  //         name: this.translate.instant('test.manage-credentials'),
  //         icon: 'security',
  //         isEnabled: () => true,
  //         onAction: ($event, entity) => this.manageCredentials($event, entity)
  //       }
  //     );
  //   }
  //   if (testScope === 'customer') {
  //     actions.push(
  //       {
  //         name: this.translate.instant('test.unassign-from-customer'),
  //         icon: 'assignment_return',
  //         isEnabled: (entity) => (entity.customerId && entity.customerId.id !== NULL_UUID && !entity.customerIsPublic),
  //         onAction: ($event, entity) => this.unassignFromCustomer($event, entity)
  //       },
  //       {
  //         name: this.translate.instant('test.make-private'),
  //         icon: 'reply',
  //         isEnabled: (entity) => (entity.customerId && entity.customerId.id !== NULL_UUID && entity.customerIsPublic),
  //         onAction: ($event, entity) => this.unassignFromCustomer($event, entity)
  //       },
  //       {
  //         name: this.translate.instant('test.manage-credentials'),
  //         icon: 'security',
  //         isEnabled: () => true,
  //         onAction: ($event, entity) => this.manageCredentials($event, entity)
  //       }
  //     );
  //   }
  //   if (testScope === 'customer_user' || testScope === 'edge_customer_user') {
  //     actions.push(
  //       {
  //         name: this.translate.instant('test.view-credentials'),
  //         icon: 'security',
  //         isEnabled: () => true,
  //         onAction: ($event, entity) => this.manageCredentials($event, entity)
  //       }
  //     );
  //   }
  //   if (testScope === 'edge') {
  //     actions.push(
  //       {
  //         name: this.translate.instant('edge.unassign-from-edge'),
  //         icon: 'assignment_return',
  //         isEnabled: (entity) => true,
  //         onAction: ($event, entity) => this.unassignFromEdge($event, entity)
  //       }
  //     );
  //   }
  //   return actions;
  // }

  configureGroupActions(testScope: string): Array<GroupActionDescriptor<TestInfo>> {
    const actions: Array<GroupActionDescriptor<TestInfo>> = [];
    if (testScope === 'tenant') {
      actions.push(
        {
          name: this.translate.instant('test.assign-test'),
          icon: 'assignment_ind',
          isEnabled: true,
          onAction: ($event, entities) => this.assignToCustomer($event, entities.map((entity) => entity.id))
        }
      );
    }

    // if (testScope === 'edge') {
    //   actions.push(
    //     {
    //       name: this.translate.instant('test.unassign-tests-from-edge'),
    //       icon: 'assignment_return',
    //       isEnabled: true,
    //       onAction: ($event, entities) => this.unassignTestsFromEdge($event, entities)
    //     }
    //   );
    // }
    return actions;
  }

  configureAddActions(testScope: string): Array<HeaderActionDescriptor> {
    const actions: Array<HeaderActionDescriptor> = [];
    if (testScope === 'tenant') {
      actions.push(
        {
          name: this.translate.instant('test.add-test-text'),
          icon: 'insert_drive_file',
          isEnabled: () => true,
          onAction: ($event) => this.testWizard($event)
        }
        // {
        //   name: this.translate.instant('test.import'),
        //   icon: 'file_upload',
        //   isEnabled: () => true,
        //   onAction: ($event) => this.importTests($event)
        // },
      );
    }
    if (testScope === 'customer') {
      actions.push(
        {
          name: this.translate.instant('test.assign-new-test'),
          icon: 'add',
          isEnabled: () => true,
          onAction: ($event) => this.addTestsToCustomer($event)
        }
      );
    }
    if (testScope === 'edge') {
      actions.push(
        {
          name: this.translate.instant('test.assign-new-test'),
          icon: 'add',
          isEnabled: () => true,
          onAction: ($event) => this.addTestsToEdge($event)
        }
      );
    }
    return actions;
  }

  importTests($event: Event) {
    this.homeDialogs.importEntities(EntityType.TEST).subscribe((res) => {
      if (res) {
        this.broadcast.broadcast('testSaved');
        this.config.table.updateData();
      }
    });
  }

  testWizard($event: Event) {
    this.dialog.open<TestWizardDialogComponent, AddEntityDialogData<BaseData<HasId>>,
      boolean>(TestWizardDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        entitiesTableConfig: this.config.table.entitiesTableConfig
      }
    }).afterClosed().subscribe(
      (res) => {
        if (res) {
          this.config.table.updateData();
        }
      }
    );
  }

  addTestsToCustomer($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<AddEntitiesToCustomerDialogComponent, AddEntitiesToCustomerDialogData,
      boolean>(AddEntitiesToCustomerDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        customerId: this.customerId,
        entityType: EntityType.TEST
      }
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.config.table.updateData();
        }
      });
  }


  assignToCustomer($event: Event, testIds: Array<TestId>) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<AssignToCustomerDialogComponent, AssignToCustomerDialogData,
      boolean>(AssignToCustomerDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        entityIds: testIds,
        entityType: EntityType.TEST
      }
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.config.table.updateData();
        }
      });
  }

  // unassignFromCustomer($event: Event, test: TestInfo) {
  //   if ($event) {
  //     $event.stopPropagation();
  //   }
  //   const isPublic = test.customerIsPublic;
  //   let title;
  //   let content;
  //   if (isPublic) {
  //     title = this.translate.instant('test.make-private-test-title', {testName: test.name});
  //     content = this.translate.instant('test.make-private-test-text');
  //   } else {
  //     title = this.translate.instant('test.unassign-test-title', {testName: test.name});
  //     content = this.translate.instant('test.unassign-test-text');
  //   }
  //   this.dialogService.confirm(
  //     title,
  //     content,
  //     this.translate.instant('action.no'),
  //     this.translate.instant('action.yes'),
  //     true
  //   ).subscribe((res) => {
  //       if (res) {
  //         this.testService.unassignTestFromCustomer(test.id.id).subscribe(
  //           () => {
  //             this.config.table.updateData();
  //           }
  //         );
  //       }
  //     }
  //   );
  // }


  manageCredentials($event: Event, test: Test) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<TestCredentialsDialogComponent, TestCredentialsDialogData,
      TestCredentials>(TestCredentialsDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        testId: test.id.id,
        isReadOnly: this.config.componentsData.testScope === 'customer_user'
      }
    }).afterClosed().subscribe(testCredentials => {
      if (isDefinedAndNotNull(testCredentials)) {
        this.config.componentsData.testCredentials$.next(testCredentials);
      }
    });
  }


  addTestsToEdge($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<AddEntitiesToEdgeDialogComponent, AddEntitiesToEdgeDialogData,
      boolean>(AddEntitiesToEdgeDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        edgeId: this.config.componentsData.edgeId,
        entityType: EntityType.TEST
      }
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.config.table.updateData();
        }
      });
  }






}
