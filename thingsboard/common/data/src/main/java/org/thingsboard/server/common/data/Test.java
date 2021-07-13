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

import com.fasterxml.jackson.databind.JsonNode;
import org.thingsboard.server.common.data.id.TestId;

public class Test extends TestInfo {

    private static final long serialVersionUID = 872682138346187503L;

    private transient JsonNode configuration;

    public Test() {
        super();
    }

    public Test(TestId id) {
        super(id);
    }

    public Test(TestInfo dashboardInfo) {
        super(dashboardInfo);
    }

    public Test(Test test) {
        super(test);
        this.configuration = test.getConfiguration();
    }

    public JsonNode getConfiguration() {
        return configuration;
    }

    public void setConfiguration(JsonNode configuration) {
        this.configuration = configuration;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((configuration == null) ? 0 : configuration.hashCode());
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
        Test other = (Test) obj;
        if (configuration == null) {
            if (other.configuration != null)
                return false;
        } else if (!configuration.equals(other.configuration))
            return false;
        return true;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Test [tenantId=");
        builder.append(getTenantId());
        builder.append(", name=");
        builder.append(getName());
        builder.append(", road=");
        builder.append(getRoad());
        builder.append(", accidentType=");
        builder.append(getAccidentType());
        builder.append(", nrOfVehicles=");
        builder.append(getNrOfVehicles());
        builder.append(", description=");
        builder.append(getDescription());
        builder.append(", configuration=");
        builder.append(configuration);
        builder.append("]");
        return builder.toString();
    }
}
