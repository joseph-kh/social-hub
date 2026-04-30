import 'react-native-url-polyfill/auto'

import { ReadableStream } from 'web-streams-polyfill'

import * as Crypto from 'expo-crypto'

import '@ethersproject/shims'
Object.defineProperty(globalThis, 'ReadableStream', {
  value: ReadableStream,
  writable: true,
  configurable: true,
})

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: {},
    writable: true,
    configurable: true,
  })
}
if (!globalThis.crypto.getRandomValues) {
  Object.defineProperty(globalThis.crypto, 'getRandomValues', {
    value: Crypto.getRandomValues,
    writable: true,
    configurable: true,
  })
}

Object.defineProperty(globalThis, 'getRandomValues', {
  value: Crypto.getRandomValues,
  writable: true,
  configurable: true,
})
