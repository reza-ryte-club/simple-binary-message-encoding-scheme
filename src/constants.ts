export interface Message {
    /*
    * Header names and values are limited to 1023 bytes (independently).
    */
    headers: { [key: string]: string }, // key and value can store 1023 bytes
    payload: string // In final iteration, this will be binary
}


export const HEADER_PROPERTY_LENGTH = 1023 // 1023 bytes
export const PAYLOAD_SIZE = 256 * 1024 // 256 KB
export const HIGHEST_NUMBER_OF_HEADER = 63
export const TOTAL_BYTE_PACKET_SIZE =
    (HEADER_PROPERTY_LENGTH * HIGHEST_NUMBER_OF_HEADER * 2) 
        + PAYLOAD_SIZE // 391042 bytes = 391 KB
