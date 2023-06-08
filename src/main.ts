import * as fs from 'fs'
import {
    Message,
    HIGHEST_NUMBER_OF_HEADER, // 63
    TOTAL_BYTE_PACKET_SIZE, // 391042 bytes = 391 KB
    HEADER_PROPERTY_LENGTH // 1023 bytes
} from "./constants"
import {
    serializeData,
    deSerializeHeaderData,
    deSerializePayloadData
} from './utils'

// Sample message object
const messageObj: Message = {
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': '1024',
        'Content-Encoding': 'binary'
    },
    payload: 'This is a sample payload'
}


// encode
const encode = (message: Message): Uint8Array => { // return bytes
    // Make sure there are less than 64 headers
    if (Object.keys(message.headers).length > HIGHEST_NUMBER_OF_HEADER) {
        throw new Error('There are more than 63 headers')
    }
    // Convert headers to 1023 byte data
    const headerKeys = Object.keys(message.headers)
    const headerValues = Object.keys(message.headers).map(key => message.headers[key])
    const encodedData = serializeData(
        headerKeys,
        headerValues,
        message.payload,
        TOTAL_BYTE_PACKET_SIZE, // 391042 bytes = 391 KB
        HIGHEST_NUMBER_OF_HEADER, // 63
        HEADER_PROPERTY_LENGTH  // 1023 bytes
    )
    return encodedData
}



// decode
const decode = (data: Uint8Array): Message => { // should return Message object
    const decodedMessage: Message = {
        headers: {},
        payload: ''
    }

    const headerByteSize = HIGHEST_NUMBER_OF_HEADER * HEADER_PROPERTY_LENGTH
    const headerKeys = data.slice(0, headerByteSize)
    const headerValues = data.slice(headerByteSize, headerByteSize * 2)

    // serialize header keys
    const headerKeysDeSerialized = deSerializeHeaderData(headerKeys, headerByteSize, HEADER_PROPERTY_LENGTH)
    const headerValuesDeSerialized = deSerializeHeaderData(headerValues, headerByteSize, HEADER_PROPERTY_LENGTH)
    const payloadDeSerialized = deSerializePayloadData(data, headerByteSize, TOTAL_BYTE_PACKET_SIZE)
    // Construct the message object
    for (let i = 0; i < headerKeysDeSerialized.length && headerKeysDeSerialized[i].length!==0; i++) {
        decodedMessage.headers[headerKeysDeSerialized[i]] = headerValuesDeSerialized[i]
    }
    decodedMessage.payload = payloadDeSerialized
    return decodedMessage
}


console.log(' Data to be encoded')
console.log('-------------------')
console.log('Message Object Headers:', messageObj.headers)
console.log('Message Object Payload:', messageObj.payload)
console.log('-------------------')
// Encode the message object into binary data
console.log('Encoding the message object into binary data')
const encodedMessage: Uint8Array = encode(messageObj)
// Dump the binary data into a file
fs.writeFileSync('output/encodedMessage.bin', encodedMessage)

// Print the content of the binary file into a text file for preview
fs.writeFileSync('output/encodedMessagePreview.txt', encodedMessage.toString())
console.log('Encoded Message:', encodedMessage)
console.log('The encoded binary is stored in output/encodedMessage.bin file')
console.log('Full preview of the encoded bytes are available in the output/encodedMessagePreview.txt file')
console.log('-------------------')
console.log('-------------------')
console.log('-------------------')
console.log('Staring to decode the binary data')
// Decode the binary data into a message object
const decodedMessage: Message = decode(encodedMessage)
// Show decoded message object
console.log('Decoded Message:', decodedMessage)
