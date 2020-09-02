import Wallet from 'ethereumjs-wallet'
import secp256k1 from 'secp256k1'
import bs58 from 'bs58'
import { sha256 } from 'js-sha256'

export function build ({ keystore, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let myWallet
      try {
        myWallet = Wallet.fromV3(keystore, password, true)
        resolve(myWallet)
      } catch (e) {
        resolve(0)
      }
    }, 0)
  })
}

export function signIn ({ from, to, key, price }) {
  try {
    const value = price * 1000000000
    const timestamp = Math.round(new Date().getTime() / 1000)
    const buffer1 = bs58ToBuffer(from)
    const buffer2 = longToBuffer(1)
    const buffer3 = longToBuffer(value)
    const buffer4 = longToBuffer(timestamp)
    const buffer5 = bs58ToBuffer(to)
    const buffer6 = longToBuffer(value)
    const messageBuffer = Buffer.concat([buffer1, buffer2, buffer3, buffer4, buffer5, buffer6])
    const message = sha256.create().update(messageBuffer)
    const signature = secp256k1.ecdsaSign(arraybufferToUint8Array(message.arrayBuffer()), bufferToUint8Array(Buffer.from(key, 'hex')))
    const sign = Buffer.from(signature.signature).toString('hex')
    return {
      from,
      to,
      value,
      timestamp,
      sign
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

function arraybufferToUint8Array (buf) {
  const view = new Uint8Array(buf)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return view
}

function bufferToUint8Array (buf) {
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return view
}

function longToBuffer (longNum) {
  const array = []
  let result = longNum
  while (result > 0) {
    array.push(result % 256)
    result = Math.floor(result / 256)
  }
  if (array.length < 8) {
    const time = 8 - array.length
    for (let i = 0; i < time; i++) {
      array.push(0)
    }
  }
  return Buffer.from(array)
}

function bs58ToBuffer (bs58str) {
  const array = bs58.decode(bs58str)
  let hex = ''
  for (let i = 0; i < array.length; i++) {
    hex += String.fromCharCode(array[i])
  }
  return Buffer.from(hex, 'hex')
}
