import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotidienComponent } from './quotidien.component';

describe('QuotidienComponent', () => {
  let component: QuotidienComponent;
  let fixture: ComponentFixture<QuotidienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotidienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotidienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
