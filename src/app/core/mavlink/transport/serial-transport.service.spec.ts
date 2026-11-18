import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SerialTransportService } from './serial-transport.service';
import { AppError } from '../../error/app-error';

describe('SerialTransportService', () => {
  let service: SerialTransportService;
  const originalSerialDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serial');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialTransportService);
  });

  afterEach(() => {
    if (originalSerialDescriptor) {
      Object.defineProperty(navigator, 'serial', originalSerialDescriptor);
    } else {
      delete (navigator as any).serial;
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connect() ouvre le port autorisé et passe le statut à connected', async () => {
    const reader = {
      read: vi.fn().mockReturnValue(new Promise(() => {})),
      cancel: vi.fn().mockResolvedValue(undefined),
      releaseLock: vi.fn()
    };

    const writer = {
      write: vi.fn().mockResolvedValue(undefined),
      releaseLock: vi.fn()
    };

    const port = {
      // isUsbPort() lit getInfo() : un port sans lui fait lever connect() (f839be0)
      getInfo: () => ({ usbVendorId: 0x0483 }),
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      readable: { getReader: () => reader },
      writable: { getWriter: () => writer }
    };

    const serialMock = {
      getPorts: vi.fn().mockResolvedValue([port]),
      requestPort: vi.fn()
    };

    Object.defineProperty(navigator, 'serial', {
      value: serialMock,
      configurable: true
    });

    const statuses: string[] = [];
    const sub = service.status$.subscribe(status => statuses.push(status));

    await service.connect(57600);

    expect(serialMock.getPorts).toHaveBeenCalled();
    expect(serialMock.requestPort).not.toHaveBeenCalled();
    expect(port.open).toHaveBeenCalledWith({ baudRate: 57600 });
    expect(statuses).toContain('connecting');
    expect(statuses[statuses.length - 1]).toBe('connected');

    await service.disconnect();
    sub.unsubscribe();
  });

  it('connect() rejette avec AppError si Web Serial est indisponible', async () => {
    delete (navigator as any).serial;

    const statuses: string[] = [];
    const sub = service.status$.subscribe(status => statuses.push(status));

    await expect(service.connect()).rejects.toBeInstanceOf(AppError);
    expect(statuses[statuses.length - 1]).toBe('error');

    sub.unsubscribe();
  });
});
