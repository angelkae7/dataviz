import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Blocked categories state
  blockedCategories: Record<string, boolean> = {
    home: true,
    'corps-os': false,
    naissance: false,
    quotidien: false,
    maladies: false,
    'h-et-f': false,
    quiz: true // le quiz doit être accessible par défaut
  };

  constructor() { }

  onCorpsClick() {
    this.blockedCategories['naissance'] = true;
    this.playCategoryEnabledSound();
  }

  onNaissanceClick() {
    this.blockedCategories['quotidien'] = true;
    this.playCategoryEnabledSound();
  }

  onQuotidienClick() {
    this.blockedCategories['maladies'] = true;
    this.playCategoryEnabledSound();
  }

  onMaladiesClick() {
    this.blockedCategories['h-et-f'] = true;
    this.playCategoryEnabledSound();
  }

  playCategoryEnabledSound(): void {
    const categoryEnabledSound = new Audio('assets/debut-jeu/yes.mp3');
    categoryEnabledSound.play();
  }

  // Ajoutez d'autres méthodes similaires pour les autres catégories
}
