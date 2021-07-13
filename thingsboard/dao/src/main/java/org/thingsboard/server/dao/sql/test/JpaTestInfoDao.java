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
package org.thingsboard.server.dao.sql.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.thingsboard.server.common.data.TestInfo;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.dao.DaoUtil;
import org.thingsboard.server.dao.test.TestInfoDao;
import org.thingsboard.server.dao.model.sql.TestInfoEntity;
import org.thingsboard.server.dao.relation.RelationDao;
import org.thingsboard.server.dao.sql.JpaAbstractSearchTextDao;

import java.util.Objects;
import java.util.UUID;

/**
 * Created by Valerii Sosliuk on 5/6/2017.
 */
@Slf4j
@Component
public class JpaTestInfoDao extends JpaAbstractSearchTextDao<TestInfoEntity, TestInfo> implements TestInfoDao {

    @Autowired
    private TestInfoRepository testInfoRepository;

    @Autowired
    private RelationDao relationDao;

    @Override
    protected Class<TestInfoEntity> getEntityClass() {
        return TestInfoEntity.class;
    }

    @Override
    protected CrudRepository<TestInfoEntity, UUID> getCrudRepository() {
        return testInfoRepository;
    }

    @Override
    public PageData<TestInfo> findTestsByTenantId(UUID tenantId, PageLink pageLink) {
        return DaoUtil.toPageData(testInfoRepository
                .findByTenantId(
                        tenantId,
                        Objects.toString(pageLink.getTextSearch(), ""),
                        DaoUtil.toPageable(pageLink)));
    }


}
