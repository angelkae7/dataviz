import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TroisQuizComponent } from './trois-quiz.component';

describe('TroisQuizComponent', () => {
  let component: TroisQuizComponent;
  let fixture: ComponentFixture<TroisQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TroisQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TroisQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
