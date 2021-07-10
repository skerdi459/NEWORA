


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

import { Component, Inject, OnInit, SkipSelf } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { TestService } from '@core/http/test.service';
import { credentialTypeNames, TestCredentials, TestCredentialsType } from '@shared/models/test.models';
import { DialogComponent } from '@shared/components/dialog.component';
import { Router } from '@angular/router';

export interface TestCredentialsDialogData {
  isReadOnly: boolean;
  testId: string;
}

@Component({
  selector: 'tb-test-credentials-dialog',
  templateUrl: './test-credentials-dialog.component.html',
  providers: [{provide: ErrorStateMatcher, useExisting: TestCredentialsDialogComponent}],
  styleUrls: []
})
export class TestCredentialsDialogComponent extends
  DialogComponent<TestCredentialsDialogComponent, TestCredentials> implements OnInit, ErrorStateMatcher {

  testCredentialsFormGroup: FormGroup;

  isReadOnly: boolean;

  testCredentials: TestCredentials;

  submitted = false;

  testCredentialsType = TestCredentialsType;

  credentialsTypes = Object.keys(TestCredentialsType);

  credentialTypeNamesMap = credentialTypeNames;

  hidePassword = true;

  constructor(protected store: Store<AppState>,
              protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: TestCredentialsDialogData,
              private testService: TestService,
              @SkipSelf() private errorStateMatcher: ErrorStateMatcher,
              public dialogRef: MatDialogRef<TestCredentialsDialogComponent, TestCredentials>,
              public fb: FormBuilder) {
    super(store, router, dialogRef);

    this.isReadOnly = data.isReadOnly;
  }

  ngOnInit(): void {
    this.testCredentialsFormGroup = this.fb.group({
      credential: [null]
    });
    if (this.isReadOnly) {
      this.testCredentialsFormGroup.disable({emitEvent: false});
    }
    // this.loadTestCredentials();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this.errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.submitted);
    return originalErrorState || customErrorState;
  }

  // loadTestCredentials() {
  //   this.testService.getTestCredentials(this.data.testId).subscribe(
  //     (testCredentials) => {
  //       this.testCredentials = testCredentials;
  //       this.testCredentialsFormGroup.patchValue({
  //         credential: testCredentials
  //       }, {emitEvent: false});
  //     }
  //   );
  // }

  cancel(): void {
    this.dialogRef.close(null);
  }
  //
  // save(): void {
  //   this.submitted = true;
  //   const testCredentialsValue = this.testCredentialsFormGroup.value.credential;
  //   this.testCredentials = {...this.testCredentials, ...testCredentialsValue};
  //   this.testService.saveTestCredentials(this.testCredentials).subscribe(
  //     (testCredentials) => {
  //       this.dialogRef.close(testCredentials);
  //     }
  //   );
  // }
}
