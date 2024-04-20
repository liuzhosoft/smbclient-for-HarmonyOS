import { Buffer } from '../buffer/index';

// convert windows timeStamp to unix timeStamp in milliseconds
export function windowsTime2Unix(windowsTimeStamp: bigint) {
  let windows2unixEpoch = BigInt(0x19DB1DED53E8000);
  let nano100toNano = BigInt(100);
  let nano2milli = BigInt(1000000);
  return parseInt((((windowsTimeStamp - windows2unixEpoch) * nano100toNano) / nano2milli).toString());
}

export function readWindowsTime(buffer: Buffer, offset: number): bigint {
  let lowOrder = buffer.readUInt32LE(offset);
  let highOrder = buffer.readUInt32LE(offset + 4);
  return (BigInt(highOrder) << BigInt(32)) | BigInt(lowOrder);
}

export function readWindowsTime2Unix(buffer: Buffer, offset: number) {
  let time = readWindowsTime(buffer, offset)
  return windowsTime2Unix(time)
}