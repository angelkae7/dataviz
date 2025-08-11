import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaladiesComponent } from './maladies.component';

describe('MaladiesComponent', () => {
  let component: MaladiesComponent;
  let fixture: ComponentFixture<MaladiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaladiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaladiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
