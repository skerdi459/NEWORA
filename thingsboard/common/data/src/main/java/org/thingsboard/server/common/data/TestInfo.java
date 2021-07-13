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
package org.thingsboard.server.common.data;

import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.id.TestId;

public class TestInfo extends SearchTextBased<TestId> implements HasName, HasTenantId {

    private TenantId tenantId;
    private String name;
    private String road;
    private String accidentType;
    private int nrOfVehicles;
    private String description;

    public String getTitle() {
        return name;
    }

    public void setTitle(String title) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getNrOfVehicles() {
        return nrOfVehicles;
    }

    public TestInfo() {
        super();
    }

    public TestInfo(TestId id) {
        super(id);
    }

    public TestInfo(TestInfo dashboardInfo) {
        super(dashboardInfo);
        this.tenantId = dashboardInfo.getTenantId();
        this.name = dashboardInfo.getName();
        this.road = dashboardInfo.getRoad();
        this.accidentType = dashboardInfo.getRoad();
        this.nrOfVehicles=dashboardInfo.getNrOfVehicles();
        this.description=dashboardInfo.getDescription();
    }

    public void setNrOfVehicles(int nrOfVehicles) {
        this.nrOfVehicles = nrOfVehicles;
    }

    public TenantId getTenantId() {
        return tenantId;
    }

    public void setTenantId(TenantId tenantId) {
        this.tenantId = tenantId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoad() {
        return road;
    }

    public void setRoad(String road) {
        this.road = road;
    }

    public String getAccidentType() {
        return accidentType;
    }

    public void setAccidentType(String accidentType) {
        this.accidentType = accidentType;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getSearchText() {
        return getName();
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((tenantId == null) ? 0 : tenantId.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());


        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!super.equals(obj))
            return false;
        if (getClass() != obj.getClass())
            return false;
        TestInfo other = (TestInfo) obj;
        if (tenantId == null) {
            if (other.tenantId != null)
                return false;
        } else if (!tenantId.equals(other.tenantId))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;

        if (road == null) {
            if (other.road != null)
                return false;
        } else if (!road.equals(other.road))
            return false;

        if (accidentType == null) {
            if (other.accidentType != null)
                return false;
        } else if (!accidentType.equals(other.accidentType))
            return false;

        if (description == null) {
            if (other.description != null)
                return false;
        } else if (!description.equals(other.description))
            return false;



        return true;

    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("TestInfo [tenantId=");
        builder.append(tenantId);
        builder.append(", name=");
        builder.append(name);
        builder.append(", road=");
        builder.append(road);
        builder.append(", accidentType=");
        builder.append(accidentType);
        builder.append(", nrOfVehicles=");
        builder.append(nrOfVehicles);
        builder.append(", description=");
        builder.append(description);

        builder.append("]");
        return builder.toString();
    }

}
