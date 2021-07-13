/**
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.server.dao.test;

import com.google.common.util.concurrent.ListenableFuture;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.thingsboard.server.common.data.*;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.id.TestId;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.common.data.tenant.profile.DefaultTenantProfileConfiguration;
import org.thingsboard.server.dao.entity.AbstractEntityService;
import org.thingsboard.server.dao.exception.DataValidationException;
import org.thingsboard.server.dao.service.DataValidator;
import org.thingsboard.server.dao.service.PaginatedRemover;
import org.thingsboard.server.dao.service.Validator;
import org.thingsboard.server.dao.tenant.TbTenantProfileCache;
import org.thingsboard.server.dao.tenant.TenantDao;

import static org.thingsboard.server.dao.service.Validator.validateId;

@Service
@Slf4j
public class TestServiceImpl extends AbstractEntityService implements TestService {

    public static final String INCORRECT_TEST_ID = "Incorrect testId ";
    public static final String INCORRECT_TENANT_ID = "Incorrect tenantId ";

    @Autowired
    private TestDao testDao;

    @Autowired
    private TestInfoDao testInfoDao;

    @Autowired
    private TenantDao tenantDao;



    @Autowired
    @Lazy
    private TbTenantProfileCache tenantProfileCache;

    @Override
    public Test findTestById(TenantId tenantId, TestId testId) {
        log.trace("Executing findTestById [{}]", testId);
        Validator.validateId(testId, INCORRECT_TEST_ID + testId);
        return testDao.findById(tenantId, testId.getId());

    }

    @Override
    public ListenableFuture<Test> findTestByIdAsync(TenantId tenantId, TestId testId) {
        log.trace("Executing findTestByIdAsync [{}]", testId);
        validateId(testId, INCORRECT_TEST_ID + testId);
        return testDao.findByIdAsync(tenantId, testId.getId());
    }

    @Override
    public TestInfo findTestInfoById(TenantId tenantId, TestId testId) {
        log.trace("Executing findTestInfoById [{}]", testId);
        Validator.validateId(testId, INCORRECT_TEST_ID + testId);
        return testInfoDao.findById(tenantId, testId.getId());
    }

    @Override
    public ListenableFuture<TestInfo> findTestInfoByIdAsync(TenantId tenantId, TestId testId) {
        log.trace("Executing findTestInfoByIdAsync [{}]", testId);
        validateId(testId, INCORRECT_TEST_ID + testId);
        return testInfoDao.findByIdAsync(tenantId, testId.getId());
    }

    @Override
    public Test saveTest(Test test) {
        System.out.println("test name"+test.getName());
        log.trace("Executing saveTest [{}]", test);
        testValidator.validate(test, TestInfo::getTenantId);
        return testDao.save(test.getTenantId(), test);
    }




    @Override
    public void deleteTest(TenantId tenantId, TestId testId) {
        log.trace("Executing deleteTest [{}]", testId);
        Validator.validateId(testId, INCORRECT_TEST_ID + testId);
        deleteEntityRelations(tenantId, testId);
        try {
            testDao.removeById(tenantId, testId.getId());
            return ;
        } catch (Exception t) {
            ConstraintViolationException e = extractConstraintViolationException(t).orElse(null);
            if (e != null && e.getConstraintName() != null && e.getConstraintName().equalsIgnoreCase("fk_default_test_device_profile")) {
                throw new DataValidationException("The test referenced by the device profiles cannot be deleted!");
            } else {
                throw t;
            }
        }
    }



    @Override
    public PageData<TestInfo> findTestByTenantId(TenantId tenantId, PageLink pageLink) {
        log.trace("Executing findTestsByTenantId, tenantId [{}], pageLink [{}]", tenantId, pageLink);
        Validator.validateId(tenantId, INCORRECT_TENANT_ID + tenantId);
        Validator.validatePageLink(pageLink);
        return testInfoDao.findTestsByTenantId(tenantId.getId(), pageLink);
    }

    @Override
    public void deleteTestsByTenantId(TenantId tenantId) {
        log.trace("Executing deleteTestsByTenantId, tenantId [{}]", tenantId);
        Validator.validateId(tenantId, INCORRECT_TENANT_ID + tenantId);
        tenantTestsRemover.removeEntities(tenantId, tenantId);
    }

    @Override
    public PageData<TestInfo> findTestByTenantId(TenantId tenantId, String type, PageLink pageLink) {
        return null;
    }




    private DataValidator<Test> testValidator =
            new DataValidator<Test>() {
                @Override
                protected void validateCreate(TenantId tenantId, Test data) {
                    DefaultTenantProfileConfiguration profileConfiguration =
                            (DefaultTenantProfileConfiguration)tenantProfileCache.get(tenantId).getProfileData().getConfiguration();
                    long maxTests = profileConfiguration.getMaxTests();
                    validateNumberOfEntitiesPerTenant(tenantId, null, maxTests, EntityType.TEST);
                }

                @Override
                protected void validateDataImpl(TenantId tenantId, Test test) {
                    System.out.println(test);
                    if (StringUtils.isEmpty(test.getName())) {

                        throw new DataValidationException("Test name should be specified!");
                    }
                    if (test.getTenantId() == null) {
                        throw new DataValidationException("Test should be assigned to tenant!");
                    } else {
                        Tenant tenant = tenantDao.findById(tenantId, test.getTenantId().getId());
                        if (tenant == null) {
                            throw new DataValidationException("Test is referencing to non-existent tenant!");
                        }
                    }
                }
            };

    private PaginatedRemover<TenantId, TestInfo> tenantTestsRemover =
            new PaginatedRemover<TenantId, TestInfo>() {

                @Override
                protected PageData<TestInfo> findEntities(TenantId tenantId, TenantId id, PageLink pageLink) {
                    return testInfoDao.findTestsByTenantId(id.getId(), pageLink);
                }

                @Override
                protected void removeEntity(TenantId tenantId, TestInfo entity) {
                    deleteTest(tenantId, new TestId(entity.getUuidId()));
                }
            };



}
