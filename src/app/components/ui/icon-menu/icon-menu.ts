import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TransformMode = 'translate' | 'rotate' | 'scale';
export type SymmetryPlane = 'front' | 'right';

@Component({
  selector: 'app-icon-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-menu.html',
  styleUrl: './icon-menu.scss',
})
export class IconMenu {
  readonly icons = {
    translate: 'assets/icons/axis-arrow.svg',
    rotate: 'assets/icons/rotate-orbit.svg',
    scale: 'assets/icons/resize.svg',
    duplicate: 'assets/icons/content-duplicate.svg',
    circularRepeat: 'assets/icons/dots-circle.svg',
    symmetry: 'assets/icons/symetrie.svg',
    symmetryPlane: 'assets/icons/dots-grid.svg',
    delete: 'assets/icons/delete-outline.svg',
  } as const;

  // Inputs
  transformMode = input<TransformMode>('translate');
  contextMenuPos = input<{ x: number; y: number } | null>(null);
  deleteOnly = input(false);
  canCreateSymmetry = input(false);
  hasSymmetry = input(false);
  canToggleSymmetryPlane = input(false);
  symmetryPlane = input<SymmetryPlane>('front');
  canCreateCircularRepeat = input(false);
  hasCircularRepeat = input(false);
  circularRepeatCount = input(1);

  // Outputs
  transformModeChange = output<TransformMode>();
  duplicate = output<void>();
  createCircularRepeat = output<void>();
  createSymmetry = output<void>();
  toggleSymmetryPlane = output<void>();
  delete = output<void>();

  setTransformMode(mode: TransformMode) {
    this.transformModeChange.emit(mode);
  }

  onDuplicate() {
    this.duplicate.emit();
  }

  onCreateCircularRepeat() {
    this.createCircularRepeat.emit();
  }

  onCreateSymmetry() {
    this.createSymmetry.emit();
  }

  onToggleSymmetryPlane() {
    this.toggleSymmetryPlane.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
