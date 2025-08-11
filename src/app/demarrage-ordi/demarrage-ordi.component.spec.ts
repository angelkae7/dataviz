import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemarrageOrdiComponent } from './demarrage-ordi.component';

describe('DemarrageOrdiComponent', () => {
  let component: DemarrageOrdiComponent;
  let fixture: ComponentFixture<DemarrageOrdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemarrageOrdiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemarrageOrdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
