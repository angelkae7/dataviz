import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private fond2: HTMLAudioElement;

  constructor() {
    this.fond2 = new Audio('assets/musique/fond2.mp3'); // Set the correct path to your audio file
    this.fond2.loop = true; // Enable looping for fond2
  }

  playFond2(): void {
    this.fond2.play();
  }

  pauseFond2(): void {
    this.fond2.pause();
  }

  fadeOutFond2(): void {
    let volume = this.fond2.volume;

    const fadeAudio = setInterval(() => {
      if (volume > 0.1) {
        volume -= 0.1;
        this.fond2.volume = volume;
      } else {
        this.fond2.volume = 0;
        this.pauseFond2();
        clearInterval(fadeAudio);
      }
    }, 200); // Adjust the fade duration to your preference
  }
}
