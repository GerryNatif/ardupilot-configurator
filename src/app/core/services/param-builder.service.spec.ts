import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DroneLinkFacade } from '../mavlink/facade/drone-link.facade';
import { INITIAL_PARAMETER_METADATA_STATE } from '../mavlink/models/parameter-metadata.model';
import { INITIAL_PARAMETER_STATE } from '../mavlink/models/parameter.model';
import { ParamBuilderService } from './param-builder.service';

describe('ParamBuilderService', () => {
  const parameterState = signal({
    ...INITIAL_PARAMETER_STATE,
    byName: new Map([
      [
        'BATT_CAPACITY',
        {
          name: 'BATT_CAPACITY',
          value: 1499,
          type: 9,
          index: 0,
          count: 1,
          updatedAtMs: 0,
          pending: false,
        },
      ],
      [
        'BATT_MONITOR',
        {
          name: 'BATT_MONITOR',
          value: 4,
          type: 9,
          index: 1,
          count: 1,
          updatedAtMs: 0,
          pending: false,
        },
      ],
    ]),
  });

  const parameterMetadataState = signal({
    ...INITIAL_PARAMETER_METADATA_STATE,
    loaded: true,
    byName: new Map([
      [
        'BATT_CAPACITY',
        {
          name: 'BATT_CAPACITY',
          displayName: 'Capacite batterie',
          description: 'Capacite en mAh.',
          min: 0,
          max: 10000,
          increment: 10,
          units: 'mAh',
          user: 'Standard',
          readOnly: false,
          rebootRequired: false,
          values: new Map(),
          bitmask: new Map(),
        },
      ],
      [
        'BATT_MONITOR',
        {
          name: 'BATT_MONITOR',
          displayName: 'Moniteur batterie',
          description: 'Source de mesure batterie.',
          min: 0,
          max: 20,
          increment: 1,
          units: null,
          user: 'Standard',
          readOnly: false,
          rebootRequired: true,
          values: new Map([
            [0, 'Disabled'],
            [4, 'Analog Voltage and Current'],
          ]),
          bitmask: new Map(),
        },
      ],
      [
        'BATT_OPTIONS',
        {
          name: 'BATT_OPTIONS',
          displayName: 'Options batterie',
          description: 'Activation de fonctionnalites batterie par bits.',
          min: 0,
          max: 255,
          increment: 1,
          units: null,
          user: 'Advanced',
          readOnly: false,
          rebootRequired: false,
          values: new Map(),
          bitmask: new Map([
            [0, 'Autoriser la calibration dynamique'],
            [2, 'Activer la compensation de courant'],
          ]),
        },
      ],
    ]),
  });

  let service: ParamBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DroneLinkFacade,
          useValue: {
            parameterState,
            parameterMetadataState,
            getRoundedParameterValue: (name: string) => {
              const entry = parameterState().byName.get(name);
              return entry?.value ?? null;
            },
            getParameterMetadata: (name: string) => parameterMetadataState().byName.get(name),
          },
        },
      ],
    });

    service = TestBed.inject(ParamBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('builds rows from parameter names and metadata', () => {
    const section = service.buildSection({
      id: 'battery',
      title: 'Batterie',
      parameterNames: ['BATT_MONITOR', 'BATT_CAPACITY', 'BATT_LOW_VOLT'],
    });

    expect(section.rows.length).toBe(3);
    expect(section.rows[0].name).toBe('BATT_MONITOR');
    expect(section.rows[0].type).toBe('select');
    expect(section.rows[0].value).toBe(4);
    expect(section.rows[0].title).toBe('Moniteur batterie');

    expect(section.rows[1].name).toBe('BATT_CAPACITY');
    expect(section.rows[1].type).toBe('number');
    expect(section.rows[1].value).toBe(1499);
    expect(section.rows[1].step).toBe(10);

    expect(section.rows[2].name).toBe('BATT_LOW_VOLT');
    expect(section.rows[2].disabled).toBe(true);
  });

  it('normalizes values before write', () => {
    expect(service.normalizeValueForWrite('BATT_CAPACITY', 1506)).toBe(1510);
    expect(service.normalizeValueForWrite('BATT_MONITOR', '4')).toBe(4);
    expect(service.normalizeValueForWrite('BATT_MONITOR', true)).toBe(1);
  });

  it('builds a bitmask section with one row per bit value', () => {
    parameterState.update((state) => ({
      ...state,
      byName: new Map(state.byName).set('BATT_OPTIONS', {
        name: 'BATT_OPTIONS',
        value: 1,
        type: 9,
        index: 2,
        count: 1,
        updatedAtMs: 0,
        pending: false,
      }),
    }));

    const section = service.buildBitmaskSection({
      id: 'battery-options',
      title: 'Options batterie',
      parameterNames: ['BATT_OPTIONS'],
    });

    expect(section.rows.length).toBe(2);

    expect(section.rows[0].name).toBe('BATT_OPTIONS::bit::0');
    expect(section.rows[0].type).toBe('checkbox');
    expect(section.rows[0].value).toBe(true);
    expect(section.rows[0].title).toBe('Autoriser la calibration dynamique');

    expect(section.rows[1].name).toBe('BATT_OPTIONS::bit::2');
    expect(section.rows[1].type).toBe('checkbox');
    expect(section.rows[1].value).toBe(false);
    expect(section.rows[1].title).toBe('Activer la compensation de courant');
  });

  it('resolves bitmask row writes to the base parameter name and value', () => {
    parameterState.update((state) => ({
      ...state,
      byName: new Map(state.byName).set('BATT_OPTIONS', {
        name: 'BATT_OPTIONS',
        value: 1,
        type: 9,
        index: 2,
        count: 1,
        updatedAtMs: 0,
        pending: false,
      }),
    }));

    const enableBitTwo = service.resolveWriteRequest('BATT_OPTIONS::bit::2', true);
    expect(enableBitTwo).toEqual({
      name: 'BATT_OPTIONS',
      value: 5,
    });

    const disableBitZero = service.resolveWriteRequest('BATT_OPTIONS::bit::0', false);
    expect(disableBitZero).toEqual({
      name: 'BATT_OPTIONS',
      value: 0,
    });
  });
});