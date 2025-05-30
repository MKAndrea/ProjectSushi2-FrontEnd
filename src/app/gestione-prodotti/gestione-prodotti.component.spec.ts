import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneProdottiComponent } from './gestione-prodotti.component';

describe('GestioneProdottiComponent', () => {
  let component: GestioneProdottiComponent;
  let fixture: ComponentFixture<GestioneProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneProdottiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneProdottiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
