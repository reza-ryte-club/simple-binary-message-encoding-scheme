import {
    serializeData,
    deSerializeHeaderData,
    deSerializePayloadData
} from '../utils'

// Test serializer 
describe('serializeData', () => {
    it('should serialize data', () => {
        expect(serializeData(['a'], ['B'],
            'C', 10, 2, 1
        ).toString()).toEqual("97,0,66,0,67,0,0,0,0,0")
    })
})

// Test deserializer for the header data 
describe('deSerializeHeaderData', () => {
    it('should deserialize header data', () => {
        const byteStream = new Uint8Array([97, 0, 0, 0, 65, 0, 0, 0])
        const headerPropertyLength = 4 // 4 bytes per header property
        const headerByteSize = 2 * headerPropertyLength // 2 headers * 4 bytes per header
        const expectedHeaderKeys = ['a',  'A']
        for(let i=0; i<headerByteSize; i++) {
            if (byteStream[i]!==0) {
                expect(deSerializeHeaderData(byteStream, 8, 4)[i])
                .toEqual(expectedHeaderKeys[i])
            }
        }
    })
})

// Test deserializer for the payload data
describe('deSerializePayloadData', () => {
    it('should deserialize payload data', () => {
        const byteStream = new Uint8Array(
            [   
                97, 0, 0, 0, 
                65, 0, 0, 0,
                104, 0, 0, 0, 
                101, 0, 0, 0, 
                108, 0, 0, 0, 
                108, 0, 0, 0, 
                111, 0, 0, 0,
            ])
        const headerPropertyLength = 4 // 4 bytes per header property
        const expectedPayload = 'hello'
        const totalPayloadSize = byteStream.length
        expect(deSerializePayloadData(byteStream, headerPropertyLength, totalPayloadSize))
            .toEqual(expectedPayload)
    })
})
