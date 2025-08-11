import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpsOsComponent } from './corps-os.component';

describe('CorpsOsComponent', () => {
  let component: CorpsOsComponent;
  let fixture: ComponentFixture<CorpsOsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorpsOsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorpsOsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
