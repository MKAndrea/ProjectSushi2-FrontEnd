import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendinaComponent } from './tendina.component';

describe('TendinaComponent', () => {
  let component: TendinaComponent;
  let fixture: ComponentFixture<TendinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TendinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TendinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
