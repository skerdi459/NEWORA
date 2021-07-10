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
import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { EntityComponent } from '../../components/entity/entity.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntityType } from '@shared/models/entity-type.models';
import { NULL_UUID } from '@shared/models/id/has-uuid';
import { ActionNotificationShow } from '@core/notification/notification.actions';
import { TranslateService } from '@ngx-translate/core';
import { EntityTableConfig } from '@home/models/entity/entities-table-config.models';
import { TestInfo } from "@shared/models/test.models";
@Component({
  selector: 'tb-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent extends EntityComponent<TestInfo> {
  entityType = EntityType;
  testScope: 'tenant' | 'customer' | 'customer_user';
  constructor(protected store: Store<AppState>,
              protected translate: TranslateService,
              @Inject('entity') protected entityValue: TestInfo,
              @Inject('entitiesTableConfig') protected entitiesTableConfigValue: EntityTableConfig<TestInfo>,
              public fb: FormBuilder) {
    super(store, fb, entityValue, entitiesTableConfigValue);
  }
  ngOnInit() {
    this.testScope = this.entitiesTableConfig.componentsData.testScope;
    super.ngOnInit();
  }
  hideDelete() {
    if (this.entitiesTableConfig) {
      return !this.entitiesTableConfig.deleteEnabled(this.entity);
    } else {
      return false;
    }
  }
  buildForm(entity: TestInfo): FormGroup {
    return this.fb.group(
      {
        name: ['', Validators.required],
        road: ['', Validators.required],
        accidentType: ['', Validators.required],
        nrOfVehicles: ['', Validators.required],
        description: ['']
      }
    );
  }
  updateForm(entity: TestInfo) {
    this.entityForm.patchValue({name: entity.name});
    this.entityForm.patchValue({type: entity.road});
    this.entityForm.patchValue({label: entity.accidentType});
    this.entityForm.patchValue({type: entity.nrOfVehicles});
    this.entityForm.patchValue({label: entity.description});
  }

  onTestIdCopied($event) {
    this.store.dispatch(new ActionNotificationShow(
      {
        message: this.translate.instant('test.idCopiedMessage'),
        type: 'success',
        duration: 750,
        verticalPosition: 'bottom',
        horizontalPosition: 'right'
      }));
  }


}

