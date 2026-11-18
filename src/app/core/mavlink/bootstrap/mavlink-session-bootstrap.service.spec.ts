import { TestBed } from '@angular/core/testing';
import { NEVER, ReplaySubject } from 'rxjs';
import { vi } from 'vitest';

import { AppError } from '../../error/app-error';
import { MavlinkCommandService } from '../commands/mavlink-command.service';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';
import { ParameterStore } from '../state/parameter.store';
import { VehicleIdentityStore } from '../state/vehicle-identity.store';
import { UiErrorService } from '../../error/ui-error.service';
import { ParameterMetadataService } from '../../parameter/metadata/parameter-metadata.service';
import { MavlinkSessionBootstrapService } from './mavlink-session-bootstrap.service';

describe('MavlinkSessionBootstrapService', () => {
  let service: MavlinkSessionBootstrapService;
  let heartbeat$: ReplaySubject<unknown>;
  let autopilotVersion$: ReplaySubject<unknown>;

  let parserMock: {
    sendMavlink2PrimingHeartbeat: ReturnType<typeof vi.fn>;
    onType$: ReturnType<typeof vi.fn>;
  };
  let commandsMock: {
    requestMessageInterval: ReturnType<typeof vi.fn>;
    requestAutopilotVersion: ReturnType<typeof vi.fn>;
    requestAllParameters: ReturnType<typeof vi.fn>;
  };
  let vehicleIdentityStoreMock: {
    state: ReturnType<typeof vi.fn>;
    targetSystemId: ReturnType<typeof vi.fn>;
    targetComponentId: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
  };
  let parameterStoreMock: {
    reset: ReturnType<typeof vi.fn>;
    startSync: ReturnType<typeof vi.fn>;
  };
  let parameterMetadataServiceMock: {
    reset: ReturnType<typeof vi.fn>;
    loadForVehicle: ReturnType<typeof vi.fn>;
  };
  let uiErrorMock: {
    show: ReturnType<typeof vi.fn>;
  };

  let identityState: {
    discovered: boolean;
    version: { major: number | null; minor: number | null; text: string };
    firmwareFamily: 'arducopter' | 'arduplane' | 'ardurover' | 'ardusub' | 'unknown';
    targetSystemId: number | null;
    targetComponentId: number | null;
  };

  beforeEach(() => {
    vi.useRealTimers();

    heartbeat$ = new ReplaySubject<unknown>(1);
    autopilotVersion$ = new ReplaySubject<unknown>(1);

    identityState = {
      discovered: false,
      version: { major: null, minor: null, text: 'unknown' },
      firmwareFamily: 'arducopter',
      targetSystemId: 1,
      targetComponentId: 1,
    };

    parserMock = {
      sendMavlink2PrimingHeartbeat: vi.fn().mockResolvedValue(undefined),
      onType$: vi.fn((name: string) => {
        if (name === 'HEARTBEAT') {
          return heartbeat$.asObservable();
        }

        if (name === 'AUTOPILOT_VERSION') {
          return autopilotVersion$.asObservable();
        }

        return NEVER;
      }),
    };

    commandsMock = {
      requestMessageInterval: vi.fn().mockResolvedValue(undefined),
      requestAutopilotVersion: vi.fn().mockResolvedValue(undefined),
      requestAllParameters: vi.fn().mockResolvedValue(undefined),
    };

    vehicleIdentityStoreMock = {
      state: vi.fn(() => identityState),
      targetSystemId: vi.fn(() => identityState.targetSystemId),
      targetComponentId: vi.fn(() => identityState.targetComponentId),
      reset: vi.fn(),
    };

    parameterStoreMock = {
      reset: vi.fn(),
      startSync: vi.fn(),
    };

    parameterMetadataServiceMock = {
      reset: vi.fn(),
      loadForVehicle: vi.fn().mockResolvedValue(undefined),
    };

    uiErrorMock = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        MavlinkSessionBootstrapService,
        { provide: MavlinkParserService, useValue: parserMock },
        { provide: MavlinkCommandService, useValue: commandsMock },
        { provide: VehicleIdentityStore, useValue: vehicleIdentityStoreMock },
        { provide: ParameterStore, useValue: parameterStoreMock },
        { provide: ParameterMetadataService, useValue: parameterMetadataServiceMock },
        { provide: UiErrorService, useValue: uiErrorMock },
      ],
    });

    service = TestBed.inject(MavlinkSessionBootstrapService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initialize() execute la sequence complete nominale jusqua la synchro parametres', async () => {
    // Arrange : on pré-émet les deux messages MAVLink attendus dans la séquence
    // afin que les appels race() internes se résolvent immédiatement sans timeout.
    heartbeat$.next({});        // simule la réception d'un HEARTBEAT de l'autopilote
    autopilotVersion$.next({}); // simule la réception d'un AUTOPILOT_VERSION

    // Act : déclenche la séquence de bootstrap complète
    await service.initialize();

    // --- Phase 1 : Reset des stores avant toute communication ---
    // Vérifie que l'état précédent est nettoyé avant d'initier une nouvelle session.
    expect(vehicleIdentityStoreMock.reset).toHaveBeenCalledTimes(1);
    expect(parameterStoreMock.reset).toHaveBeenCalledTimes(1);
    expect(parameterMetadataServiceMock.reset).toHaveBeenCalledTimes(1);

    // --- Phase 2 : Heartbeat initial MAVLink2 ---
    // Vérifie que la trame de forçage MAVLink2 est envoyée une seule fois
    // pour basculer l'autopilote en protocole MAVLink2 dès l'ouverture de session.
    expect(parserMock.sendMavlink2PrimingHeartbeat).toHaveBeenCalledTimes(1);

    // --- Phase 3 : Configuration des flux télémétriques ---
    // Vérifie que les 4 requêtes MAV_CMD_SET_MESSAGE_INTERVAL sont envoyées
    // dans l'ordre exact, avec les identifiants et intervalles attendus :
    //   msg 1  = SYS_STATUS    → toutes les 500 ms (500 000 µs)
    //   msg 24 = GPS_RAW_INT   → toutes les 200 ms (200 000 µs)
    //   msg 30 = ATTITUDE      → toutes les 100 ms (100 000 µs)
    //   msg 65 = RC_CHANNELS   → toutes les 100 ms (100 000 µs)
    expect(commandsMock.requestMessageInterval).toHaveBeenCalledTimes(4);
    expect(commandsMock.requestMessageInterval).toHaveBeenNthCalledWith(1, 1, 1, 1,  500000);
    expect(commandsMock.requestMessageInterval).toHaveBeenNthCalledWith(2, 1, 1, 24, 200000);
    expect(commandsMock.requestMessageInterval).toHaveBeenNthCalledWith(3, 1, 1, 30, 100000);
    expect(commandsMock.requestMessageInterval).toHaveBeenNthCalledWith(4, 1, 1, 65, 100000);

    // --- Phase 4 : Récupération de la version autopilote ---
    // Vérifie que la requête AUTOPILOT_VERSION est envoyée à la cible (system=1, component=1)
    // et que les métadonnées sont chargées avec l'état d'identité courant du véhicule.
    expect(commandsMock.requestAutopilotVersion).toHaveBeenCalledWith(1, 1);
    expect(parameterMetadataServiceMock.loadForVehicle).toHaveBeenCalledWith(identityState);

    // --- Phase 5 : Démarrage de la synchronisation des paramètres ---
    // Vérifie que le store est mis en mode sync avant d'envoyer la requête globale,
    // et que requestAllParameters cible bien le bon system/component.
    expect(parameterStoreMock.startSync).toHaveBeenCalledTimes(1);
    expect(commandsMock.requestAllParameters).toHaveBeenCalledWith(1, 1);

    // --- Vérification de la détection de cible ---
    // Vérifie que le service a bien consulté les IDs cibles (system et component)
    // et abonné aux deux flux MAVLink critiques du bootstrap.
    expect(vehicleIdentityStoreMock.targetSystemId).toHaveBeenCalled();
    expect(vehicleIdentityStoreMock.targetComponentId).toHaveBeenCalled();
    expect(parserMock.onType$).toHaveBeenCalledWith('HEARTBEAT');
    expect(parserMock.onType$).toHaveBeenCalledWith('AUTOPILOT_VERSION');

    // --- Vérification de l'ordre strict des étapes ---
    // Garantit que la séquence respecte le pipeline MAVLink attendu :
    // heartbeat MAVLink2 → flux télémétriques → version → metadata → startSync → paramètres
    expect(parserMock.sendMavlink2PrimingHeartbeat.mock.invocationCallOrder[0])
      .toBeLessThan(commandsMock.requestMessageInterval.mock.invocationCallOrder[0]);
    expect(commandsMock.requestMessageInterval.mock.invocationCallOrder[0])
      .toBeLessThan(commandsMock.requestAutopilotVersion.mock.invocationCallOrder[0]);
    expect(commandsMock.requestAutopilotVersion.mock.invocationCallOrder[0])
      .toBeLessThan(parameterMetadataServiceMock.loadForVehicle.mock.invocationCallOrder[0]);
    expect(parameterMetadataServiceMock.loadForVehicle.mock.invocationCallOrder[0])
      .toBeLessThan(parameterStoreMock.startSync.mock.invocationCallOrder[0]);
    expect(parameterStoreMock.startSync.mock.invocationCallOrder[0])
      .toBeLessThan(commandsMock.requestAllParameters.mock.invocationCallOrder[0]);

    // Aucune erreur UI ne doit être remontée dans le cas nominal
    expect(uiErrorMock.show).not.toHaveBeenCalled();
  });

  it('initialize() saute lattente heartbeat si la cible est deja detectee', async () => {
    identityState.discovered = true;
    identityState.version = { major: 4, minor: 5, text: '4.5' };

    await service.initialize();

    expect(parserMock.onType$).not.toHaveBeenCalledWith('HEARTBEAT');
    expect(commandsMock.requestMessageInterval).toHaveBeenCalledTimes(4);
    expect(commandsMock.requestAutopilotVersion).toHaveBeenCalledWith(1, 1);
    expect(parameterStoreMock.startSync).toHaveBeenCalledTimes(1);
    expect(commandsMock.requestAllParameters).toHaveBeenCalledWith(1, 1);
  });

  it('initialize() rejette avec AppError no_heartbeat quand aucun heartbeat ne survient avant timeout', async () => {
    vi.useFakeTimers();

    const rejectionExpectation = expect(service.initialize()).rejects.toMatchObject({
      name: 'AppError',
      key: 'errors.bootstrap.no_heartbeat',
    });

    await vi.advanceTimersByTimeAsync(5000);
    await rejectionExpectation;

    expect(commandsMock.requestMessageInterval).not.toHaveBeenCalled();
    expect(parameterStoreMock.startSync).not.toHaveBeenCalled();
  });

  it('initialize() bloque la synchro et rejette unknown_target quand la cible nest pas detectee', async () => {
    identityState.discovered = true;
    identityState.version = { major: 4, minor: 5, text: '4.5' };
    identityState.targetSystemId = null;
    identityState.targetComponentId = null;

    await expect(service.initialize()).rejects.toMatchObject({
      name: 'AppError',
      key: 'errors.bootstrap.unknown_target',
    });

    expect(commandsMock.requestMessageInterval).not.toHaveBeenCalled();
    expect(commandsMock.requestAutopilotVersion).not.toHaveBeenCalled();
    expect(parameterStoreMock.startSync).not.toHaveBeenCalled();
    expect(commandsMock.requestAllParameters).not.toHaveBeenCalled();
  });

  it('initialize() reste non bloquant si le chargement metadata echoue et remonte lerreur UI', async () => {
    identityState.discovered = true;
    identityState.version = { major: 4, minor: 5, text: '4.5' };

    const metadataError = new AppError('errors.metadata.version_unavailable');
    parameterMetadataServiceMock.loadForVehicle.mockRejectedValueOnce(metadataError);

    await service.initialize();

    expect(uiErrorMock.show).toHaveBeenCalledWith(metadataError, 'errors.titles.generic');
    expect(parameterStoreMock.startSync).toHaveBeenCalledTimes(1);
    expect(commandsMock.requestAllParameters).toHaveBeenCalledWith(1, 1);
  });

  it('initialize() continue la synchro si AUTOPILOT_VERSION ne repond pas avant timeout', async () => {
    vi.useFakeTimers();
    identityState.discovered = true;

    const initializePromise = service.initialize();
    await vi.advanceTimersByTimeAsync(2000);
    await initializePromise;

    expect(commandsMock.requestAutopilotVersion).toHaveBeenCalledWith(1, 1);
    expect(parameterMetadataServiceMock.loadForVehicle).toHaveBeenCalledWith(identityState);
    expect(parameterStoreMock.startSync).toHaveBeenCalledTimes(1);
    expect(commandsMock.requestAllParameters).toHaveBeenCalledWith(1, 1);
  });
});
