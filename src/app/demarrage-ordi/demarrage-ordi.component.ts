import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-demarrage-ordi',
  templateUrl: './demarrage-ordi.component.html',
  styleUrls: ['./demarrage-ordi.component.css']
})
export class DemarrageOrdiComponent implements OnInit {
  lines: string[] = [
    "Connexion de l'utilisateur: Charlie",
    "Saisie du mot de passe: ********",
    "Démarrage de l'intelligence artificielle: dataIA",
    "Chargement de la base de données: BDD",
    "Initialisation de l'interface de l'IA...",
    "Ouverture de l'interface utilisateur...",
    "Préparation de l'environnement de travail...",
    "Chargement des modules nécessaires...",
    "Configuration des paramètres par défaut...",
    "Lancement de dataIA..."
  ];
  displayedText: string = "";
  currentLineIndex: number = 0;
  currentCharIndex: number = 0;
  showLoadingBar: boolean = false;
  cursorVisible: boolean = true;
  typingSound = new Audio('assets/demarrage-ordi/clavier.mp3'); // Ensure you have this sound file
  specialWords = ["Charlie", "********", "dataIA", "BDD"];
  specialWordDuration = 500; // Duration in milliseconds for special words
  showEnterText: boolean = false; // New flag to show the Enter text
  isPlayingSpecialWordSound: boolean = false; // Flag to check if special word sound is playing

  @Output() done = new EventEmitter<void>();

  ngOnInit(): void {
    this.displayNextChar();
    window.addEventListener('keypress', this.handleEnterPress.bind(this));
    setInterval(() => this.toggleCursor(), 500); // Cursor blink interval
  }

  displayNextChar(): void {
    const totalChars = this.lines.reduce((acc, line) => acc + line.length, 0);
    const totalDisplayTime = 5000; // Total display time in milliseconds
    const charDisplayTime = totalDisplayTime / totalChars;

    if (this.currentLineIndex < this.lines.length) {
      const currentLine = this.lines[this.currentLineIndex];
      const currentWord = this.getCurrentWord(currentLine, this.currentCharIndex);

      if (this.currentCharIndex < currentLine.length) {
        this.displayedText += currentLine[this.currentCharIndex];
        this.currentCharIndex++;

        if (this.specialWords.includes(currentWord) && !this.isPlayingSpecialWordSound) {
          this.playTypingSound(this.specialWordDuration);
          this.isPlayingSpecialWordSound = true;
        }

        setTimeout(() => this.displayNextChar(), this.specialWords.includes(currentWord) ? this.specialWordDuration / currentWord.length : charDisplayTime);
      } else {
        if (this.isPlayingSpecialWordSound) {
          this.stopTypingSound();
          this.isPlayingSpecialWordSound = false;
        }
        this.displayedText += '\n';
        this.currentLineIndex++;
        this.currentCharIndex = 0;
        setTimeout(() => this.displayNextChar(), 200); // Slight delay before starting next line
      }
    } else {
      this.cursorVisible = false;
      this.showEnterText = true; // Show the Enter text after all lines are displayed
    }
  }

  handleEnterPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.currentLineIndex >= this.lines.length) {
      this.showLoadingBar = true;
      this.showEnterText = false; // Hide the Enter text when Enter is pressed
      window.removeEventListener('keypress', this.handleEnterPress.bind(this));
      setTimeout(() => {
        this.showLoadingBar = false;
        // Notify that the component is done
        this.done.emit();
      }, 3000); // Loading bar duration
    }
  }

  toggleCursor(): void {
    this.cursorVisible = !this.cursorVisible;
  }

  getCurrentWord(line: string, charIndex: number): string {
    const words = line.split(' ');
    let currentWord = '';
    let currentLength = 0;

    for (const word of words) {
      currentLength += word.length + 1; // Adding 1 for the space
      if (currentLength >= charIndex) {
        currentWord = word;
        break;
      }
    }
    return currentWord;
  }

  playTypingSound(duration: number): void {
    this.typingSound.play();
    setTimeout(() => {
      this.stopTypingSound();
    }, duration);
  }

  stopTypingSound(): void {
    this.typingSound.pause();
    this.typingSound.currentTime = 0;
  }
}
