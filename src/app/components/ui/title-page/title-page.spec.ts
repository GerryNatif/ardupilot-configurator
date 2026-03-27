import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlePage } from './title-page';

describe('Title', () => {
  let component: TitlePage;
  let fixture: ComponentFixture<TitlePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitlePage],
    }).compileComponents();

    fixture = TestBed.createComponent(TitlePage);
    fixture.componentRef.setInput('title', 'Titre de test');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
