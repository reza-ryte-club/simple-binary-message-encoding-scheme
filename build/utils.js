"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = exports.deSerializePayloadData = exports.deSerializeHeaderData = exports.serializeData = exports.add = void 0;
var constants_1 = require("./constants");
var add = function (x, y) {
    return x + y;
};
exports.add = add;
var serializeData = function (keys, values, payload, byteSize, allowedNumberOfHeaders, numberOfBytesPerHeaderProperty) {
    var buffer = new ArrayBuffer(byteSize); // make a buffer
    var view = new Uint8Array(buffer); // Declare variable to store header
    // Now we have our byte area allocated 
    // It is time to assign the values to the allocated memory
    var headerByteSize = allowedNumberOfHeaders * numberOfBytesPerHeaderProperty; // 64449
    for (var i = 0; i < byteSize; i++) {
        // view[i] = str.charCodeAt(i)
        // Store the keys 
        if (i == 0 && i < headerByteSize) {
            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                for (var j = 0; j < numberOfBytesPerHeaderProperty; j++) {
                    view[i] = keys[keyIndex].charCodeAt(j);
                    i = i + 1;
                }
            }
        }
        // Store the values
        else if (i == headerByteSize && i < headerByteSize * 2) {
            for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
                for (var j = 0; j < numberOfBytesPerHeaderProperty; j++) {
                    view[i] = values[valueIndex].charCodeAt(j);
                    i = i + 1;
                }
            }
        }
        // Store the payload
        else if (i == headerByteSize * 2 && i < byteSize) {
            for (var payloadIndex = 0; payloadIndex < payload.length; payloadIndex++) {
                view[i] = payload.charCodeAt(payloadIndex);
                i = i + 1;
            }
        }
    }
    return view;
};
exports.serializeData = serializeData;
var deSerializeHeaderData = function (data, byteSize, numberOfBytesPerHeaderProperty) {
    var deSerializedStrings = [];
    var tempHeaderKeys;
    for (var k = 0; k < byteSize;) {
        tempHeaderKeys = '';
        for (var m = 0; m < numberOfBytesPerHeaderProperty; m++, k++) {
            if (data[k] !== 0) {
                tempHeaderKeys += String.fromCharCode(data[k]);
            }
        }
        if (tempHeaderKeys.length > 0) {
            deSerializedStrings.push(tempHeaderKeys);
        }
    }
    return deSerializedStrings;
};
exports.deSerializeHeaderData = deSerializeHeaderData;
var deSerializePayloadData = function (data, byteSize, packetSizeUpperLimit) {
    var updatedPayload = '';
    for (var q = byteSize * 2; q < packetSizeUpperLimit; q++) {
        if (data[q] !== 0) {
            updatedPayload += String.fromCharCode(data[q]);
        }
    }
    return updatedPayload;
};
exports.deSerializePayloadData = deSerializePayloadData;
// encode
var encode = function (message) {
    // Make sure there are less than 64 headers
    if (Object.keys(message.headers).length > constants_1.HIGHEST_NUMBER_OF_HEADER) {
        throw new Error('There are more than 63 headers');
    }
    // Convert headers to 1023 byte data
    var headerKeys = Object.keys(message.headers);
    var headerValues = Object.keys(message.headers).map(function (key) { return message.headers[key]; });
    var encodedData = (0, exports.serializeData)(headerKeys, headerValues, message.payload, constants_1.TOTAL_BYTE_PACKET_SIZE, constants_1.HIGHEST_NUMBER_OF_HEADER, constants_1.HEADER_PROPERTY_LENGTH);
    return encodedData;
};
exports.encode = encode;
// decode
var decode = function (data) {
    var decodedMessage = {
        headers: {},
        payload: ''
    };
    var headerByteSize = constants_1.HIGHEST_NUMBER_OF_HEADER * constants_1.HEADER_PROPERTY_LENGTH;
    var headerKeys = data.slice(0, headerByteSize);
    var headerValues = data.slice(headerByteSize, headerByteSize * 2);
    // serialize header keys
    var headerKeysDeSerialized = (0, exports.deSerializeHeaderData)(headerKeys, headerByteSize, constants_1.HEADER_PROPERTY_LENGTH);
    var headerValuesDeSerialized = (0, exports.deSerializeHeaderData)(headerValues, headerByteSize, constants_1.HEADER_PROPERTY_LENGTH);
    var payloadDeSerialized = (0, exports.deSerializePayloadData)(data, headerByteSize, constants_1.TOTAL_BYTE_PACKET_SIZE);
    // Construct the message object
    for (var i = 0; i < headerKeysDeSerialized.length; i++) {
        decodedMessage.headers[headerKeysDeSerialized[i]] = headerValuesDeSerialized[i];
    }
    decodedMessage.payload = payloadDeSerialized;
    return decodedMessage;
};
exports.decode = decode;
