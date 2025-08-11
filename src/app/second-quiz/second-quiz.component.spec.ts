import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondQuizComponent } from './second-quiz.component';

describe('SecondQuizComponent', () => {
  let component: SecondQuizComponent;
  let fixture: ComponentFixture<SecondQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
