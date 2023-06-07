"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTAL_BYTE_PACKET_SIZE = exports.HIGHEST_NUMBER_OF_HEADER = exports.PAYLOAD_SIZE = exports.HEADER_PROPERTY_LENGTH = void 0;
exports.HEADER_PROPERTY_LENGTH = 1023; // 1023 bytes
exports.PAYLOAD_SIZE = 256 * 1024; // 256 KB
exports.HIGHEST_NUMBER_OF_HEADER = 63;
exports.TOTAL_BYTE_PACKET_SIZE = (exports.HEADER_PROPERTY_LENGTH * exports.HIGHEST_NUMBER_OF_HEADER * 2)
    + exports.PAYLOAD_SIZE; // 391042 bytes = 391 KB
