"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var fs = require("fs");
// Sample message object
var messageObj = {
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': '1023',
        'Content-Encoding': 'gzip'
    },
    payload: 'A sample payload'
};
console.log(' Data to be encoded');
console.log('-------------------');
console.log('Message Object Headers:', messageObj.headers);
console.log('Message Object Payload:', messageObj.payload);
console.log('-------------------');
// Encode the message object into binary data
console.log('Encoding the message object into binary data');
var encodedMessage = (0, utils_1.encode)(messageObj);
// Dump the binary data into a file
fs.writeFileSync('output/encodedMessage.bin', encodedMessage);
// Print the content of the binary file into a text file for preview
fs.writeFileSync('output/encodedMessagePreview.txt', encodedMessage.toString());
console.log('Encoded Message:', encodedMessage);
console.log('The encoded binary is stored in output/encodedMessage.bin file');
console.log('Full preview of the encoded bytes are available in the output/encodedMessagePreview.txt file');
console.log('-------------------');
console.log('-------------------');
console.log('-------------------');
console.log('Staring to decode the binary data');
// Decode the binary data into a message object
var decodedMessage = (0, utils_1.decode)(encodedMessage);
// Show decoded message object
console.log('Decoded Message:', decodedMessage);
