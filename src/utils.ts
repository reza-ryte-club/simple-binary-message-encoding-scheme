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
        deSerializedStrings.push(tempHeaderKeys)
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

