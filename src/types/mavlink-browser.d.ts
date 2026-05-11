
//Module declaration for mavlink-browser, which does not have its own types

declare module 'mavlink-browser' {
  export const mavlink20: any;
  export class MAVLink20Processor {
    constructor(logger: any, srcSystem?: number, srcComponent?: number);
    on(event: string, cb: (msg: any) => void): void;
    parseBuffer(buffer: Uint8Array): void;
  }
  export const Buffer: {
    new (data: number[] | Uint8Array): Uint8Array;
  };
}