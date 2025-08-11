import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from './services/category.service'; // Importez le service

type Category = 'home' | 'corps-os' | 'naissance' | 'quotidien' | 'maladies' | 'h-et-f' | 'quiz';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showDebut = true;
  showDemarrageOrdi = false;
  showMainContent = false;
  showArrow = false;
  showPopupParagraph1 = false;
  showPopupParagraph2 = false;
  showPopupParagraph3 = false;
  showPopupParagraph4 = false;
  showDebutSubtitle = false;
  showSearchSubtitle = false;
  arrowStyle = {};
  quizClicked = false; // Variable to check if quiz has been clicked

  // Audio elements
  debutSound: HTMLAudioElement;
  disableElementsSound: HTMLAudioElement;
  categoryEnabledSound: HTMLAudioElement;
  categoryNotEnabledSound: HTMLAudioElement;
  saperlipopetteSound: HTMLAudioElement;

  constructor(private router: Router, public categoryService: CategoryService) {
    this.debutSound = new Audio('assets/debut-jeu/trouve_questionnaire.mp3');
    this.disableElementsSound = new Audio('assets/debut-jeu/avant_trouve_questionnaire.mp3');
    this.categoryEnabledSound = new Audio('assets/debut-jeu/yes.mp3');
    this.categoryNotEnabledSound = new Audio('assets/debut-jeu/nope.mp3');
    this.saperlipopetteSound = new Audio('assets/debut-jeu/categorie_bloquee.mp3');
  }

  hideDebutComponent() {
    this.showDebut = false;
    this.showDemarrageOrdi = true;
  }

  hideDemarrageOrdiComponent() {
    console.log('hideDemarrageOrdiComponent called');

    // Retarde le lancement des sons de 1 seconde
    setTimeout(() => {
      this.debutSound.play();
      this.showPopupParagraph4 = true;
      setTimeout(() => this.showPopupParagraph4 = false, 3000); // Affiche le paragraphe pendant 3 secondes
    }, 1000); // 1000 millisecondes = 1 seconde

    this.showDemarrageOrdi = false;
    this.showMainContent = true;
  }

  moveArrowTo(targetElement: HTMLElement) {
    const rect = targetElement.getBoundingClientRect();
    this.arrowStyle = {
      left: `${rect.left}px`,
      top: `${rect.top}px`
    };
    this.showArrow = true;
  }
// aqui
  disableElementAction(event: Event, category: Category) {
    if (!this.categoryService.blockedCategories[category]) {
      if (!this.quizClicked) {
        this.disableElementsSound.play();
        alert('Catégorie bloquée !');
        this.showPopupParagraph1 = true;
        setTimeout(() => this.showPopupParagraph1 = false, 5500); // Affiche le paragraphe pendant 5.5 secondes
      } else {
        this.saperlipopetteSound.play();
        alert('Catégorie bloquée !');
        this.showPopupParagraph2 = true;
        setTimeout(() => this.showPopupParagraph2 = false, 5500); // Affiche le paragraphe pendant 5.5 secondes
      }
      this.categoryNotEnabledSound.play();
      event.preventDefault();
    }
  }

  setAllCategoriesAccessible(accessible: boolean) {
    Object.keys(this.categoryService.blockedCategories).forEach(key => {
      this.categoryService.blockedCategories[key as Category] = accessible;
    });
  }

  logout() {
    this.showMainContent = false;
    this.router.navigate(['/quiz']);
  }

  onQuizClick() {
    if (!this.categoryService.blockedCategories['corps-os']) {
      this.categoryService.blockedCategories['corps-os'] = true;
      this.categoryEnabledSound.play();
      this.quizClicked = true;
    }
  }

  onCorpsClick() {
    this.categoryService.blockedCategories['naissance'] = true;
    this.categoryEnabledSound.play();
  }

  onNaissanceClick() {
    this.categoryService.blockedCategories['quotidien'] = true;
    this.categoryEnabledSound.play();
  }

  onQuotidienClick() {
    this.categoryService.blockedCategories['maladies'] = true;
    this.categoryEnabledSound.play();
  }

  onMaladiesClick() {
    this.categoryService.blockedCategories['h-et-f'] = true;
    this.categoryEnabledSound.play();
  }

  unlockCategory(category: Category) {
    if (!this.categoryService.blockedCategories[category]) {
      setTimeout(() => {
        this.categoryService.blockedCategories[category] = true;
        this.categoryEnabledSound.play();
      }, 1500);
    }
  }

  // New method to navigate to a category
  navigateToCategory(event: Event, category: Category) {
    if (this.categoryService.blockedCategories[category]) {
      this.router.navigate([`/${category}`]);
    } else {
      this.disableElementAction(event, category);
    }
  }
}
