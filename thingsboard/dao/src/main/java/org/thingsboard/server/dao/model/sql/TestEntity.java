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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.thingsboard.server.common.data.ShortCustomerInfo;
import org.thingsboard.server.common.data.Test;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.id.TestId;
import org.thingsboard.server.dao.model.BaseSqlEntity;
import org.thingsboard.server.dao.model.ModelConstants;
import org.thingsboard.server.dao.model.SearchTextEntity;
import org.thingsboard.server.dao.util.mapping.JsonStringType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.UUID;

@Data
@Slf4j
@EqualsAndHashCode(callSuper = true)
@Entity
@TypeDef(name = "json", typeClass = JsonStringType.class)
@Table(name = ModelConstants.TEST_COLUMN_FAMILY_NAME)
public final class TestEntity extends BaseSqlEntity<Test> implements SearchTextEntity<Test> {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final JavaType assignedCustomersType =
            objectMapper.getTypeFactory().constructCollectionType(HashSet.class, ShortCustomerInfo.class);


    @Column(name = ModelConstants.TEST_TENANT_ID_PROPERTY)
    private UUID tenantId;

    @Column(name = ModelConstants.TEST_TITLE_PROPERTY)
    private String name;

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


    @Type(type = "json")
    @Column(name = ModelConstants.TEST_CONFIGURATION_PROPERTY)
    private JsonNode configuration;

    public TestEntity() {
        super();
    }

    public TestEntity(Test test) {
        if (test.getId() != null) {
            this.setUuid(test.getId().getId());
        }
        this.setCreatedTime(test.getCreatedTime());
        if (test.getTenantId() != null) {
            this.tenantId = test.getTenantId().getId();
        }
        this.name = test.getName();
        this.road = test.getRoad();
        this.accidentType = test.getAccidentType();
        this.nrOfVehicles = test.getNrOfVehicles();
        this.description=test.getDescription();

        this.configuration = test.getConfiguration();
    }

    @Override
    public String getSearchTextSource() {
        return name;
    }

    @Override
    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    @Override
    public Test toData() {
        Test test = new Test(new TestId(this.getUuid()));
        test.setCreatedTime(this.getCreatedTime());
        if (tenantId != null) {
            test.setTenantId(new TenantId(tenantId));
        }
        test.setName(name);
        test.setRoad(road);
        test.setAccidentType(accidentType);
        test.setNrOfVehicles(nrOfVehicles);
        test.setDescription(description);


        test.setConfiguration(configuration);
        return test;
    }
}
