package org.thingsboard.server.dao.test;

import org.thingsboard.server.common.data.TestInfo;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.dao.Dao;

import java.util.UUID;

public interface TestInfoDao extends Dao<TestInfo> {

    /**
     * Find dashboards by tenantId and page link.
     *
     * @param tenantId the tenantId
     * @param pageLink the page link
     * @return the list of dashboard objects
     */
    PageData<TestInfo> findTestsByTenantId(UUID tenantId, PageLink pageLink);

    /**
     * Find dashboards by tenantId, customerId and page link.
     *
     * @param tenantId the tenantId
     * @param customerId the customerId
     * @param pageLink the page link
     * @return the list of dashboard objects
     */
    PageData<TestInfo> findTestsByTenantIdAndCustomerId(UUID tenantId, UUID customerId, PageLink pageLink);

    /**
     * Find dashboards by tenantId, edgeId and page link.
     *
     * @param tenantId the tenantId
     * @param edgeId the edgeId
     * @param pageLink the page link
     * @return the list of dashboard objects
     */
    PageData<TestInfo> findTestsByTenantIdAndEdgeId(UUID tenantId, UUID edgeId, PageLink pageLink);

}
