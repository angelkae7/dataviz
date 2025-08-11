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
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  
  messages = [
    { sender: 'ai', text: 'DataIA : La base de données "BDD" a été chargée avec succès. Comment puis-je vous assister ?', displayedText: '' },
    { sender: 'human', text: 'Charlie : Avec ces données, j\'aimerais savoir comment sauver mes proches de la mort.', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Je suis désolée, mais il y a eu un problème avec la base de données. Pour que je puisse vous aider, veuillez remplir ce questionnaire :', displayedText: '' },
  ];

  currentMessageIndex = 0;
  showSendButton = true;
  showQuiz = false;
  canClickSendButton = false;

  constructor(
    public categoryService: CategoryService,
    private audioService: AudioService
  ) {
    // Initialize audio elements
    this.categoryEnabledSound = new Audio('assets/debut-jeu/yes.mp3');
    this.categoryNotEnabledSound = new Audio('assets/debut-jeu/nope.mp3');
    this.questionnaireFaux = new Audio('assets/quiz/faux.mp3');
    this.newCatUn = new Audio('assets/quiz/new_categorie_un.mp3');
    this.faux = new Audio('assets/debut-jeu/faux.mp3');
    this.notAllComponentsSound = new Audio('assets/quiz/regarde_categories.mp3');
    this.chercher = new Audio('assets/debut-jeu/face_au_questionnaire.mp3');
  }

  ngOnInit(): void {
    this.audioService.playFond2();
    this.loadState();
    if (this.currentMessageIndex >= this.messages.length) {
      this.showSendButton = false;
      this.showQuiz = true;
    } else {
      this.displayNextMessage();
    }
  }

  ngOnDestroy(): void {
    this.saveState();
    this.audioService.pauseFond2();
  }

  sendMessage() {
    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];
      if (message.sender === 'human') {
        message.displayedText = message.text;
        this.currentMessageIndex++;
        this.canClickSendButton = false;
        if (this.currentMessageIndex < this.messages.length) {
          this.displayNextMessage();
        } else {
          this.showQuiz = true;
          this.showSendButton = false;
        }
      }
    }
    this.saveState();
  }

  displayNextMessage() {
    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];
      if (message.sender === 'ai') {
        message.displayedText = message.sender === 'ai' ? 'DataIA : ' : 'Charlie : ';
        this.displayMessageLetterByLetter(message, () => {
          this.currentMessageIndex++;
          this.canClickSendButton = true;
          if (this.currentMessageIndex < this.messages.length && this.messages[this.currentMessageIndex].sender === 'ai') {
            this.displayNextMessage();
          } else if (this.currentMessageIndex >= this.messages.length) {
            this.showQuiz = true;
            this.showSendButton = false;
            this.chercher.play();
            this.showPopupParagraph4 = true;
            setTimeout(() => this.showPopupParagraph4 = false, 3000);
          }
        });
      }
    }
    this.saveState();
  }

  displayMessageLetterByLetter(message: any, callback: () => void) {
    let index = message.displayedText.length;
    const interval = setInterval(() => {
      if (index < message.text.length) {
        message.displayedText = message.text.substring(0, index + 1);
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 50);
  }

  showPopupParagraph1 = false;
  showPopupParagraph2 = false;
  showPopupParagraph3 = false;
  showPopupParagraph4 = false;

  // Audio
  categoryEnabledSound: HTMLAudioElement;
  categoryNotEnabledSound: HTMLAudioElement;
  questionnaireFaux: HTMLAudioElement;
  newCatUn: HTMLAudioElement;
  faux: HTMLAudioElement;
  notAllComponentsSound: HTMLAudioElement;
  chercher: HTMLAudioElement;

  showInsufficientDataPopup = false;
  isQuizLocked = false;

  triggerOnQuotidienClick(): void {
    this.categoryService.onQuotidienClick();
  }

  //Les questions + réponses ! 
  
  questions: Question[] = [
    {
      label: 'Général | 1. Quel est le top 3 des causes de mortalité qui ont été les plus fréquentes entre 2011 et 2023 ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: `Tumeurs, Maladies de l'appareil circulatoire, Causes externe de morbidité et mortalité` },
        { value: 'incorrect', text: `Maladies de l'appareil circulatoire, Causes externe de morbidité et mortalité, Tumeurs` },
        { value: 'incorrect', text: `Tumeurs, Maladies de l'appareil circulatoire, Maladies de l'appareil circulatoire` },
        { value: 'incorrect', text: `Causes externe de morbidité et mortalité, Tumeurs, Maladies de l'appareil circulatoire` },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Général | 2. En quelle année ce trio fait-il exception ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '2018' },
        { value: 'incorrect', text: '2011' },
        { value: 'incorrect', text: '2016' },
        { value: 'correct', text: '2023' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Général | 3. Pour la cause de mortalité précédemment mentionnée, quel est le nombre de victimes âgées de 18 à 54 ans ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: '22' },
        { value: 'incorrect', text: '25' },
        { value: 'incorrect', text: '57' },
        { value: 'incorrect', text: '18' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Corps et Os | 1. En 2018, combien de personnes sont mortes de "Grippe et Pneumonpathie" ? ',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: '62' },
        { value: 'correct', text: '71' },
        { value: 'incorrect', text: '132' },
        { value: 'incorrect', text: '30' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Corps et Os | 2. En 2015, 3 personnes sont mortes de "Syndromes extrapyramidaux et troubles de la motricité", quelle est PRÉCISEMENT la cause de ces 3 morts ?  ',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: 'Maladie de Parkinson' },
        { value: 'incorrect', text: 'Épilepsie' },
        { value: 'incorrect', text: 'Hydrocéphalie' },
        { value: 'incorrect', text: 'Leucémie lymphoïde' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Naissance | En 2015, quel cause de mortalité (classe) a causé 6 morts" ? ',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'incorrect', text: 'Asphyxie obsétricale' },
        { value: 'correct', text: 'Détresse respiratoire du nouveau né' },
        { value: 'incorrect', text: 'Syndromes néonatals d\'aspiration' },
        { value: 'incorrect', text: 'Hypoxis intra-utérine' },
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
    {
      label: 'Quotidien | Quelle est la deuxième cause (bloc) de mortalité en 2023 ?',
      options: [
        { value: 'incorrect', text: '--Sélectionnez une réponse--' },
        { value: 'correct', text: 'Malnutrition' },
        { value: 'incorrect', text: 'Diabète sucré' },
        { value: 'incorrect', text: 'Anomalies du métabolisme' }
      ],
      selectedValue: '--Sélectionnez une réponse--'
    },
  ];

  validate(event: Event): void {
    event.preventDefault();

    let allCorrect = true;

    this.questions.forEach(question => {
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
        this.newCatUn.play();
        this.categoryService.onQuotidienClick();
        this.isQuizLocked = true;
        this.saveQuizState();
        setTimeout(() => {
          this.showInsufficientDataPopup = true;
          alert('Données insuffisantes');
          this.newCatUn.play();
          this.showPopupParagraph2 = true;
          setTimeout(() => this.showPopupParagraph2 = false, 3000);
        }, 1500);
      } else {
        this.categoryNotEnabledSound.play();
        this.notAllComponentsSound.play();
        this.showPopupParagraph3 = true;
        setTimeout(() => this.showPopupParagraph3 = false, 3000);
      }
    } else {
      this.categoryNotEnabledSound.play();
      this.questionnaireFaux.play();
      this.showPopupParagraph1 = true;
      setTimeout(() => this.showPopupParagraph1 = false, 4500);
    }

    this.saveAnswers();
  }

  closePopup(): void {
    this.showInsufficientDataPopup = false;
    this.saveQuizState();
  }

  saveState(): void {
    sessionStorage.setItem('quizAnswers', JSON.stringify(this.questions.map(q => q.selectedValue)));
    sessionStorage.setItem('isQuizLocked', JSON.stringify(this.isQuizLocked));
    sessionStorage.setItem('showInsufficientDataPopup', JSON.stringify(this.showInsufficientDataPopup));
    sessionStorage.setItem('currentMessageIndex', JSON.stringify(this.currentMessageIndex));
    sessionStorage.setItem('messages', JSON.stringify(this.messages));
    sessionStorage.setItem('showQuiz', JSON.stringify(this.showQuiz));
    sessionStorage.setItem('showSendButton', JSON.stringify(this.showSendButton));
  }

  loadState(): void {
    const savedQuizAnswers = sessionStorage.getItem('quizAnswers');
    if (savedQuizAnswers) {
      const answers = JSON.parse(savedQuizAnswers);
      this.questions.forEach((question, index) => {
        question.selectedValue = answers[index];
      });
    }

    const savedQuizLocked = sessionStorage.getItem('isQuizLocked');
    if (savedQuizLocked) {
      this.isQuizLocked = JSON.parse(savedQuizLocked);
    }

    const savedShowInsufficientDataPopup = sessionStorage.getItem('showInsufficientDataPopup');
    if (savedShowInsufficientDataPopup) {
      this.showInsufficientDataPopup = JSON.parse(savedShowInsufficientDataPopup);
    }

    const savedMessageIndex = sessionStorage.getItem('currentMessageIndex');
    if (savedMessageIndex) {
      this.currentMessageIndex = JSON.parse(savedMessageIndex);
    }

    const savedMessages = sessionStorage.getItem('messages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }

    const savedShowQuiz = sessionStorage.getItem('showQuiz');
    if (savedShowQuiz) {
      this.showQuiz = JSON.parse(savedShowQuiz);
    }

    const savedShowSendButton = sessionStorage.getItem('showSendButton');
    if (savedShowSendButton) {
      this.showSendButton = JSON.parse(savedShowSendButton);
    }
  }

  saveAnswers(): void {
    sessionStorage.setItem('quizAnswers', JSON.stringify(this.questions.map(q => q.selectedValue)));
  }

  loadAnswers(): void {
    const savedAnswers = sessionStorage.getItem('quizAnswers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      this.questions.forEach((question, index) => {
        question.selectedValue = answers[index];
      });
    }
  }

  saveQuizState(): void {
    sessionStorage.setItem('isQuizLocked', JSON.stringify(this.isQuizLocked));
    sessionStorage.setItem('showInsufficientDataPopup', JSON.stringify(this.showInsufficientDataPopup));
  }

  loadQuizState(): void {
    const savedQuizLocked = sessionStorage.getItem('isQuizLocked');
    if (savedQuizLocked) {
      this.isQuizLocked = JSON.parse(savedQuizLocked);
    }

    const savedShowInsufficientDataPopup = sessionStorage.getItem('showInsufficientDataPopup');
    if (savedShowInsufficientDataPopup) {
      this.showInsufficientDataPopup = JSON.parse(savedShowInsufficientDataPopup);
    }
  }
}
