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

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { EntityTableHeaderComponent } from '../../components/entity/entity-table-header.component';
import { TestInfo } from '@app/shared/models/test.models';
import { EntityType } from '@shared/models/entity-type.models';
import { TestProfileId } from '../../../../shared/models/id/test-profile-id';

@Component({
  selector: 'tb-test-table-header',
  templateUrl: './test-table-header.component.html',
  styleUrls: ['./test-table-header.component.scss']
})
export class TestTableHeaderComponent extends EntityTableHeaderComponent<TestInfo> {

  entityType = EntityType;

  constructor(protected store: Store<AppState>) {
    super(store);
  }

  testProfileChanged(testProfileId: TestProfileId) {
    this.entitiesTableConfig.componentsData.testProfileId = testProfileId;
    this.entitiesTableConfig.table.resetSortAndFilter(true);
  }

}
