import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ModelEditor } from './model-editor';
import { ThreejsCanvas } from '../../features/threejs-editor/components/threejs-canva/threejs-canva';

describe('ModelEditor', () => {
  let component: ModelEditor;
  let fixture: ComponentFixture<ModelEditor>;

  beforeEach(async () => {
    vi.spyOn(ThreejsCanvas.prototype, 'ngAfterViewInit').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [ModelEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
