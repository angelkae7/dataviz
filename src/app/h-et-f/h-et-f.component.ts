import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexLegend,
  ApexFill,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexResponsive,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  markers?: ApexMarkers;
  legend?: ApexLegend;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  title?: ApexTitleSubtitle;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-h-et-f',
  templateUrl: './h-et-f.component.html',
  styleUrls: ['./h-et-f.component.css']
})
export class HEtFComponent implements OnInit {

  @ViewChild('chart1') chart1!: ChartComponent;
  @ViewChild('chart2') chart2!: ChartComponent;
  @ViewChild('chart3') chart3!: ChartComponent;
  @ViewChild('chart4') chart4!: ChartComponent; // Ajout du 4e graphique
  public chartOptions1: Partial<ChartOptions> | any;
  public chartOptions2: Partial<ChartOptions> | any;
  public chartOptions3: Partial<ChartOptions> | any;
  public chartOptions4: Partial<ChartOptions> | any; // Ajout du 4

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.chartOptions1 = {
      series: [],
      chart: {
        type: 'line',
        height: 400,
      },
      title: {
        text: 'Répartition des décès par sexe et par année',
        align: 'left'
      },
      xaxis: {
        categories: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]
      },
      yaxis: {
        title: {
          text: 'Nombre de décès'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 5
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      tooltip: {
        enabled: true
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

    this.chartOptions2 = {
      series: [],
      chart: {
        type: 'bar',
        height: 400,
        stacked: true
      },
      title: {
        text: 'Distribution des décès par tranches d\'âges',
        align: 'left'
      },
      xaxis: {
        categories: ['moins de 18 ans',
          '18-54 ans',
          '55-64 ans',
          '65-74 ans',
          '75 et + ans'],
        title: {
          text: 'Tranches d\'âge'
        }
      },
      yaxis: {
        title: {
          text: 'Nombre de décès'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      markers: {
        size: 5
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      tooltip: {
        enabled: true
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      colors: ['#cbcbcb', '#b680fb'], // Couleurs pour les barres
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

    this.chartOptions3 = {
      series: [],
      chart: {
        type: 'treemap',
        height: 400
      },
      title: {
        text: 'Causes (Chapitre) Corps et Os',
        align: 'center'
      },
      dataLabels: {
        enabled: true
      },
      tooltip: {
        enabled: true
      },
      legend: {
        show: false
      },
      colors: ['#cbcbcb', '#b680fb'], // Couleurs pour le treemap
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300
            }
          }
        }
      ]
    };

    // Options pour le 4e graphique
    this.chartOptions4 = {
      series: [],
      chart: {
        type: 'treemap',
        height: 400
      },
      title: {
        text: 'Causes (Chapitre) Maladie de l\'Âme',
        align: 'center'
      },
      dataLabels: {
        enabled: true
      },
      tooltip: {
        enabled: true
      },
      legend: {
        show: false
      },
      colors: ['#cbcbcb', '#b680fb'], // Couleurs pour le treemap
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 300
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    // Causes de mortalité à inclure
    const causesInclusion = [
      'Maladies de l\'appareil circulatoire',
      'Maladies de l\'appareil digestif',
      'Maladies de l\'appareil génito-urinaire',
      'Maladies de l\'appareil respiratoire',
      'Maladies de l\'oreille et de l\'apophyse mastoïde',
      'Maladies de la peau et du tissu cellulaire sous-cutané',
      'Maladies du sang et des organes hématopoïétiques et certains troubles du système immunitaire',
      'Maladies du système nerveux',
      'Tumeurs'
    ];

    // Causes de mortalité à inclure pour le 4e graphique
    const causesInclusion2 = [
      'Troubles mentaux et du comportement',
      'Lésions traumatiques, empoisonnements et certaines autres conséquences de causes externes',
      'Certaines maladies infectieuses et parasitaires',
      'Causes externes de morbidité et de mortalité'
    ];

    // Récupérer les données pour le premier graphique
    this.apiService.getDecesParSexeEtAnnee().subscribe((data: any[]) => {
      console.log('DecesParSexeEtAnnee Data:', data);

      const years = Array.from(new Set(data.map(d => d.annee))).sort((a, b) => a - b);
      const categories = years.map(year => String(year));

      const seriesHommes = {
        name: 'Hommes',
        data: years.map(year => {
          const record = data.find(d => d.annee === year && d.Sexe === 'Homme');
          return record ? record.total_deces : 0;
        })
      };

      const seriesFemmes = {
        name: 'Femmes',
        data: years.map(year => {
          const record = data.find(d => d.annee === year && d.Sexe === 'Femme');
          return record ? record.total_deces : 0;
        })
      };

      this.chartOptions1.series = [seriesHommes, seriesFemmes];
      this.chartOptions1.xaxis.categories = categories;
      this.cdr.detectChanges();
    }, error => {
      console.error('Erreur lors de la récupération des données pour le graphique 1!', error);
    });

    // Récupérer les données pour le deuxième graphique
    this.apiService.getDecesParClasseAgeEtSexe().subscribe((data: any[]) => {
      console.log('DecesParClasseAgeEtSexe Data:', data);

      if (data.length === 0) {
        console.error('Aucune donnée reçue pour le graphique 2.');
        return;
      }

      const categories = [...new Set(data.map(d => d.classe_age))].sort((a, b) => {
        const order: any = {
          'moins de 18 ans': 1,
          '18-54 ans': 2,
          '55-64 ans': 3,
          '65-74 ans': 4,
          '75 et + ans': 5
        };
        return (order[a] || 0) - (order[b] || 0);
      });
      console.log('Categories:', categories);

      const seriesHommes = {
        name: 'Hommes',
        data: categories.map(classe => {
          const record = data.find(d => d.classe_age === classe && d.Sexe === 'Homme');
          return record ? record.total_deces : 0;
        })
      };

      const seriesFemmes = {
        name: 'Femmes',
        data: categories.map(classe => {
          const record = data.find(d => d.classe_age === classe && d.Sexe === 'Femme');
          return record ? record.total_deces : 0;
        })
      };

      console.log('Series Hommes:', seriesHommes);
      console.log('Series Femmes:', seriesFemmes);

      this.chartOptions2.series = [seriesHommes, seriesFemmes];
      this.chartOptions2.xaxis.categories = categories;
      this.cdr.detectChanges();
    }, error => {
      console.error('Erreur lors de la récupération des données pour le graphique 2!', error);
    });

    // Récupérer les données pour le troisième graphique (Treemap)
    this.apiService.getCausesParSexe().subscribe((data: any[]) => {
      console.log('CausesParSexe Data:', data);

      if (data.length === 0) {
        console.error('Aucune donnée reçue pour le graphique 3.');
        return;
      }

      // Préparer les données pour le Treemap
      const hommesData: { x: string, y: number }[] = [];
      const femmesData: { x: string, y: number }[] = [];

      // Filtrer les causes de mortalité spécifiées
      const causes = [...new Set(data.map(d => d.cause))]
        .filter(cause => causesInclusion.includes(cause));

      causes.forEach(cause => {
        const totalHommes = data
          .filter(d => d.cause === cause && d.Sexe === 'Homme')
          .reduce((sum, d) => sum + d.total_deces, 0);

        const totalFemmes = data
          .filter(d => d.cause === cause && d.Sexe === 'Femme')
          .reduce((sum, d) => sum + d.total_deces, 0);

        if (totalHommes > 0) {
          hommesData.push({ x: cause, y: totalHommes });
        }

        if (totalFemmes > 0) {
          femmesData.push({ x: cause, y: totalFemmes });
        }
      });

      this.chartOptions3.series = [
        {
          name: 'Hommes',
          data: hommesData
        },
        {
          name: 'Femmes',
          data: femmesData
        }
      ];

      this.chartOptions3.colors = ['#cbcbcb', '#b680fb']; // Couleurs pour le treemap
      this.cdr.detectChanges();
    }, error => {
      console.error('Erreur lors de la récupération des données pour le graphique 3!', error);
    });

    // Récupérer les données pour le quatrième graphique
    this.apiService.getCausesParSexe().subscribe((data: any[]) => {
      console.log('CausesDeces Data:', data);

      const hommesData: { x: string, y: number }[] = [];
      const femmesData: { x: string, y: number }[] = [];

      const causes = [...new Set(data.map(d => d.cause))]
        .filter(cause => causesInclusion2.includes(cause));

      causes.forEach(cause => {
        const totalHommes = data
          .filter(d => d.cause === cause && d.Sexe === 'Homme')
          .reduce((sum, d) => sum + d.total_deces, 0);

        const totalFemmes = data
          .filter(d => d.cause === cause && d.Sexe === 'Femme')
          .reduce((sum, d) => sum + d.total_deces, 0);

        if (totalHommes > 0) {
          hommesData.push({ x: cause, y: totalHommes });
        }

        if (totalFemmes > 0) {
          femmesData.push({ x: cause, y: totalFemmes });
        }
      });

      this.chartOptions4.series = [
        {
          name: 'Hommes',
          data: hommesData
        },
        {
          name: 'Femmes',
          data: femmesData
        }
      ];

      this.chartOptions4.colors = ['#cbcbcb', '#b680fb']; // Couleurs pour le treemap
      this.cdr.detectChanges();
    }, error => {
      console.error('Erreur lors de la récupération des données pour le graphique 4!', error);
    });
  }
}
