import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CorpsOsComponent } from './corps-os/corps-os.component';
import { NaissanceComponent } from './naissance/naissance.component';
import { QuotidienComponent } from './quotidien/quotidien.component';
import { MaladiesComponent } from './maladies/maladies.component';
import { HEtFComponent } from './h-et-f/h-et-f.component';
import { QuizComponent } from './quiz/quiz.component';
import { SecondQuizComponent } from './second-quiz/second-quiz.component';
import { TroisQuizComponent } from './trois-quiz/trois-quiz.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'corps-os', component: CorpsOsComponent },
  { path: 'second-quiz', component: SecondQuizComponent },
  { path: 'trois-quiz', component: TroisQuizComponent },
  { path: 'naissance', component: NaissanceComponent },
  { path: 'quotidien', component: QuotidienComponent },
  { path: 'maladies', component: MaladiesComponent },
  { path: 'h-et-f', component: HEtFComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
