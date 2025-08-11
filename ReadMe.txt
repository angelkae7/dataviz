
1 - En quel année y a t il eu un pic de morts ?
correct : 2021


2 - en quel année y a t il eu moins de décès de femme ?

correct : 2012


3 - Pour quelle tranche d'âge les femmes sont elle plus sujet à la mort ?
correct : 5

4 - Combien de morts séparent le nombre de décès femme et homme de "Causes externes de morbidité et de mortalité ?
correct : 983

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { AudioService } from '../audio.service';

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
  selector: 'app-trois-quiz',
  templateUrl: './trois-quiz.component.html',
  styleUrls: ['./trois-quiz.component.css']
})
export class TroisQuizComponent implements OnInit, OnDestroy {

  showTroisPopupParagraph1 = false;
  showTroisPopupParagraph2 = false;
  showTroisPopupParagraph3 = false;

  // Audio
  categoryEnabledSoundTrois: HTMLAudioElement;
  categoryNotEnabledSoundTrois: HTMLAudioElement;
  questionnaireFauxTrois: HTMLAudioElement;
  newCatUnTrois: HTMLAudioElement;
  fauxTrois: HTMLAudioElement;
  notAllComponentsSoundTrois: HTMLAudioElement;

  showTroisInsufficientDataPopup = false;
  isTroisQuizLocked = false;

  showTroisQuiz = true;
  showTroisConv = false;
  canClickSendButtonTrois = false;
  showCredit = false;

  troisMessages = [
    //... (messages unchanged)
  ];

  currentMessageIndexTrois = 0;
  showOverlay = false;

  constructor(
    public categoryService: CategoryService,
    private audioService: AudioService // Inject AudioService here
  ) {
    this.categoryEnabledSoundTrois = new Audio('assets/debut-jeu/yes.mp3');
    this.categoryNotEnabledSoundTrois = new Audio('assets/debut-jeu/nope.mp3');
    this.questionnaireFauxTrois = new Audio('assets/quiz/faux.mp3');
    this.newCatUnTrois = new Audio('assets/quiz/juste.mp3');
    this.fauxTrois = new Audio('assets/quiz/faux.mp3');
    this.notAllComponentsSoundTrois = new Audio('assets/quiz/regarde_categories.mp3');
  }

  ngOnInit(): void {
    this.loadTroisState();
    this.loadTroisQuizState();
    if (this.showTroisConv && this.currentMessageIndexTrois < this.troisMessages.length) {
      this.displayNextTroisMessage();
    } else {
      this.canClickSendButtonTrois = false;
    }
  }

  ngOnDestroy(): void {
    this.saveTroisState();
    this.saveTroisQuizState();
  }

  sendTroisMessage() {
    if (this.currentMessageIndexTrois < this.troisMessages.length) {
      const message = this.troisMessages[this.currentMessageIndexTrois];
      if (message.sender === 'human') {
        message.displayedText = message.text;
        this.currentMessageIndexTrois++;
        this.canClickSendButtonTrois = false;
        if (this.currentMessageIndexTrois < this.troisMessages.length) {
          this.displayNextTroisMessage();
        }
      }
    }
    this.saveTroisState();
  }

  displayNextTroisMessage() {
    if (this.currentMessageIndexTrois < this.troisMessages.length) {
      const message = this.troisMessages[this.currentMessageIndexTrois];
      if (message.sender === 'ai') {
        message.displayedText = message.sender === 'ai' ? 'DataIA : ' : 'Charlie : ';
        this.displayTroisMessageLetterByLetter(message, () => {
          this.currentMessageIndexTrois++;
          if (this.currentMessageIndexTrois < this.troisMessages.length && this.troisMessages[this.currentMessageIndexTrois].sender === 'ai') {
            this.displayNextTroisMessage();
          } else {
            this.canClickSendButtonTrois = this.currentMessageIndexTrois < this.troisMessages.length;
            this.saveTroisState();
          }
        });
      } else {
        this.canClickSendButtonTrois = this.currentMessageIndexTrois < this.troisMessages.length;
      }
    }
  }

  displayTroisMessageLetterByLetter(message: any, callback: () => void) {
    let index = message.displayedText.length;
    const interval = setInterval(() => {
      if (index < message.text.length) {
        message.displayedText = message.text.substring(0, index + 1);
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 20);
  }

  troisQuestions: Question[] = [
    {
      label: '1 - En quelle année y a-t-il eu un pic de morts ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '2020' },
        { value: 'correct', text: '2021' },
        { value: 'incorrect', text: '2019' },
        { value: 'incorrect', text: '2022' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '2 - En quelle année y a-t-il eu moins de décès de femmes ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: '2012' },
        { value: 'incorrect', text: '2013' },
        { value: 'incorrect', text: '2014' },
        { value: 'incorrect', text: '2015' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '3 - Pour quelle tranche d\'âge les femmes sont-elles plus sujettes à la mort ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '0-4 ans' },
        { value: 'incorrect', text: '15-29 ans' },
        { value: 'correct', text: '5-9 ans' },
        { value: 'incorrect', text: '30-44 ans' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '4 - Combien de morts séparent le nombre de décès de femmes et d\'hommes pour "Causes externes de morbidité et de mortalité"?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '500' },
        { value: 'correct', text: '983' },
        { value: 'incorrect', text: '1200' },
        { value: 'incorrect', text: '700' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: '5 - Quelle est la principale cause de décès chez les femmes ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: 'Cancer' },
        { value: 'incorrect', text: 'Accidents de la route' },
        { value: 'incorrect', text: 'Maladies cardiovasculaires' },
        { value: 'incorrect', text: 'Suicides' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
  ];

  validateTroisQuiz(event: Event): void {
    event.preventDefault();

    let allCorrect = true;

    this.troisQuestions.forEach(question => {
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
        this.newCatUnTrois.play();
        this.categoryService.onQuotidienClick();
        this.isTroisQuizLocked = true;
        this.showTroisQuiz = false; // Hide quiz after validation
        this.showTroisConv = true;  // Show conversation after validation
        this.displayNextTroisMessage(); // Start the conversation
        setTimeout(() => {
          this.showTroisInsufficientDataPopup = true;
          this.newCatUnTrois.play();
          this.showTroisPopupParagraph2 = true;
          setTimeout(() => this.showTroisPopupParagraph2 = false, 3000);
        }, 1500);
      } else {
        this.categoryNotEnabledSoundTrois.play();
        this.notAllComponentsSoundTrois.play();
        this.showTroisPopupParagraph3 = true;
        setTimeout(() => this.showTroisPopupParagraph3 = false, 3000);
      }
    } else {
      this.categoryNotEnabledSoundTrois.play();
      this.questionnaireFauxTrois.play();
      this.showTroisPopupParagraph1 = true;
      setTimeout(() => this.showTroisPopupParagraph1 = false, 4500);
    }
    this.saveTroisQuizState();
  }

  saveTroisState() {
    localStorage.setItem('troisState', JSON.stringify(this.currentMessageIndexTrois));
  }

  loadTroisState() {
    const savedState = localStorage.getItem('troisState');
    if (savedState) {
      this.currentMessageIndexTrois = JSON.parse(savedState);
    }
  }

  saveTroisQuizState() {
    const state = {
      showTroisQuiz: this.showTroisQuiz,
      isTroisQuizLocked: this.isTroisQuizLocked,
      showTroisConv: this.showTroisConv,
      troisQuestions: this.troisQuestions,
    };
    localStorage.setItem('troisQuizState', JSON.stringify(state));
  }

  loadTroisQuizState() {
    const savedState = localStorage.getItem('troisQuizState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.showTroisQuiz = state.showTroisQuiz;
      this.isTroisQuizLocked = state.isTroisQuizLocked;
      this.showTroisConv = state.showTroisConv;
      this.troisQuestions = state.troisQuestions;
    }
  }
}

