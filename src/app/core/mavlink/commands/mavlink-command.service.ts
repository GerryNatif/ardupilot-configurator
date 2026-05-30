/**
 * Service centralisant l'envoi des commandes MAVLink sortantes vers le vehicule.
 *
 * Usage:
 * - Envoyer les commandes de controle (arm/disarm, reboot).
 * - Declencher les requetes MAVLink (parametres, version autopilote, cadence messages).
 * - Normaliser les contraintes du protocole avant emission (ex: param_id limite a 16 caracteres).
 *
 * Ce service ne maintient pas d'etat metier: il construit les messages MAVLink
 * puis delegue l'emission binaire au MavlinkParserService.
 *
 * Service that centralizes outbound MAVLink command dispatch to the vehicle.
 *
 * Usage:
 * - Send control commands (arm/disarm, reboot).
 * - Trigger MAVLink requests (parameters, autopilot version, message rates).
 * - Normalize protocol constraints before send (for example, param_id limited to 16 characters).
 *
 * This service does not hold business state: it builds MAVLink messages,
 * then delegates binary transmission to MavlinkParserService.
 */
import { Injectable } from '@angular/core';
import { MavlinkParserService } from '../protocol/mavlink-parser.service';

@Injectable({ providedIn: 'root' })

export class MavlinkCommandService {
  constructor(private readonly parser: MavlinkParserService) {}

  private static readonly MAV_CMD_SET_MESSAGE_INTERVAL = 511;
  private static readonly MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN = 246;

  async arm(targetSystem = 1, targetComponent = 1): Promise<void> {
    const m = this.parser.mavlink();
    const cmd = new m.messages.command_long(
      targetSystem,
      targetComponent,
      m.MAV_CMD_COMPONENT_ARM_DISARM,
      0,
      1, // arm
      0, 0, 0, 0, 0, 0
    );
    await this.parser.sendPacked(cmd);
  }

  async disarm(targetSystem = 1, targetComponent = 1): Promise<void> {
    const m = this.parser.mavlink();
    const cmd = new m.messages.command_long(
      targetSystem,
      targetComponent,
      m.MAV_CMD_COMPONENT_ARM_DISARM,
      0,
      0,
      0, 0, 0, 0, 0, 0
    );
    await this.parser.sendPacked(cmd);
  }

  async requestAutopilotVersion(targetSystem: number, targetComponent: number): Promise<void> {
    const m = this.parser.mavlink();
    const cmd = new m.messages.command_long(
      targetSystem,
      targetComponent,
      m.MAV_CMD_REQUEST_MESSAGE,
      0,
      148, // AUTOPILOT_VERSION message id
      0, 0, 0, 0, 0, 0
    );
    await this.parser.sendPacked(cmd);
  }

  async requestAllParameters(targetSystem: number, targetComponent: number): Promise<void> {
    const m = this.parser.mavlink();
    const req = new m.messages.param_request_list(
      targetSystem,
      targetComponent
    );
    await this.parser.sendPacked(req);
  }

  async requestParameterByIndex(
    targetSystem: number,
    targetComponent: number,
    index: number
  ): Promise<void> {
    const m = this.parser.mavlink();
    const req = new m.messages.param_request_read(
      targetSystem,
      targetComponent,
      '',
      index
    );
    await this.parser.sendPacked(req);
  }

  async requestParameterByName(
    targetSystem: number,
    targetComponent: number,
    name: string
  ): Promise<void> {
    const m = this.parser.mavlink();
    const req = new m.messages.param_request_read(
      targetSystem,
      targetComponent,
      this.normalizeParamName(name),
      -1
    );
    await this.parser.sendPacked(req);
  }

  async setParameter(
    targetSystem: number,
    targetComponent: number,
    name: string,
    value: number,
    type: number
  ): Promise<void> {
    const m = this.parser.mavlink();
    const req = new m.messages.param_set(
      targetSystem,
      targetComponent,
      this.normalizeParamName(name),
      value,
      type
    );
    await this.parser.sendPacked(req);
  }

  async requestMessageInterval(
    targetSystem: number,
    targetComponent: number,
    messageId: number,
    intervalUs: number
  ): Promise<void> {
    const m = this.parser.mavlink();
    const cmdId =
      typeof m.MAV_CMD_SET_MESSAGE_INTERVAL === 'number'
        ? m.MAV_CMD_SET_MESSAGE_INTERVAL
        : MavlinkCommandService.MAV_CMD_SET_MESSAGE_INTERVAL;

    const cmd = new m.messages.command_long(
      targetSystem,
      targetComponent,
      cmdId,
      0,
      messageId,
      intervalUs,
      0,
      0,
      0,
      0,
      0
    );
    await this.parser.sendPacked(cmd);
  }

  async rebootAutopilot(targetSystem: number, targetComponent: number): Promise<void> {
    const m = this.parser.mavlink();
    const cmdId =
      typeof m.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN === 'number'
        ? m.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN
        : MavlinkCommandService.MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN;

    const cmd = new m.messages.command_long(
      targetSystem,
      targetComponent,
      cmdId,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0
    );

    await this.parser.sendPacked(cmd);
  }

  private normalizeParamName(name: string): string {
    // MAVLink param_id est limité à 16 chars.
    return name.trim().slice(0, 16);
  }

}