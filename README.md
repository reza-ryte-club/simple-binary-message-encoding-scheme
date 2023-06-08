# Simple Binary Message Encoding Scheme

This project is an implementation of a simple binary message encoding scheme to be used in a signaling protocol. It will be used primarily for passing messages between peers in a real-time communication application.

The solution has the following attributes:


* A message can contain a variable number of headers, and a binary payload.
* The headers are name-value pairs, where both names and values are ASCII-encoded strings. Header names and values are limited to 1023 bytes (independently).
* A message can have max 63 headers.
* The message payload is limited to 256 KiB.

## Before running the project 
As an input for the program, the sample Message object was used.

```
const messageObj: Message = {
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': '1024'
    },
    payload: 'This is a sample payload'
}
```
It is possible to use any number of headers key-value pair up to 63 entries.
Type of the message object (TypeScript Interface) is stored in the constants.ts file. 
As there is only on TypeScript interface is used to write this program I did not create an individual d.ts file. But I highly advise it.
The main program encoded this messsage object which calls the serializer from the utils module, which has necessary serializer and desializer codes.
The serializer and deserializers are independent of predefined constants. So, it is possible to create stream of bytes by passing the byte limits as a parameter.
That is why it was wasier to write test code using different byte length and payload data than the actual program.


## How to run the source code

```sh
yarn install
yarn start
```

## How to run the unit tests

```sh
yarn test
```


## Check the test coverage

```sh
yarn test:coverage
```

## Explanation of the code structure
The code is written in TypeScript and the source code can be found in src directory. 
All unit tests are written in TypeScript using Jest. The unit tests are stored in the __tests__ directory inside of the src file.

After building the file using 'tsc' command, or you can use 'yarn start' command to build and run, the transpiled JavaScript files are stored in the build directory.
After running the code, a binary dump of the serialized data is stored in the output directory, at the same time a text version of a preview of the binary file is also 
generated for the sake of better understanding what is actually happening in the binary level.



