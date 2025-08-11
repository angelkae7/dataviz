import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Général
  private apiUrl = 'http://localhost/dataviz/api/total_deces_par_annee.php';
  private apiUrlDecesParAge = 'http://localhost/dataviz/api/deces_par_age.php';
  private apiUrlTopCausesByYear = 'http://localhost/dataviz/api/top_causes_by_year.php';
  private apiUrlAgeGroupPercentageByCause = 'http://localhost/dataviz/api/age_group_percentage_by_cause.php';

  // Corps-OS + Naissance + Quotidien
  private apiCorpsTotalDecesParAnnee = 'http://localhost/dataviz/api/corps_total_deces_par_annee.php';
  private apiDecesParBloc = 'http://localhost/dataviz/api/deces_par_bloc.php'; // Modifié pour la nouvelle API
  private apiDecesParClasse = 'http://localhost/dataviz/api/deces_par_class.php'; // Nouvelle API pour les classes
  private apiUrlAgeGroupPercentageByBloc = 'http://localhost/dataviz/api/age_group_percentage_by_bloc.php';

  //H-et-F
  private apiUrlDecesParSexeEtAnnee = 'http://localhost/dataviz/api/deces_par_sexe_et_annee.php';
  private apiUrlDecesParClasseAgeEtSexe = 'http://localhost/dataviz/api/deces_par_classe_age_et_sexe.php';
  private apiUrlDecesParCausesEtSexe = 'http://localhost/dataviz/api/deces_par_causes_et_sexe.php';

  constructor(private http: HttpClient) { }

  // HOME.Component
  getTotalDecesParAnnee(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getDecesParAge(): Observable<any> {
    return this.http.get<any>(this.apiUrlDecesParAge);
  }

  getTopCausesByYear(year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTopCausesByYear}?year=${year}`);
  }

  getAgeGroupPercentageByCause(cause: string, year: number): Observable<any> {
    const encodedCause = encodeURIComponent(cause);
    return this.http.get<any>(`${this.apiUrlAgeGroupPercentageByCause}?cause=${encodedCause}&year=${year}`);
  }

  // CORPS-OS.COMPONENT
  getTotalDecesParChapitre(): Observable<any> {
    return this.http.get<any>(this.apiCorpsTotalDecesParAnnee);
  }

  getDecesParBlocEtClasse(causeChapitre: string, annee: number): Observable<any[]> {
    const encodedCauseChapitre = encodeURIComponent(causeChapitre);
    return this.http.get<any[]>(`${this.apiDecesParBloc}?chapitre=${encodedCauseChapitre}&annee=${annee}`);
  }

  getCausesParBloc(bloc: string, annee: number): Observable<any[]> {
    const encodedBloc = encodeURIComponent(bloc);
    return this.http.get<any[]>(`${this.apiDecesParClasse}?bloc=${encodedBloc}&annee=${annee}`);
  }

  getAgeGroupPercentageByBloc(cause: string, year: number): Observable<any> {
    const encodedCause = encodeURIComponent(cause);
    return this.http.get<any>(`${this.apiUrlAgeGroupPercentageByBloc}?cause=${encodedCause}&year=${year}`);
  }

  getDecesParSexeEtAnnee(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDecesParSexeEtAnnee);
  }

  // Ajoutez cette méthode dans api.service.ts
getDecesParClasseAgeEtSexe(): Observable<any> {
  return this.http.get<any>(this.apiUrlDecesParClasseAgeEtSexe);
}

getCausesParSexe(): Observable<any> {
  return this.http.get<any>(this.apiUrlDecesParCausesEtSexe);
}


}
