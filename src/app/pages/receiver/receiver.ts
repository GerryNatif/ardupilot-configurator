import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { TitlePage, TitlePageAction } from '../../components/ui/title-page/title-page';
import { ChannelGauge } from '../../components/channel-gauge/channel-gauge';
import { Popup } from '../../components/ui/popup/popup';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { ParameterDraftSession } from '../../core/parameter/param-page/parameter-draft-session';
import { RadioCalibration } from '../radio-calibration/radio-calibration';

interface ChannelDiscoveryState {
  readonly min: number;
  readonly max: number;
  readonly last: number;
}

interface ReceiverChannelViewModel {
  readonly index: number;
  readonly title: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly trim: number;
  readonly reversed: boolean;
  readonly deadZone: number;
  readonly modeLabel: string;
  readonly modeOptions: ReadonlyArray<string>;
  readonly showMode: boolean;
  readonly showDeadZone: boolean;
}

@Component({
  selector: 'app-receiver',
  imports: [TitlePage, ChannelGauge, Popup, RadioCalibration],
  templateUrl: './receiver.html',
  styleUrl: './receiver.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ParameterDraftSession],
})
export class Receiver {
  private static readonly SAVE_CONTEXT_ID = 'receiver';
  private static readonly DEFAULT_RC_MIN = 1000;
  private static readonly DEFAULT_RC_MAX = 2000;
  private static readonly DISCOVERY_MOVEMENT_THRESHOLD = 6;
  private static readonly DISCOVERY_LIMIT_PROXIMITY = 20;

  private readonly facade = inject(DroneLinkFacade);
  private readonly draftSession = inject(ParameterDraftSession);
  private readonly discoverySig = signal<Record<number, ChannelDiscoveryState>>({});
  private readonly deadZoneOverridesSig = signal<Record<number, number>>({});
  private readonly modeOverridesSig = signal<Record<number, number>>({});
  private readonly reversedOverridesSig = signal<Record<number, boolean>>({});
  readonly isCalibrationDialogOpen = signal(false);

  readonly pageActions: ReadonlyArray<TitlePageAction> = [
    {
      id: 'wiki',
      label: 'Wiki',
      url: 'https://ardupilot.org/copter/docs/common-downloading-and-analyzing-data-logs-in-mission-planner.html',
      target: '_blank',
    },
    {
      id: 'calibration',
      label: 'Calibration radio',
    },
  ];

  readonly channels = computed<ReadonlyArray<ReceiverChannelViewModel>>(() => {
    const telemetry = this.facade.telemetry();
    const parameterState = this.facade.parameterState();
    const discovery = this.discoverySig();
    const deadZoneOverrides = this.deadZoneOverridesSig();
    const modeOverrides = this.modeOverridesSig();
    const reversedOverrides = this.reversedOverridesSig();

    const channelsRaw = telemetry.rc.channelsRaw;
    const count = this.resolveChannelCount(telemetry.rc.channelCount, channelsRaw.length);
    const rcMapLabelsByChannel = this.resolveRcMapLabelsByChannel(parameterState.byName);
    const items: Array<ReceiverChannelViewModel> = [];

    for (let channelIndex = 1; channelIndex <= count; channelIndex += 1) {
      const rawValue = channelsRaw[channelIndex - 1];
      if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
        continue;
      }

      const minParam = this.getRcParam(parameterState.byName, channelIndex, 'MIN');
      const maxParam = this.getRcParam(parameterState.byName, channelIndex, 'MAX');
      const trimParam = this.getRcParam(parameterState.byName, channelIndex, 'TRIM');
      const reversedParam = this.getRcParam(parameterState.byName, channelIndex, 'REVERSED');
      const deadZoneParam = this.getRcParam(parameterState.byName, channelIndex, 'DZ');
      const optionParam = this.getRcParam(parameterState.byName, channelIndex, 'OPTION') ?? 0;

      const discovered = discovery[channelIndex];
      const fallbackMin = minParam ?? Receiver.DEFAULT_RC_MIN;
      const fallbackMax = maxParam ?? Receiver.DEFAULT_RC_MAX;
      const observedMin = discovered?.min ?? fallbackMin;
      const observedMax = discovered?.max ?? fallbackMax;

      const min = Math.min(observedMin, observedMax - 1);
      const max = Math.max(observedMax, min + 1);
      const trim = this.resolveTrim(trimParam, min, max);
      const deadZone = deadZoneOverrides[channelIndex] ?? deadZoneParam ?? 150;
      const optionKey = `RC${channelIndex}_OPTION`;
      const selectedOption = modeOverrides[channelIndex] ?? optionParam;
      const isPrimaryChannel = channelIndex <= 4;
      const modeOptions = isPrimaryChannel
        ? [rcMapLabelsByChannel[channelIndex] ?? 'Aucun mapping']
        : this.resolveChannelOptionLabels(optionKey, selectedOption);
      const modeLabel = isPrimaryChannel
        ? modeOptions[0]
        : this.resolveSelectedModeLabel(modeOptions, selectedOption);
      const reversed = reversedOverrides[channelIndex] ?? (reversedParam === 1);

      items.push({
        index: channelIndex,
        title: `Channel ${channelIndex}`,
        value: Math.round(rawValue),
        min,
        max,
        trim,
        reversed,
        deadZone,
        modeLabel,
        modeOptions,
        showMode: channelIndex > 4,
        showDeadZone: channelIndex <= 4,
      });
    }

    return items;
  });

  constructor() {
    this.draftSession.start(Receiver.SAVE_CONTEXT_ID);

    effect(
      () => {
        const telemetry = this.facade.telemetry();
        const parameterState = this.facade.parameterState();
        const channelsRaw = telemetry.rc.channelsRaw;
        const count = this.resolveChannelCount(telemetry.rc.channelCount, channelsRaw.length);

        if (count <= 0) {
          return;
        }

        const currentState = untracked(() => this.discoverySig());
        const nextState: Record<number, ChannelDiscoveryState> = { ...currentState };
        let hasChanges = false;

        for (let channelIndex = 1; channelIndex <= count; channelIndex += 1) {
          const rawValue = channelsRaw[channelIndex - 1];
          if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
            continue;
          }

          const value = Math.round(rawValue);
          const minParam =
            this.getRcParam(parameterState.byName, channelIndex, 'MIN') ?? Receiver.DEFAULT_RC_MIN;
          const maxParam =
            this.getRcParam(parameterState.byName, channelIndex, 'MAX') ?? Receiver.DEFAULT_RC_MAX;
          const existing = nextState[channelIndex] ?? {
            min: Math.min(minParam, maxParam),
            max: Math.max(minParam, maxParam),
            last: value,
          };

          const moved = Math.abs(value - existing.last) >= Receiver.DISCOVERY_MOVEMENT_THRESHOLD;
          if (!moved) {
            continue;
          }

          const shouldUpdateMin =
            value < existing.min ||
            (value <= existing.min + Receiver.DISCOVERY_LIMIT_PROXIMITY && value < existing.last);
          const shouldUpdateMax =
            value > existing.max ||
            (value >= existing.max - Receiver.DISCOVERY_LIMIT_PROXIMITY && value > existing.last);

          const nextMin = shouldUpdateMin ? Math.min(existing.min, value) : existing.min;
          const nextMax = shouldUpdateMax ? Math.max(existing.max, value) : existing.max;
          const nextLast = value;

          if (existing.min === nextMin && existing.max === nextMax && existing.last === nextLast) {
            continue;
          }

          nextState[channelIndex] = {
            min: nextMin,
            max: nextMax,
            last: nextLast,
          };
          hasChanges = true;
        }

        if (hasChanges) {
          this.discoverySig.set(nextState);
        }
      },
      { allowSignalWrites: true }
    );
  }

  onDeadZoneChange(channelIndex: number, deadZone: number): void {
    const sanitized = Number.isFinite(deadZone) ? Math.max(0, Math.round(deadZone)) : 0;
    this.deadZoneOverridesSig.update((current) => ({
      ...current,
      [channelIndex]: sanitized,
    }));

    this.queueDraftChange(`RC${channelIndex}_DZ`, sanitized);
  }

  onModeChange(channelIndex: number, modeLabel: string): void {
    const optionValue = this.parseOptionValue(modeLabel);
    if (optionValue == null) {
      return;
    }

    this.modeOverridesSig.update((current) => ({
      ...current,
      [channelIndex]: optionValue,
    }));

    this.queueDraftChange(`RC${channelIndex}_OPTION`, optionValue);
  }

  onReversedChange(channelIndex: number, reversed: boolean): void {
    this.reversedOverridesSig.update((current) => ({
      ...current,
      [channelIndex]: reversed,
    }));

    this.queueDraftChange(`RC${channelIndex}_REVERSED`, reversed ? 1 : 0);
  }

  onTitleAction(action: TitlePageAction): void {
    if (action.id === 'calibration') {
      this.openCalibrationDialog();
    }
  }

  openCalibrationDialog(): void {
    this.isCalibrationDialogOpen.set(true);
  }

  closeCalibrationDialog(): void {
    this.isCalibrationDialogOpen.set(false);
  }

  private resolveChannelCount(rawCount: number | null, fallbackLength: number): number {
    if (typeof rawCount === 'number' && Number.isFinite(rawCount) && rawCount > 0) {
      return Math.min(Math.round(rawCount), fallbackLength);
    }

    return fallbackLength;
  }

  private getRcParam(
    byName: Map<string, { value: number }>,
    channelIndex: number,
    suffix: 'MIN' | 'MAX' | 'TRIM' | 'REVERSED' | 'DZ' | 'OPTION'
  ): number | null {
    const key = `RC${channelIndex}_${suffix}`;
    const value = byName.get(key)?.value;
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private formatChannelOption(option: number): string {
    if (!Number.isFinite(option) || option <= 0) {
      return 'Disabled';
    }

    return `Option ${Math.round(option)}`;
  }

  private parseOptionValue(modeLabel: string): number | null {
    const prefix = modeLabel.split('-')[0]?.trim();
    if (!prefix) {
      return null;
    }

    const parsed = Number(prefix);
    return Number.isFinite(parsed) ? Math.round(parsed) : null;
  }

  private queueDraftChange(name: string, value: number): void {
    const current = this.facade.parameterState().byName.get(name)?.value;
    const rebootRequired = this.facade.getParameterMetadata(name)?.rebootRequired === true;

    this.draftSession.setChange({ name, value, rebootRequired }, current);
  }

  private resolveChannelOptionLabels(paramName: string, currentOption: number): ReadonlyArray<string> {
    const metadata = this.facade.getParameterMetadata(paramName);
    const fromMetadata = Array.from(metadata?.values.entries() ?? [])
      .sort((a, b) => a[0] - b[0])
      .map(([value, label]) => this.formatChannelOptionValue(value, label));

    if (fromMetadata.length > 0) {
      const currentLabel = this.findOptionLabelByValue(fromMetadata, currentOption);
      if (currentLabel) {
        return fromMetadata;
      }

      return [this.formatChannelOption(currentOption), ...fromMetadata];
    }

    return [this.formatChannelOption(currentOption)];
  }

  private resolveSelectedModeLabel(options: ReadonlyArray<string>, currentOption: number): string {
    const existing = this.findOptionLabelByValue(options, currentOption);
    return existing ?? this.formatChannelOption(currentOption);
  }

  private findOptionLabelByValue(options: ReadonlyArray<string>, value: number): string | null {
    const normalized = Math.round(value);
    const marker = `${normalized} -`;
    const match = options.find((item) => item.startsWith(marker));
    return match ?? null;
  }

  private formatChannelOptionValue(value: number, label: string): string {
    const normalizedLabel = label.trim();
    return `${Math.round(value)} - ${normalizedLabel.length > 0 ? normalizedLabel : 'Option'}`;
  }

  private resolveTrim(trim: number | null, min: number, max: number): number {
    const fallback = min + (max - min) / 2;
    if (trim == null || !Number.isFinite(trim)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, trim));
  }

  private resolveRcMapLabelsByChannel(byName: Map<string, { value: number }>): Record<number, string> {
    const axisMappings: Array<{ axis: string; channel: number }> = [
      { axis: 'ROLL', channel: this.getMappedChannel(byName, 'RCMAP_ROLL', 1) },
      { axis: 'PITCH', channel: this.getMappedChannel(byName, 'RCMAP_PITCH', 2) },
      { axis: 'THROTTLE', channel: this.getMappedChannel(byName, 'RCMAP_THROTTLE', 3) },
      { axis: 'YAW', channel: this.getMappedChannel(byName, 'RCMAP_YAW', 4) },
    ];

    const byChannel: Record<number, string> = {};
    for (const mapping of axisMappings) {
      if (!Number.isFinite(mapping.channel) || mapping.channel <= 0) {
        continue;
      }

      const channel = Math.round(mapping.channel);
      if (byChannel[channel]) {
        byChannel[channel] = `${byChannel[channel]} / ${mapping.axis}`;
      } else {
        byChannel[channel] = mapping.axis;
      }
    }

    return byChannel;
  }

  private getMappedChannel(
    byName: Map<string, { value: number }>,
    paramName: 'RCMAP_ROLL' | 'RCMAP_PITCH' | 'RCMAP_THROTTLE' | 'RCMAP_YAW',
    fallback: number
  ): number {
    const value = byName.get(paramName)?.value;
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return fallback;
    }

    return Math.round(value);
  }
}