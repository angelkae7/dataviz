import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from '../app.component'; // Import AppComponent

@Component({
  selector: 'app-debut',
  templateUrl: './debut.component.html',
  styleUrls: ['./debut.component.css']
})
export class DebutComponent implements AfterViewInit {
  private ringSound!: HTMLAudioElement;
  private currentAudio!: HTMLAudioElement;
  private dialogueIndex: number = 0;
  private dialogues: { text: string, sound?: string }[] = [
    { text: "Charlie : Oui allo ? ", sound: 'debut/diag1.mp3' },
    { text: "Tantine : Allo Charlie ? [pleurs] Oui c'est tantine Carole à l'appareil...", sound: 'debut/diag2.mp3' },
    { text: "Charlie : Tantine ?!", sound: 'debut/diag3.mp3' },
    { text: "Tantine : Je t'appelle pour... [pleurs] Excuse-moi... Je t'appelle pour t'annoncer le décès de ta tante.. Tu sais, ta tante Pénéloppe.", sound: 'debut/diag4.mp3' },
    { text: "Chalie : Non... Encore un mort dans la famille ?", sound: 'debut/diag5.mp3' },
    { text: "Tantine : Je suis désolée ma chérie... On fera les funérailles ce samedi matin, tu penses que tu pourras être là ?", sound: 'debut/diag6.mp3' },
    { text: "Charlie : ..." },
    { text: "Tantine : Charlie ? Charlie tu m'entends ? Charlie ?", sound: 'debut/diag8.mp3' },
    { text: "[raccroche]", sound: 'debut/diag9.mp3' },
    { text: "Charlie : Je ne supporte plus que mes proches décèdent les uns après les autres.", sound: 'debut/diag10.mp3' },
    { text: "Charlie : Faut vraiment que je fasse quelque chose.", sound: 'debut/diag11.mp3' }
  ];

  constructor(private appComponent: AppComponent) {}  // Inject AppComponent

  ngAfterViewInit(): void {
    const warningScreen = document.getElementById('warningScreen') as HTMLDivElement;
    const phoneScreen = document.getElementById('phoneScreen') as HTMLDivElement;
    const dialogueScreen = document.getElementById('dialogueScreen') as HTMLDivElement;
    const arrowWarning = document.getElementById('arrowWarning') as HTMLSpanElement;
    const phone = document.getElementById('phone') as HTMLImageElement;
    const dialogueText = document.getElementById('dialogueText') as HTMLParagraphElement;
    const arrowDialogue = document.getElementById('arrowDialogue') as HTMLSpanElement;
    const startPcButton = document.getElementById('startPcButton') as HTMLButtonElement;

    this.ringSound = new Audio('assets/debut/ring.mp3');

    arrowWarning.addEventListener('click', () => {
      warningScreen.style.display = 'none';
      phoneScreen.style.display = 'block';
      this.playRingSound();
    });

    phone.addEventListener('click', () => {
      phoneScreen.style.display = 'none';
      this.stopRingSound();
      dialogueScreen.style.display = 'block';
      this.showDialogue(dialogueText);
    });

    arrowDialogue.addEventListener('click', () => {
      this.nextDialogue(dialogueText);
    });

    startPcButton.addEventListener('click', () => {
      this.appComponent.showDebut = false;
      this.appComponent.showDemarrageOrdi = true;
    });
  }

  private playRingSound(): void {
    this.ringSound.loop = true;
    this.ringSound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }

  private stopRingSound(): void {
    this.ringSound.pause();
    this.ringSound.currentTime = 0;
  }

  private showDialogue(dialogueText: HTMLParagraphElement): void {
    if (this.dialogueIndex < this.dialogues.length) {
      const currentDialogue = this.dialogues[this.dialogueIndex];
      dialogueText.textContent = currentDialogue.text;
      if (currentDialogue.sound) {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
        this.currentAudio = new Audio(`assets/${currentDialogue.sound}`);
        this.currentAudio.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      }
    }
  }

  private nextDialogue(dialogueText: HTMLParagraphElement): void {
    this.dialogueIndex++;
    if (this.dialogueIndex < this.dialogues.length) {
      this.showDialogue(dialogueText);
    } else {
      dialogueText.style.display = 'none';
      const arrowDialogue = document.getElementById('arrowDialogue') as HTMLSpanElement;
      arrowDialogue.style.display = 'none';
      const startPcButton = document.getElementById('startPcButton') as HTMLButtonElement;
      startPcButton.style.display = 'block';
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    }
  }

  @Output() done = new EventEmitter<void>();

  finish() {
    this.done.emit();
  }
}
