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
package org.thingsboard.server.transport.coap.telemetry.timeseries;

import com.github.os72.protobuf.dynamic.DynamicSchema;
import com.google.protobuf.Descriptors;
import com.google.protobuf.DynamicMessage;
import com.squareup.wire.schema.internal.parser.ProtoFileElement;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Test;
import org.thingsboard.server.common.data.CoapDeviceType;
import org.thingsboard.server.common.data.DeviceProfileProvisionType;
import org.thingsboard.server.common.data.TransportPayloadType;
import org.thingsboard.server.common.data.device.profile.CoapDeviceProfileTransportConfiguration;
import org.thingsboard.server.common.data.device.profile.CoapDeviceTypeConfiguration;
import org.thingsboard.server.common.data.device.profile.DefaultCoapDeviceTypeConfiguration;
import org.thingsboard.server.common.data.device.profile.DeviceProfileTransportConfiguration;
import org.thingsboard.server.common.data.device.profile.ProtoTransportPayloadConfiguration;
import org.thingsboard.server.common.data.device.profile.TransportPayloadTypeConfiguration;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@Slf4j
public abstract class AbstractCoapTimeseriesProtoIntegrationTest extends AbstractCoapTimeseriesIntegrationTest {

    @After
    public void afterTest() throws Exception {
        processAfterTest();
    }

    @Test
    public void testPushTelemetry() throws Exception {
        super.processBeforeTest("Test Post Telemetry device proto payload", CoapDeviceType.DEFAULT, TransportPayloadType.PROTOBUF);
        DeviceProfileTransportConfiguration transportConfiguration = deviceProfile.getProfileData().getTransportConfiguration();
        assertTrue(transportConfiguration instanceof CoapDeviceProfileTransportConfiguration);
        CoapDeviceProfileTransportConfiguration coapDeviceProfileTransportConfiguration = (CoapDeviceProfileTransportConfiguration) transportConfiguration;
        CoapDeviceTypeConfiguration coapDeviceTypeConfiguration = coapDeviceProfileTransportConfiguration.getCoapDeviceTypeConfiguration();
        assertTrue(coapDeviceTypeConfiguration instanceof DefaultCoapDeviceTypeConfiguration);
        DefaultCoapDeviceTypeConfiguration defaultCoapDeviceTypeConfiguration = (DefaultCoapDeviceTypeConfiguration) coapDeviceTypeConfiguration;
        TransportPayloadTypeConfiguration transportPayloadTypeConfiguration = defaultCoapDeviceTypeConfiguration.getTransportPayloadTypeConfiguration();
        assertTrue(transportPayloadTypeConfiguration instanceof ProtoTransportPayloadConfiguration);
        ProtoTransportPayloadConfiguration protoTransportPayloadConfiguration = (ProtoTransportPayloadConfiguration) transportPayloadTypeConfiguration;
        ProtoFileElement transportProtoSchema = protoTransportPayloadConfiguration.getTransportProtoSchema(DEVICE_TELEMETRY_PROTO_SCHEMA);
        DynamicSchema telemetrySchema = protoTransportPayloadConfiguration.getDynamicSchema(transportProtoSchema, "telemetrySchema");

        DynamicMessage.Builder nestedJsonObjectBuilder = telemetrySchema.newMessageBuilder("PostTelemetry.JsonObject.NestedJsonObject");
        Descriptors.Descriptor nestedJsonObjectBuilderDescriptor = nestedJsonObjectBuilder.getDescriptorForType();
        assertNotNull(nestedJsonObjectBuilderDescriptor);
        DynamicMessage nestedJsonObject = nestedJsonObjectBuilder.setField(nestedJsonObjectBuilderDescriptor.findFieldByName("key"), "value").build();

        DynamicMessage.Builder jsonObjectBuilder = telemetrySchema.newMessageBuilder("PostTelemetry.JsonObject");
        Descriptors.Descriptor jsonObjectBuilderDescriptor = jsonObjectBuilder.getDescriptorForType();
        assertNotNull(jsonObjectBuilderDescriptor);
        DynamicMessage jsonObject = jsonObjectBuilder
                .setField(jsonObjectBuilderDescriptor.findFieldByName("someNumber"), 42)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 1)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 2)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 3)
                .setField(jsonObjectBuilderDescriptor.findFieldByName("someNestedObject"), nestedJsonObject)
                .build();

        DynamicMessage.Builder postTelemetryBuilder = telemetrySchema.newMessageBuilder("PostTelemetry");
        Descriptors.Descriptor postTelemetryMsgDescriptor = postTelemetryBuilder.getDescriptorForType();
        assertNotNull(postTelemetryMsgDescriptor);
        DynamicMessage postTelemetryMsg = postTelemetryBuilder
                .setField(postTelemetryMsgDescriptor.findFieldByName("key1"), "value1")
                .setField(postTelemetryMsgDescriptor.findFieldByName("key2"), true)
                .setField(postTelemetryMsgDescriptor.findFieldByName("key3"), 3.0)
                .setField(postTelemetryMsgDescriptor.findFieldByName("key4"), 4)
                .setField(postTelemetryMsgDescriptor.findFieldByName("key5"), jsonObject)
                .build();
        processTestPostTelemetry(postTelemetryMsg.toByteArray(), false);
    }

    @Test
    public void testPushTelemetryWithTs() throws Exception {
        String schemaStr = "syntax =\"proto3\";\n" +
                "\n" +
                "package test;\n" +
                "\n" +
                "message PostTelemetry {\n" +
                "  int64 ts = 1;\n" +
                "  Values values = 2;\n" +
                "  \n" +
                "  message Values {\n" +
                "    string key1 = 3;\n" +
                "    bool key2 = 4;\n" +
                "    double key3 = 5;\n" +
                "    int32 key4 = 6;\n" +
                "    JsonObject key5 = 7;\n" +
                "  }\n" +
                "  \n" +
                "  message JsonObject {\n" +
                "    int32 someNumber = 8;\n" +
                "    repeated int32 someArray = 9;\n" +
                "    NestedJsonObject someNestedObject = 10;\n" +
                "    message NestedJsonObject {\n" +
                "       string key = 11;\n" +
                "    }\n" +
                "  }\n" +
                "}";
        super.processBeforeTest("Test Post Telemetry device proto payload", CoapDeviceType.DEFAULT, TransportPayloadType.PROTOBUF, schemaStr, null, null, null, null, null, DeviceProfileProvisionType.DISABLED);
        DeviceProfileTransportConfiguration transportConfiguration = deviceProfile.getProfileData().getTransportConfiguration();
        assertTrue(transportConfiguration instanceof CoapDeviceProfileTransportConfiguration);
        CoapDeviceProfileTransportConfiguration coapDeviceProfileTransportConfiguration = (CoapDeviceProfileTransportConfiguration) transportConfiguration;
        CoapDeviceTypeConfiguration coapDeviceTypeConfiguration = coapDeviceProfileTransportConfiguration.getCoapDeviceTypeConfiguration();
        assertTrue(coapDeviceTypeConfiguration instanceof DefaultCoapDeviceTypeConfiguration);
        DefaultCoapDeviceTypeConfiguration defaultCoapDeviceTypeConfiguration = (DefaultCoapDeviceTypeConfiguration) coapDeviceTypeConfiguration;
        TransportPayloadTypeConfiguration transportPayloadTypeConfiguration = defaultCoapDeviceTypeConfiguration.getTransportPayloadTypeConfiguration();
        assertTrue(transportPayloadTypeConfiguration instanceof ProtoTransportPayloadConfiguration);
        ProtoTransportPayloadConfiguration protoTransportPayloadConfiguration = (ProtoTransportPayloadConfiguration) transportPayloadTypeConfiguration;
        ProtoFileElement transportProtoSchema = protoTransportPayloadConfiguration.getTransportProtoSchema(schemaStr);
        DynamicSchema telemetrySchema = protoTransportPayloadConfiguration.getDynamicSchema(transportProtoSchema, "telemetrySchema");

        DynamicMessage.Builder nestedJsonObjectBuilder = telemetrySchema.newMessageBuilder("PostTelemetry.JsonObject.NestedJsonObject");
        Descriptors.Descriptor nestedJsonObjectBuilderDescriptor = nestedJsonObjectBuilder.getDescriptorForType();
        assertNotNull(nestedJsonObjectBuilderDescriptor);
        DynamicMessage nestedJsonObject = nestedJsonObjectBuilder.setField(nestedJsonObjectBuilderDescriptor.findFieldByName("key"), "value").build();

        DynamicMessage.Builder jsonObjectBuilder = telemetrySchema.newMessageBuilder("PostTelemetry.JsonObject");
        Descriptors.Descriptor jsonObjectBuilderDescriptor = jsonObjectBuilder.getDescriptorForType();
        assertNotNull(jsonObjectBuilderDescriptor);
        DynamicMessage jsonObject = jsonObjectBuilder
                .setField(jsonObjectBuilderDescriptor.findFieldByName("someNumber"), 42)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 1)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 2)
                .addRepeatedField(jsonObjectBuilderDescriptor.findFieldByName("someArray"), 3)
                .setField(jsonObjectBuilderDescriptor.findFieldByName("someNestedObject"), nestedJsonObject)
                .build();


        DynamicMessage.Builder valuesBuilder = telemetrySchema.newMessageBuilder("PostTelemetry.Values");
        Descriptors.Descriptor valuesDescriptor = valuesBuilder.getDescriptorForType();
        assertNotNull(valuesDescriptor);

        DynamicMessage valuesMsg = valuesBuilder
                .setField(valuesDescriptor.findFieldByName("key1"), "value1")
                .setField(valuesDescriptor.findFieldByName("key2"), true)
                .setField(valuesDescriptor.findFieldByName("key3"), 3.0)
                .setField(valuesDescriptor.findFieldByName("key4"), 4)
                .setField(valuesDescriptor.findFieldByName("key5"), jsonObject)
                .build();

        DynamicMessage.Builder postTelemetryBuilder = telemetrySchema.newMessageBuilder("PostTelemetry");
        Descriptors.Descriptor postTelemetryMsgDescriptor = postTelemetryBuilder.getDescriptorForType();
        assertNotNull(postTelemetryMsgDescriptor);
        DynamicMessage postTelemetryMsg = postTelemetryBuilder
                .setField(postTelemetryMsgDescriptor.findFieldByName("ts"), 10000L)
                .setField(postTelemetryMsgDescriptor.findFieldByName("values"), valuesMsg)
                .build();

        processTestPostTelemetry(postTelemetryMsg.toByteArray(), true);
    }

}
