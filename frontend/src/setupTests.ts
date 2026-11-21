import { TextDecoder, TextEncoder } from 'util'

import '@testing-library/jest-dom'

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextEncoder', {
    value: TextEncoder,
  })
}

if (typeof globalThis.TextDecoder === 'undefined') {
  Object.defineProperty(globalThis, 'TextDecoder', {
    value: TextDecoder,
  })
}
