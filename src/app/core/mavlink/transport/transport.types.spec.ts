import { MavTransport } from './transport.types';

describe('MavTransport contract', () => {
  it('should accept an object that follows the transport shape', () => {
    const candidate = {
      status$: { subscribe: () => ({ unsubscribe() {} }) },
      incomingBytes$: { subscribe: () => ({ unsubscribe() {} }) },
      connect: async () => {},
      disconnect: async () => {},
      write: async (_bytes: Uint8Array) => {}
    } as unknown as MavTransport;

    expect(typeof candidate.connect).toBe('function');
    expect(typeof candidate.disconnect).toBe('function');
    expect(typeof candidate.write).toBe('function');
  });
});
