import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AppError } from '../../error/app-error';
import { MavlinkCommandService } from '../commands/mavlink-command.service';
import { LinkStatus, TelemetryState } from '../models/telemetry.model';
import { ParameterMetadataService } from '../services/parameter-metadata.service';
import { MavlinkSessionBootstrapService } from '../services/mavlink-session-bootstrap.service';
import { ParameterStore } from '../state/parameter.store';
import { TelemetryStore } from '../state/telemetry.store';
import { VehicleIdentityStore } from '../state/vehicle-identity.store';
import { SerialTransportService } from '../transport/serial-transport.service';
import { DroneLinkFacade } from './drone-link.facade';

describe('DroneLinkFacade', () => {
  let service: DroneLinkFacade;
  let statusSubject: BehaviorSubject<LinkStatus>;

  let transportMock: {
    status$: BehaviorSubject<LinkStatus>;
    connect: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    autoConnectAuthorized: ReturnType<typeof vi.fn>;
  };
  let bootstrapMock: {
    initialize: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };
  let commandsMock: {
    rebootAutopilot: ReturnType<typeof vi.fn>;
  };
  let vehicleIdentityStoreMock: {
    state: ReturnType<typeof signal>;
    targetSystemId: ReturnType<typeof vi.fn>;
    targetComponentId: ReturnType<typeof vi.fn>;
  };

  const telemetryState = signal({} as TelemetryState);
  const parameterState = signal({ byName: new Map<string, { value: number; type: number }>() });
  const metadataState = signal({ byName: new Map<string, unknown>() });

  beforeEach(() => {
    vi.useRealTimers();
    statusSubject = new BehaviorSubject<LinkStatus>('disconnected');

    transportMock = {
      status$: statusSubject,
      connect: vi.fn(async () => {
        statusSubject.next('connecting');
        statusSubject.next('connected');
      }),
      disconnect: vi.fn(async () => {
        statusSubject.next('disconnected');
      }),
      autoConnectAuthorized: vi.fn(async () => {
        statusSubject.next('connecting');
        statusSubject.next('connected');
        return true;
      }),
    };

    bootstrapMock = {
      initialize: vi.fn().mockResolvedValue(undefined),
      reset: vi.fn(),
    };

    commandsMock = {
      rebootAutopilot: vi.fn().mockResolvedValue(undefined),
    };

    vehicleIdentityStoreMock = {
      state: signal({
        targetSystemId: 1,
        targetComponentId: 1,
      }),
      targetSystemId: vi.fn(() => 1),
      targetComponentId: vi.fn(() => 1),
    };

    TestBed.configureTestingModule({
      providers: [
        DroneLinkFacade,
        { provide: SerialTransportService, useValue: transportMock },
        { provide: MavlinkSessionBootstrapService, useValue: bootstrapMock },
        { provide: MavlinkCommandService, useValue: commandsMock },
        {
          provide: TelemetryStore,
          useValue: {
            telemetry: telemetryState,
          },
        },
        {
          provide: VehicleIdentityStore,
          useValue: vehicleIdentityStoreMock,
        },
        {
          provide: ParameterStore,
          useValue: {
            state: parameterState,
            getParameter: vi.fn(),
            markPending: vi.fn(),
          },
        },
        {
          provide: ParameterMetadataService,
          useValue: {
            state: metadataState,
            get: vi.fn(),
            has: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(DroneLinkFacade);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connect() initialise le bootstrap et met la session en etat connected pret', async () => {
    await service.connect(57600);

    expect(transportMock.connect).toHaveBeenCalledWith(57600);
    expect(bootstrapMock.initialize).toHaveBeenCalledTimes(1);
    expect(service.linkStatus()).toBe('connected');
    expect(service.isConnected()).toBe(true);
    expect(service.getLastBaudRate()).toBe(57600);
  });

  it('connect() rollback proprement si initialize() echoue', async () => {
    const bootstrapError = new AppError('errors.bootstrap.no_heartbeat');
    bootstrapMock.initialize.mockRejectedValueOnce(bootstrapError);

    await expect(service.connect(115200)).rejects.toBe(bootstrapError);

    expect(bootstrapMock.reset).toHaveBeenCalledTimes(1);
    expect(transportMock.disconnect).toHaveBeenCalledTimes(1);
    expect(service.isConnected()).toBe(false);
    expect(service.linkStatus()).toBe('disconnected');
  });

  it('connect() force disconnected si transport.connect() echoue', async () => {
    const transportError = new Error('open failed');
    transportMock.connect.mockImplementationOnce(async () => {
      statusSubject.next('connecting');
      throw transportError;
    });

    await expect(service.connect(115200)).rejects.toBe(transportError);

    expect(transportMock.disconnect).toHaveBeenCalledTimes(1);
    expect(bootstrapMock.initialize).not.toHaveBeenCalled();
    expect(service.linkStatus()).toBe('disconnected');
    expect(service.isConnected()).toBe(false);
  });

  it('tryAutoConnect() retourne false si aucun port autorise nest disponible', async () => {
    transportMock.autoConnectAuthorized.mockResolvedValueOnce(false);

    const ok = await service.tryAutoConnect();

    expect(ok).toBe(false);
    expect(bootstrapMock.initialize).not.toHaveBeenCalled();
    expect(service.isConnected()).toBe(false);
  });

  it('tryAutoConnect() rollback et retourne false si le bootstrap echoue', async () => {
    transportMock.autoConnectAuthorized.mockImplementationOnce(async () => {
      statusSubject.next('connecting');
      statusSubject.next('connected');
      return true;
    });
    bootstrapMock.initialize.mockRejectedValueOnce(new AppError('errors.bootstrap.no_heartbeat'));

    const ok = await service.tryAutoConnect();

    expect(ok).toBe(false);
    expect(bootstrapMock.reset).toHaveBeenCalledTimes(1);
    expect(transportMock.disconnect).toHaveBeenCalledTimes(1);
    expect(service.linkStatus()).toBe('disconnected');
    expect(service.isConnected()).toBe(false);
  });

  it('disconnect() reset la session et force le statut disconnected', async () => {
    await service.connect(115200);
    expect(service.isConnected()).toBe(true);

    await service.disconnect();

    expect(bootstrapMock.reset).toHaveBeenCalledTimes(1);
    expect(transportMock.disconnect).toHaveBeenCalledTimes(1);
    expect(service.linkStatus()).toBe('disconnected');
    expect(service.isConnected()).toBe(false);
  });

  it('rebootAutopilotAndReinitialize() deconnecte puis reconnecte avec bootstrap complet', async () => {
    vi.useFakeTimers();
    transportMock.autoConnectAuthorized.mockImplementationOnce(async () => {
      statusSubject.next('connecting');
      statusSubject.next('connected');
      return true;
    });

    const rebootPromise = service.rebootAutopilotAndReinitialize();
    await vi.advanceTimersByTimeAsync(3700);
    await rebootPromise;

    expect(commandsMock.rebootAutopilot).toHaveBeenCalledWith(1, 1);
    expect(bootstrapMock.reset).toHaveBeenCalledTimes(1);
    expect(transportMock.disconnect).toHaveBeenCalledTimes(1);
    expect(transportMock.autoConnectAuthorized).toHaveBeenCalledWith(service.getLastBaudRate());
    expect(bootstrapMock.initialize).toHaveBeenCalledTimes(1);
    expect(service.linkStatus()).toBe('connected');
    expect(service.isConnected()).toBe(true);
  });
});
