import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DroneLinkFacade } from '../../core/mavlink/facade/drone-link.facade';
import { GuiBox } from '../ui/gui-box/gui-box';

@Component({
  selector: 'app-rtl-visualizer',
  imports: [DecimalPipe,GuiBox],
  templateUrl: './rtl-visualizer.html',
  styleUrl: './rtl-visualizer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtlVisualizer {
  private readonly link = inject(DroneLinkFacade);

  readonly viewBoxW = 600;
  readonly viewBoxH = 400;
  readonly chartLeftX = 40;
  readonly groundStartX = 140;
  readonly chartRightX = 560;

  // Points de référence du schéma
  readonly takeoffX = this.groundStartX + 20;
  readonly homeX    = 520;
  readonly groundY  = 390;

  private param(name: string): number | null {
    const v = this.link.parameterState().byName.get(name)?.value;
    return v != null ? v : null;
  }

  readonly rtlAlt       = computed(() => this.param('RTL_ALT'));
  readonly rtlAltFinal  = computed(() => this.param('RTL_ALT_FINAL'));
  readonly rtlClimbMin  = computed(() => this.param('RTL_CLIMB_MIN'));
  readonly rtlConeSlope = computed(() => this.param('RTL_CONE_SLOPE'));
  readonly rtlSpeed     = computed(() => this.param('RTL_SPEED'));
  readonly rtlLoitTime  = computed(() => this.param('RTL_LOIT_TIME'));
  readonly rtlAltType   = computed(() => this.param('RTL_ALT_TYPE'));
  readonly isConnected  = this.link.isConnected;

  // Valeurs en centimètres → convertit en mètres
  readonly altM       = computed(() => (this.rtlAlt()       ?? 1500) / 100);
  readonly altFinalM  = computed(() => (this.rtlAltFinal()  ?? 0)    / 100);
  readonly climbMinM  = computed(() => (this.rtlClimbMin()  ?? 0)    / 100);

  // ---- Géométrie SVG ----
  // L'échelle verticale s'adapte à la plus grande altitude affichée.
  // Cela garde visibles les cas où drone + CLIMB_MIN dépasse RTL_ALT.
  // SVG_H = hauteur utile disponible entre groundY et la marge haute (20px).
  private readonly SVG_H = computed(() => this.groundY - 20);
  private readonly MAX_M = computed(() =>
    Math.max(
      this.altM(),
      this.droneAltM(),
      this.droneAltM() + this.climbMinM(),
      this.coneMinAltM(),
      0.1
    )
  );

  // Convertit une altitude en mètres en coordonnée Y dans le SVG
  private mToY(m: number): number {
    return this.groundY - (m / this.MAX_M()) * this.SVG_H();
  }

  // Altitude courante simulée du drone (entrée utilisateur, en cm)
  readonly droneAltCm = signal(500);
  private readonly droneAltM = computed(() => this.droneAltCm() / 100);
  // Distance courante simulée du drone au Home (entrée utilisateur, en mètres)
  readonly droneDistM = signal(300);

  // Altitude RTL (ligne horizontale de vol)
  readonly rtlY       = computed(() => this.mToY(this.altM()));
  // Altitude finale
  readonly finalY     = computed(() => this.mToY(this.altFinalM()));
  // Altitude minimale de montée absolue : drone + CLIMB_MIN
  readonly climbMinAbsM = computed(() => this.droneAltM() + this.climbMinM());
  readonly climbMinY  = computed(() => this.mToY(this.climbMinAbsM()));

  // Contrainte cône RTL: RTL_ALT_FINAL + distance(m) * RTL_CONE_SLOPE(cm/m)
  readonly coneMinAltCm = computed(() =>
    (this.rtlAltFinal() ?? 0) + this.droneDistM() * (this.rtlConeSlope() ?? 0)
  );
  readonly coneMinAltM = computed(() => this.coneMinAltCm() / 100); //conversion en mètres
  readonly climbConeY = computed(() => this.mToY(this.coneMinAltM()));

  // Cible de la montée : max(RTL_ALT, drone + CLIMB_MIN)
  readonly climbTargetM = computed(() =>
    Math.max(this.altM(), this.droneAltM() + this.climbMinM())
  );
  readonly climbTargetY = computed(() => this.mToY(this.climbTargetM()));
  readonly droneY     = computed(() => this.mToY(Math.min(this.droneAltM(), this.MAX_M())));
  
  readonly showFirstClimbSegment = computed(() => this.climbTargetM() > this.droneAltM());

  setDroneAlt(value: string): void {
    const n = Number(value);
    if (!isNaN(n) && n >= 0) this.droneAltCm.set(n);
  }

  setDroneDist(value: string): void {
    const n = Number(value);
    if (!isNaN(n) && n >= 0) this.droneDistM.set(n);
  }

  // Chemin du drone: départ au centre du drone, montée, horizontal, puis descente finale
  readonly dronePath  = computed(() => {
    const x1 = this.takeoffX + 16;
    const x2 = this.homeX;
    const y0 = this.droneY();
    const y1 = this.climbTargetY();
    const y2 = this.climbConeY();
    const y3 = this.finalY();
    return `M${x1},${y0} L${x1},${y1} L${x2},${y2} L${x2},${y3}`;
  });

  // Calcule les points de la flèche horizontale pour qu'elle suive l'inclinaison du segment
  get horizontalArrowPoints(): string {
    // Segment horizontal: de (takeoffX+16, climbTargetY) à (homeX, climbConeY)
    const x1 = this.takeoffX + 16;
    const y1 = this.climbTargetY();
    const x2 = this.homeX;
    const y2 = this.climbConeY();
    // Vecteur du segment
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len < 1) return '';
    // Position de la pointe (extrémité du segment)
    const tipX = x2;
    const tipY = y2;
    // Largeur de la base de la flèche
    const baseWidth = 16;
    // Longueur de la flèche
    const arrowLen = 18;
    // Calcul de la base de la flèche (perpendiculaire au segment)
    const nx = -dy / len;
    const ny = dx / len;
    // Position de la base (en arrière de la pointe)
    const baseX = tipX - (dx/len)*arrowLen;
    const baseY = tipY - (dy/len)*arrowLen;
    // Deux points à gauche et à droite de la base
    const leftX = baseX + nx * (baseWidth/2);
    const leftY = baseY + ny * (baseWidth/2);
    const rightX = baseX - nx * (baseWidth/2);
    const rightY = baseY - ny * (baseWidth/2);
    // Format SVG points
    return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
  }

  readonly altTypeLabel = computed(() => {
    switch (this.rtlAltType()) {
      case 0:  return 'Relative (home)';
      case 1:  return 'Terrain';
      default: return this.rtlAltType() == null ? '--' : String(this.rtlAltType());
    }
  });
}