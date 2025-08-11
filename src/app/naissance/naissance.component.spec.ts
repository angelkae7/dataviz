import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaissanceComponent } from './naissance.component';

describe('NaissanceComponent', () => {
  let component: NaissanceComponent;
  let fixture: ComponentFixture<NaissanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NaissanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaissanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
