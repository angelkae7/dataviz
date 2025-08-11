import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HEtFComponent } from './h-et-f.component';

describe('HEtFComponent', () => {
  let component: HEtFComponent;
  let fixture: ComponentFixture<HEtFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HEtFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HEtFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
