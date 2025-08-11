import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../services/category.service';

interface Option {
  value: string;
  text: string;
}

interface Question {
  label: string;
  options: Option[];
  selectedValue: string;
  isIncorrect?: boolean;
}

@Component({
  selector: 'app-second-quiz',
  templateUrl: './second-quiz.component.html',
  styleUrls: ['./second-quiz.component.css']
})
export class SecondQuizComponent implements OnInit, OnDestroy {

  showSecondPopupParagraph1 = false;
  showSecondPopupParagraph2 = false;
  showSecondPopupParagraph3 = false;

  // Audio
  secondCategoryEnabledSound: HTMLAudioElement;
  secondCategoryNotEnabledSound: HTMLAudioElement;
  secondQuestionnaireFaux: HTMLAudioElement;
  secondNewCatDeux: HTMLAudioElement;
  secondFaux: HTMLAudioElement;
  secondNotAllComponentsSound: HTMLAudioElement;
  secondChercher: HTMLAudioElement;

  showSecondInsufficientDataPopup = false;
  isSecondQuizLocked = false;

  constructor(public categoryService: CategoryService) {
    this.secondCategoryEnabledSound = new Audio('assets/debut-jeu/yes.mp3');
    this.secondCategoryNotEnabledSound = new Audio('assets/debut-jeu/nope.mp3');
    this.secondQuestionnaireFaux = new Audio('assets/quiz/faux.mp3');
    this.secondNewCatDeux = new Audio('assets/quiz/new_categorie_deux.mp3');
    this.secondFaux = new Audio('assets/quiz/faux.mp3');
    this.secondNotAllComponentsSound = new Audio('assets/quiz/regarde_categories.mp3');
    this.secondChercher = new Audio('assets/debut-jeu/face_au_questionnaire.mp3');
  }

  ngOnInit(): void {
    this.loadSecondState();
  }

  ngOnDestroy(): void {
    this.saveSecondState();
  }

  secondQuestions: Question[] = [
    {
      label: '1. Chaque année, quelle cause (chapitre) est la plus mortifère ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: 'Accidents de la route' },
        { value: 'correct', text: 'Causes externes de morbidités et de mortalité'},
        { value: 'incorrect', text: 'Cancer' },
        { value: 'incorrect', text: 'Suicides' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '2. En 2021, dans la catégorie des "Troubles mentaux organiques y compris les troubles symptomatiques, quelle cause à été la plus mortifère ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: 'Démence, sans précision' },
        { value: 'correct', text: 'Troubles mentaux et du comportement liés à l\' utilisation d\'alcool' },
        { value: 'incorrect', text: 'Démence vasculaire' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '3. Combien de personnes sont mortes de " Diarrhée et gastro-entérite d\' origine infectueuse présumée ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '0' },
        { value: 'incorrect', text: '1' },
        { value: 'incorrect', text: '10' },
        { value: 'correct', text: '5' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '4. En 2017, quel était le top 3 des causes de mortalités (Bloc) pour les "Causes externes de morbidité et mortalité ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: 'Autres causes externes de lésion traumatiques accidentelle, Agression, Lésions auto-infligées' },
        { value: 'correct', text: 'Autres causes externes de lésion traumatiques accidentelle, Accidents de transport, Lésions auto-infligées' },
        { value: 'incorrect', text: 'Évènement dont l\intention n\'est pas déterminée, Accidents de transport, Lésions auto-infligées' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '5. Quels sont les nombres par tranche d\'âge de mort de "Lésions-auto infligées en 2023 ?"',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '18-54 : 22, 55-64 : 0, 75 et +ans : 0' },
        { value: 'correct', text: '18-54 : 5, 55-64 : 3, 75 et +ans : 3' },
        { value: 'incorrect', text: '18-54 : 0, 55-64 : 3, 75 et +ans : 0' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
  ];

  validate(event: Event): void {
    event.preventDefault();

    let allCorrect = true;

    this.secondQuestions.forEach(question => {
      const selectedOption = question.options.find(option => option.text === question.selectedValue);
      if (selectedOption && selectedOption.value === 'incorrect') {
        question.isIncorrect = true;
        allCorrect = false;
      } else if (!selectedOption) {
        question.isIncorrect = true;
        allCorrect = false;
      } else {
        question.isIncorrect = false;
      }
    });

    if (allCorrect) {
      const quotidienUnlocked = this.categoryService.blockedCategories['quotidien'];
      const corpsOsUnlocked = this.categoryService.blockedCategories['corps-os'];
      const naissanceUnlocked = this.categoryService.blockedCategories['naissance'];

      if (quotidienUnlocked && corpsOsUnlocked && naissanceUnlocked) {
        this.secondNewCatDeux.play();
        this.categoryService.onMaladiesClick();
        this.isSecondQuizLocked = true;
        this.saveSecondQuizState();
        setTimeout(() => {
          this.showSecondInsufficientDataPopup = true;
          alert('Données insuffisantes');
          this.secondNewCatDeux.play();
          this.showSecondPopupParagraph2 = true;
          setTimeout(() => this.showSecondPopupParagraph2 = false, 3000);
        }, 1500);
      } else {
        this.secondCategoryNotEnabledSound.play();
        this.secondNotAllComponentsSound.play();
        this.showSecondPopupParagraph3 = true;
        setTimeout(() => this.showSecondPopupParagraph3 = false, 3000);
      }
    } else {
      this.secondCategoryNotEnabledSound.play();
      this.secondQuestionnaireFaux.play();
      this.showSecondPopupParagraph1 = true;
      setTimeout(() => this.showSecondPopupParagraph1 = false, 4500);
    }

    this.saveSecondAnswers();
    this.saveSecondQuizState();
  }

  closePopup(): void {
    this.showSecondInsufficientDataPopup = false;
    this.saveSecondQuizState();
  }

  saveSecondState(): void {
    sessionStorage.setItem('secondQuizAnswers', JSON.stringify(this.secondQuestions.map(q => q.selectedValue)));
    sessionStorage.setItem('isSecondQuizLocked', JSON.stringify(this.isSecondQuizLocked));
    sessionStorage.setItem('showSecondInsufficientDataPopup', JSON.stringify(this.showSecondInsufficientDataPopup));
  }

  loadSecondState(): void {
    const savedAnswers = sessionStorage.getItem('secondQuizAnswers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      this.secondQuestions.forEach((question, index) => {
        question.selectedValue = answers[index];
      });
    }

    const savedQuizLocked = sessionStorage.getItem('isSecondQuizLocked');
    if (savedQuizLocked) {
      this.isSecondQuizLocked = JSON.parse(savedQuizLocked);
    }

    const savedShowInsufficientDataPopup = sessionStorage.getItem('showSecondInsufficientDataPopup');
    if (savedShowInsufficientDataPopup) {
      this.showSecondInsufficientDataPopup = JSON.parse(savedShowInsufficientDataPopup);
    }
  }

  saveSecondAnswers(): void {
    sessionStorage.setItem('secondQuizAnswers', JSON.stringify(this.secondQuestions.map(q => q.selectedValue)));
  }

  saveSecondQuizState(): void {
    sessionStorage.setItem('isSecondQuizLocked', JSON.stringify(this.isSecondQuizLocked));
    sessionStorage.setItem('showSecondInsufficientDataPopup', JSON.stringify(this.showSecondInsufficientDataPopup));
  }

  loadSecondAnswers(): void {
    const savedAnswers = sessionStorage.getItem('secondQuizAnswers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      this.secondQuestions.forEach((question, index) => {
        question.selectedValue = answers[index];
      });
    }
  }
}
