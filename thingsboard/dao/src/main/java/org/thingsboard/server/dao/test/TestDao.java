package org.thingsboard.server.dao.test;

import org.thingsboard.server.common.data.Test;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.dao.Dao;
import org.thingsboard.server.dao.TenantEntityDao;

public interface TestDao extends Dao<Test>, TenantEntityDao {

    /**
     * Save or update dashboard object
     *
     * @param test the dashboard object
     * @return saved dashboard object
     */
    Test save(TenantId tenantId, Test test );
}