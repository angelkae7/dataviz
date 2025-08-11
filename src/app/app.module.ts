import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CorpsOsComponent } from './corps-os/corps-os.component';
import { DebutComponent } from './debut/debut.component';
import { DemarrageOrdiComponent } from './demarrage-ordi/demarrage-ordi.component';
import { QuizComponent } from './quiz/quiz.component';
import { FinComponent } from './fin/fin.component';
import { SecondQuizComponent } from './second-quiz/second-quiz.component';
import { NaissanceComponent } from './naissance/naissance.component';
import { QuotidienComponent } from './quotidien/quotidien.component';
import { MaladiesComponent } from './maladies/maladies.component';
import { HEtFComponent } from './h-et-f/h-et-f.component';
import { TroisQuizComponent } from './trois-quiz/trois-quiz.component';
import { AudioService } from './audio.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GeneralComponent } from './general/general.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CorpsOsComponent,
    DebutComponent,
    DemarrageOrdiComponent,
    QuizComponent,
    FinComponent,
    SecondQuizComponent,
    NaissanceComponent,
    QuotidienComponent,
    MaladiesComponent,
    HEtFComponent,
    TroisQuizComponent,
    GeneralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgApexchartsModule
  ],
  providers: [AudioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
