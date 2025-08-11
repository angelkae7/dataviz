import { Component, OnInit } from '@angular/core';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  items = [
    { title: 'Chapitre', content: 'C\'est la plus grande catégorie, regroupant de grands groupes de maladies. Par exemple, le chapitre "Maladies infectieuses" englobe toutes les maladies de ce type.' },
    { title: 'Bloc', content: 'À l\'intérieur d\'un chapitre, un bloc regroupe des maladies plus spécifiques. Par exemple, dans le chapitre des maladies infectieuses, un bloc pourrait regrouper les infections virales.' },
    { title: 'Classe', content: 'C\'est la catégorie la plus précise, désignant une maladie spécifique. Par exemple, la grippe est une classe dans le bloc des infections virales.' }
  ];

  selectedIndex: number | null = null;

  toggle(index: number) {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }
  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
    setTimeout(() => {

      this.audioService.playFond2();
    }, 1000); // 1000 milliseconds = 1 second
  }
}
