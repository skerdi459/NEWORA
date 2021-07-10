package org.thingsboard.server.controller;


import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.thingsboard.server.common.data.EntityType;
import org.thingsboard.server.common.data.Test;
import org.thingsboard.server.common.data.TestInfo;
import org.thingsboard.server.common.data.audit.ActionType;
import org.thingsboard.server.common.data.edge.EdgeEventActionType;
import org.thingsboard.server.common.data.exception.ThingsboardException;
import org.thingsboard.server.common.data.id.EdgeId;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.id.TestId;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.queue.util.TbCoreComponent;
import org.thingsboard.server.service.security.permission.Operation;
import org.thingsboard.server.service.security.permission.Resource;

import java.util.List;

@RestController
@TbCoreComponent
@RequestMapping("/api")
public class TestController extends BaseController {

    public static final String TEST_ID = "testId";

    private static final String HOME_TEST_ID = "homeTestId";
    private static final String HOME_TEST_HIDE_TOOLBAR = "homeTestHideToolbar";

//    @Value("${test.max_datapoints_limit}")
//    private long maxDatapointsLimit;


    @PreAuthorize("hasAnyAuthority('SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER')")
    @RequestMapping(value = "/test/serverTime", method = RequestMethod.GET)
    @ResponseBody
    public long getServerTime() throws ThingsboardException {
        return System.currentTimeMillis();
    }




    @PreAuthorize("hasAnyAuthority('SYS_ADMIN', 'TENANT_ADMIN', 'CUSTOMER_USER')")
    @RequestMapping(value = "/test/info/{testId}", method = RequestMethod.GET)
    @ResponseBody
    public TestInfo getTestInfoById(@PathVariable(TEST_ID) String strTestId) throws ThingsboardException {
        checkParameter(TEST_ID, strTestId);
        try {
            TestId testId = new TestId(toUUID(strTestId));
            return checkTestInfoId(testId, Operation.READ);
        } catch (Exception e) {
            System.out.println("mire");
            throw handleException(e);
        }
    }

    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'CUSTOMER_USER')")
    @RequestMapping(value = "/test/{testId}", method = RequestMethod.GET)
    @ResponseBody
    public Test getTestById(@PathVariable(TEST_ID) String strTestId) throws ThingsboardException {
        checkParameter(TEST_ID, strTestId);
        System.out.println("1");
        try {
            System.out.println("2");
            TestId testId = new TestId(toUUID(strTestId));
            return checkTestId(testId, Operation.READ);
        } catch (Exception e) {
            throw handleException(e);
        }
    }

    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'CUSTOMER_USER')")
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    @ResponseBody
    public Test saveTest(@RequestBody Test test ) throws ThingsboardException {
        boolean created = test.getId() == null;
        try {
                test.setTenantId(getCurrentUser().getTenantId());

                checkEntity(test.getId(), test, Resource.TEST);

            Test savedTest = checkNotNull(testService.saveTest(test));

                if (!created) {
                    sendEntityNotificationMsg(savedTest.getTenantId(), savedTest.getId(), EdgeEventActionType.UPDATED);
                }
                System.out.println("vij ktu3");

                return savedTest;
        } catch (Exception e) {

            logEntityAction(emptyId(EntityType.TEST), test,
                    null, created ? ActionType.ADDED : ActionType.UPDATED, e);
            throw handleException(e);
        }

    }


    @PreAuthorize("hasAuthority('TENANT_ADMIN')")
    @RequestMapping(value = "/test/{testId}", method = RequestMethod.DELETE)
    @ResponseStatus(value = HttpStatus.OK)
    public void deleteTest(@PathVariable(TEST_ID) String strTestId) throws ThingsboardException {
        checkParameter(TEST_ID, strTestId);

        try {
            TestId testId = new TestId(toUUID(strTestId));
            Test test = checkTestId(testId, Operation.DELETE);
            List<EdgeId> relatedEdgeIds = findRelatedEdgeIds(getTenantId(), testId);
            testService.deleteTest(getCurrentUser().getTenantId(), testId);
            logEntityAction(testId, test,
                    null,
                    ActionType.DELETED, null, strTestId);

            sendDeleteNotificationMsg(getTenantId(), testId, relatedEdgeIds);
        } catch (Exception e) {
            System.out.println("5");
            logEntityAction(emptyId(EntityType.TEST),
                    null,
                    null,
                    ActionType.DELETED, e, strTestId);

            throw handleException(e);
        }
    }


















    @PreAuthorize("hasAuthority('TENANT_ADMIN')")
    @RequestMapping(value = "/tenant/tests", params = {"pageSize", "page"}, method = RequestMethod.GET)
    @ResponseBody
    public PageData<TestInfo> getTenantDevices(
            @RequestParam int pageSize,
            @RequestParam int page,
            @RequestParam(required = false) String textSearch,
            @RequestParam(required = false) String sortProperty,
            @RequestParam(required = false) String sortOrder) throws ThingsboardException {
        try {
            System.out.println(":::::::::::");
            TenantId tenantId = getCurrentUser().getTenantId();
            System.out.println("sdad"+tenantId);
            PageLink pageLink = createPageLink(pageSize, page, textSearch, sortProperty, sortOrder);
            System.out.println(":::::::::::"+pageLink);
            System.out.println((checkNotNull(testService.findTestByTenantId(tenantId, pageLink))));
                return checkNotNull(testService.findTestByTenantId(tenantId, pageLink));

        } catch (Exception e) {
            System.out.println("jemi gb");
            throw handleException(e);
        }
    }





}
