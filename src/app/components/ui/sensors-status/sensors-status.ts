import { Component } from '@angular/core';

type SensorItem = {
  sensorClass: string;
  iconClass: string;
  titleKey: string;
  shortKey: string;
  shortLabel: string;
  iconName: string;
  isActive: boolean;
  isFix?: boolean;
};

@Component({
  selector: 'app-sensors-status',
  imports: [],
  templateUrl: './sensors-status.html',
  styleUrls: ['./sensors-status.scss'],
})
export class SensorsStatus {

  readonly iconBasePath = '/assets/icons/';

  readonly sensors: SensorItem[] = [
    {
      sensorClass: 'gyro',
      iconClass: 'gyroicon',
      titleKey: 'sensorStatusGyro',
      shortKey: 'sensorStatusGyroShort',
      shortLabel: 'GYR',
      iconName: 'rotate-orbit.svg',
      isActive: true
    },
    {
      sensorClass: 'accel',
      iconClass: 'accicon',
      titleKey: 'sensorStatusAccel',
      shortKey: 'sensorStatusAccelShort',
      shortLabel: 'ACC',
      iconName: 'axis-arrow.svg',
      isActive: true
    },
    {
      sensorClass: 'mag',
      iconClass: 'magicon',
      titleKey: 'sensorStatusMag',
      shortKey: 'sensorStatusMagShort',
      shortLabel: 'MAG',
      iconName: 'compass-outline.svg',
      isActive: false
    },
    {
      sensorClass: 'baro',
      iconClass: 'baroicon',
      titleKey: 'sensorStatusBaro',
      shortKey: 'sensorStatusBaroShort',
      shortLabel: 'BARO',
      iconName: 'thermometer.svg',
      isActive: true
    },
    {
      sensorClass: 'gps',
      iconClass: 'gpsicon',
      titleKey: 'sensorStatusGPS',
      shortKey: 'sensorStatusGPSShort',
      shortLabel: 'GPS',
      iconName: 'satellite-variant.svg',
      isActive: true,
      isFix: true
    },
    {
      sensorClass: 'sonar',
      iconClass: 'sonaricon',
      titleKey: 'sensorStatusSonar',
      shortKey: 'sensorStatusSonarShort',
      shortLabel: 'SON',
      iconName: 'sonar.svg',
      isActive: false
    }
  ];

  getIconPath(iconName: string): string {
    return this.iconBasePath + iconName;
  }
}
