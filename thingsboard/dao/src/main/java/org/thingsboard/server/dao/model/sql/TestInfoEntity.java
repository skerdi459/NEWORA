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
package org.thingsboard.server.dao.model.sql;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.thingsboard.server.common.data.ShortCustomerInfo;
import org.thingsboard.server.common.data.TestInfo;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.id.TestId;
import org.thingsboard.server.dao.model.BaseSqlEntity;
import org.thingsboard.server.dao.model.ModelConstants;
import org.thingsboard.server.dao.model.SearchTextEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.UUID;

@Data
@Slf4j
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = ModelConstants.TEST_COLUMN_FAMILY_NAME)
public class TestInfoEntity extends BaseSqlEntity<TestInfo> implements SearchTextEntity<TestInfo> {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final JavaType assignedCustomersType =
            objectMapper.getTypeFactory().constructCollectionType(HashSet.class, ShortCustomerInfo.class);

    @Column(name = ModelConstants.TEST_TENANT_ID_PROPERTY)
    private UUID tenantId;

    @Column(name = ModelConstants.TEST_TITLE_PROPERTY)
    private String title;

    @Column(name = ModelConstants.TEST_ROAD_PROPERTY)
    private String road;

    @Column(name = ModelConstants.TEST_ACCIDENT_TYPE_PROPERTY)
    private String accidentType;

    @Column(name = ModelConstants.TEST_NR_OF_VEHICLES_PROPERTY)
    private int nrOfVehicles;

    @Column(name = ModelConstants.TEST_DESCRIPTION_PROPERTY)
    private String description;

    @Column(name = ModelConstants.SEARCH_TEXT_PROPERTY)
    private String searchText;



    public TestInfoEntity() {
        super();
    }

    public TestInfoEntity(TestInfo testInfo) {
        if (testInfo.getId() != null) {
            this.setUuid(testInfo.getId().getId());
        }
        this.setCreatedTime(testInfo.getCreatedTime());
        if (testInfo.getTenantId() != null) {
            this.tenantId = testInfo.getTenantId().getId();
        }
        this.title = testInfo.getName();
        this.road=testInfo.getRoad();
        this.accidentType=testInfo.getAccidentType();
        this.nrOfVehicles=testInfo.getNrOfVehicles();
        this.description=testInfo.getDescription();

    }

    @Override
    public String getSearchTextSource() {
        return title;
    }

    @Override
    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    public String getSearchText() {
        return searchText;
    }

    @Override
    public TestInfo toData() {
        TestInfo testInfo = new TestInfo(new TestId(this.getUuid()));
        testInfo.setCreatedTime(createdTime);
        if (tenantId != null) {
            testInfo.setTenantId(new TenantId(tenantId));
        }
        testInfo.setName(title);
        testInfo.setRoad(road);
        testInfo.setAccidentType(accidentType);
        testInfo.setNrOfVehicles(nrOfVehicles);
        testInfo.setDescription(description);

        return testInfo;
    }

}
