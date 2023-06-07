import {
    Message,
    HIGHEST_NUMBER_OF_HEADER,
    TOTAL_BYTE_PACKET_SIZE,
    HEADER_PROPERTY_LENGTH
} from "./constants"


export const add = (x: number, y: number): number => {
    return x + y
}

export const serializeData = (
    keys: string[],
    values: string[],
    payload: string,
    byteSize: number,
    allowedNumberOfHeaders: number,
    numberOfBytesPerHeaderProperty: number
): Uint8Array => {
    let buffer = new ArrayBuffer(byteSize) // make a buffer
    let view = new Uint8Array(buffer) // Declare variable to store header
    // Now we have our byte area allocated 
    // It is time to assign the values to the allocated memory

    const headerByteSize = allowedNumberOfHeaders * numberOfBytesPerHeaderProperty // 64449
    for (let i = 0; i < byteSize; i++) {
        // view[i] = str.charCodeAt(i)
        // Store the keys 
        if (i == 0 && i < headerByteSize) {
            for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                for (let j = 0; j < numberOfBytesPerHeaderProperty; j++) {
                    view[i] = keys[keyIndex].charCodeAt(j)
                    i = i + 1
                }
            }
        }
        // Store the values
        else if (i == headerByteSize && i < headerByteSize * 2) {
            for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
                for (let j = 0; j < numberOfBytesPerHeaderProperty; j++) {
                    view[i] = values[valueIndex].charCodeAt(j)
                    i = i + 1
                }
            }
        }
        // Store the payload
        else if (i == headerByteSize * 2 && i < byteSize) {
            for (let payloadIndex = 0; payloadIndex < payload.length; payloadIndex++) {
                view[i] = payload.charCodeAt(payloadIndex)
                i = i + 1
            }
        }
    }
    return view
}

export const deSerializeHeaderData = (
    data: Uint8Array,
    byteSize: number,
    numberOfBytesPerHeaderProperty: number
): string[] => {
    const deSerializedStrings: string[] = []
    let tempHeaderKeys: string
    for (let k = 0; k < byteSize;) {
        tempHeaderKeys = ''
        for (let m = 0; m < numberOfBytesPerHeaderProperty; m++, k++) {
            if (data[k] !== 0) {
                tempHeaderKeys += String.fromCharCode(data[k])
            }
        }
        if (tempHeaderKeys.length > 0) { deSerializedStrings.push(tempHeaderKeys) }
    }
    return deSerializedStrings
}

export const deSerializePayloadData = (
    data: Uint8Array,
    byteSize: number,
    packetSizeUpperLimit: number
): string => {
    let updatedPayload: string = ''
    for (let q = byteSize * 2; q < packetSizeUpperLimit; q++) {
        if (data[q] !== 0) {
            updatedPayload += String.fromCharCode(data[q])
        }
    }
    return updatedPayload
}

// encode
export const encode = (message: Message): Uint8Array => { // should return bytes, here it returns string
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
        TOTAL_BYTE_PACKET_SIZE,
        HIGHEST_NUMBER_OF_HEADER,
        HEADER_PROPERTY_LENGTH
    )
    return encodedData
}



// decode
export const decode = (data: Uint8Array): Message => { // should return Message object
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
    for (let i = 0; i < headerKeysDeSerialized.length; i++) {
        decodedMessage.headers[headerKeysDeSerialized[i]] = headerValuesDeSerialized[i]
    }
    decodedMessage.payload = payloadDeSerialized
    return decodedMessage
}
