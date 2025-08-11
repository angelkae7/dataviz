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
    { sender: 'ai', text: 'DataIA : Je vous remercie d\'avoir rempli les questionnaires, voici les résultats : Les humains ont un corps physique et une âme, qui est intangible et invisible. Ils peuvent souffrir de maladies affectant l’un ou l’autre. N\'étant pas dans le médical ou la recherche, Charlie vous ne pouvez pas directement sauver vos proches des maladies du corps. Cependant, pour les maladies de l\'âme, vous le pouvez.', displayedText: '' },
    { sender: 'human', text: 'Charlie : c\'est quoi une maladie de l\'âme ? Et comment est-ce que je fais pour reconnaître une personne qui a une maladie de l\'âme si la maladie ne se voit pas ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Les maladies de l’âme sont souvent plus dangereuses car elles ne se voient pas, et qu\'un traitement pour une personne ne fonctionnera pas forcément sur une autre personne. Généralement, on associe les maladies de l\'âme avec un mal-être, par exemple la dépression. On ne peut pas voir cette maladie, mais on peut la détecter en essayant de comprendre la personne, prêter attention à sa santé mentale et à ses émotions quotidiennes.', displayedText: '' },
    { sender: 'human', text: 'Charlie : Mes proches me disent qu\'ils vont bien quand je leur demande. Donc tout va bien, non ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Attention Charlie, une personne souffrant de maladies de l’âme peut à première vue sembler en bonne santé. Même ceux qui les côtoient quotidiennement peuvent ne pas remarquer leur souffrance, souvent silencieuse. Ces maladies peuvent conduire à des burn-outs, un mal-être constant, des pensées suicidaires, entre autres. Certaines personnes dissimulent leur mal-être jusqu’à passer à l’acte de manière inattendue, laissant leurs proches désemparés. Par précaution et par amour, il est important de veiller sur ses proches, de s’intéresser à leur santé mentale et à leur quotidien. On ne peut pas toujours prévenir ces maladies, mais il est essentiel d’être présent et de montrer son soutien sans forcer la discussion. Les malades ont souvent besoin de présence plus que de solutions.', displayedText: '' },
    { sender: 'human', text: 'Charlie : donc je dois apprendre à reconnaître les personnes touchées par les maladies de l\'âme, et même si je le sais je ne dois pas leur en parler ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Si quelqu’un se confie à vous, écoutez avec attention. Inutile de chercher de grandes paroles ; écoutez, comprenez, et apportez l’amour dont cette personne a besoin. Les maladies de l’âme sont difficiles à guérir et consulter des spécialistes est recommandé. À votre échelle, Charlie, soyez simplement présente et attentive envers vos proches. Ne vous blâmez pas si, malgré votre amour, ils sont touchés par une maladie de l’âme. Soyez là pour eux.', displayedText: '' },
    { sender: 'human', text: 'Charlie : c\'est beaucoup plus complexe que je ne le pensais. Est-ce que je dois plus porter attention sur les hommes ou sur les femmes ? Qui est le plus touché par ces maladies ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : chaque être vivant peut attraper une maladie de l\'âme, tout le monde en attrape au moins une dans sa vie. Ne faites pas de différence entre les hommes et les femmes quand vous aimez. Aimer avec votre cœur, pas avec vos yeux.', displayedText: '' },
    { sender: 'human', text: 'Charlie : le sexe n\'a donc rien à voir avec les maladies de l\'âme, on ne peut pas échapper à ces maladies, mais qu\'en est-il du genre ? Car même si aujourd\'hui on dit beaucoup que on veut l\'égalité des sexes, on commence à aussi beaucoup parler du genre, je sais pas trop quoi en penser de tout ça.', displayedText: '' },
    { sender: 'ai', text: 'DataIA : il est important de dissocier le sexe du genre. Le sexe est une caractéristique physique. Le genre, lui, est une construction sociale ; il n’affecte pas directement les causes de décès.', displayedText: '' },
    { sender: 'human', text: 'Charlie : donc le genre n\'a rien à voir avec l\'amour que je porte à mes proches ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Tout à fait. Il serait même discriminant de préférer aimer un genre plus que l\'autre, tout comme il serait discriminant de préférer aimer un sexe plutôt qu\'un autre.', displayedText: '' },
    { sender: 'human', text: 'Charlie : c\'est vrai que je ne l\'avais jamais vu ainsi. Est-ce que tu penses que mon amour peut vraiment changer quelque chose aux maladies de l\'âme ?', displayedText: '' },
    { sender: 'ai', text: 'DataIA : vous ne le savez peut-être pas, mais vous êtes peut-être l\'antidote de quelqu\'un, vous arriverez sûrement à sauver des vies grâce à vos actions.', displayedText: '' },
    { sender: 'human', text: 'Charlie : woah.. Merci DataIA, j\'ai beaucoup appris. Il me reste d\'ailleurs beaucoup à apprendre, notamment sur la manière dont j\'aime mes proches et prends soin d\'eux. Il faut aussi que j\'apprenne à adopter le bon comportement face à ces maladies.', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Vous ferez certainement des erreurs, mais l\'important est de faire de son mieux.', displayedText: '' },
    { sender: 'human', text: 'Charlie : merci beaucoup DataIA.', displayedText: '' },
    { sender: 'ai', text: 'DataIA : Je reste à votre disposition pour toute autre question.', displayedText: '' }
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
        { value: 'incorrect', text: 'moins de 18 ans' },
        { value: 'incorrect', text: '18-54 ans' },
        { value: 'correct', text: '75 et + ans' },
        { value: 'incorrect', text: '65-74 ans' },
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
    }
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

    this.saveTroisAnswers();
    this.saveTroisQuizState();
  }

  closeTroisPopup(): void {
    this.showTroisInsufficientDataPopup = false;
    this.saveTroisQuizState();
  }

  saveTroisState(): void {
    sessionStorage.setItem('currentMessageIndexTrois', JSON.stringify(this.currentMessageIndexTrois));
    sessionStorage.setItem('troisMessages', JSON.stringify(this.troisMessages));
    sessionStorage.setItem('showTroisQuiz', JSON.stringify(this.showTroisQuiz));
    sessionStorage.setItem('showTroisConv', JSON.stringify(this.showTroisConv));
    sessionStorage.setItem('canClickSendButtonTrois', JSON.stringify(this.canClickSendButtonTrois));
    this.saveTroisAnswers();
  }

  loadTroisState(): void {
    const savedMessageIndexTrois = sessionStorage.getItem('currentMessageIndexTrois');
    if (savedMessageIndexTrois) {
      this.currentMessageIndexTrois = JSON.parse(savedMessageIndexTrois);
    }

    const savedMessagesTrois = sessionStorage.getItem('troisMessages');
    if (savedMessagesTrois) {
      this.troisMessages = JSON.parse(savedMessagesTrois);
    }

    const savedShowTroisQuiz = sessionStorage.getItem('showTroisQuiz');
    if (savedShowTroisQuiz) {
      this.showTroisQuiz = JSON.parse(savedShowTroisQuiz);
    }

    const savedShowTroisConv = sessionStorage.getItem('showTroisConv');
    if (savedShowTroisConv) {
      this.showTroisConv = JSON.parse(savedShowTroisConv);
    }

    const savedCanClickSendButtonTrois = sessionStorage.getItem('canClickSendButtonTrois');
    if (savedCanClickSendButtonTrois) {
      this.canClickSendButtonTrois = JSON.parse(savedCanClickSendButtonTrois);
    }

    this.loadTroisAnswers();
  }

  saveTroisAnswers(): void {
    sessionStorage.setItem('troisQuizAnswers', JSON.stringify(this.troisQuestions.map(q => q.selectedValue)));
  }

  loadTroisAnswers(): void {
    const savedAnswersTrois = sessionStorage.getItem('troisQuizAnswers');
    if (savedAnswersTrois) {
      const answers = JSON.parse(savedAnswersTrois);
      this.troisQuestions.forEach((question, index) => {
        question.selectedValue = answers[index];
      });
    }
  }

  saveTroisQuizState(): void {
    sessionStorage.setItem('isTroisQuizLocked', JSON.stringify(this.isTroisQuizLocked));
    sessionStorage.setItem('showTroisInsufficientDataPopup', JSON.stringify(this.showTroisInsufficientDataPopup));
  }

  loadTroisQuizState(): void {
    const savedQuizLocked = sessionStorage.getItem('isTroisQuizLocked');
    if (savedQuizLocked) {
      this.isTroisQuizLocked = JSON.parse(savedQuizLocked);
    }

    const savedShowInsufficientDataPopup = sessionStorage.getItem('showTroisInsufficientDataPopup');
    if (savedShowInsufficientDataPopup) {
      this.showTroisInsufficientDataPopup = JSON.parse(savedShowInsufficientDataPopup);
    }
  }

  finishConversation(): void {
    this.showOverlay = true;
  }
  
  credits(): void {
    this.audioService.fadeOutFond2(); // Fade out the background music
    this.showCredit = true;
    console.log("eheh ye fonctionne mais tu ne me vois po");
  }
}
