import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ApiService } from '../api.service'; // Ajustez le chemin si nécessaire
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexPlotOptions,
  ApexFill,
  ApexLegend,
  ApexTitleSubtitle,
  ChartComponent,
  ApexGrid,
  ApexOptions,

} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  labels?: string[];
  title: ApexTitleSubtitle;
  grid: ApexGrid;

};
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.css'
})
export class GeneralComponent {

  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('div4') ageGroupPercentageChart!: ElementRef;
  public chartOptionsTotalDeces: any;
  public chartOptionsDecesParClasseAge: any;
  public chartOptionsTopCauses: any;
  public chartOptionsAgeGroupPercentage: any;

  selectedYear: number = 0;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    //premier graphique
    this.chartOptionsTotalDeces = {
      series: [{
        name: "Total Décès",
        data: []
      }],
      chart: {
        height: 200,
        type: "bar",
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const year = this.chartOptionsTotalDeces.xaxis.categories[config.dataPointIndex];
            this.loadTopCausesByYear(year);
            this.clearAgeGroupPercentageChart();
          }
        }
      },
      fill: {
        colors: ['#9b2be5']
      },
      plotOptions: {
        bar: {
          dataLabels: {

          },
          borderRadius: 6,
        }
      },
      title: {
        text: "Nombre Total de Décès par Année",
      },
      subtitle: {
        text: 'Clic sur les barres pour générer le graphique suivant',
        align: 'center',
      },
      xaxis: {
        position: 'top',
        categories: [],
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            chart: {
              height: 250,
            },
            xaxis: {
              labels: {
                rotate: -45,
              }
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 200,
            },
            xaxis: {
              labels: {
                show: false,
              }
            }
          }
        }
      ]
    };


    this.chartOptionsDecesParClasseAge = {
      series: [],
      chart: {
        height: 200,
        type: "line",
      },
      title: {
        text: "Nombre de Décès - Âge / Année ",
        style: {
          fontSize: '12px' // Taille de la police pour le titre
        }
      },
      xaxis: {
        categories: [],

      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            chart: {
              height: 250,
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: '6px' // Taille de la police pour les labels de l'axe des x sur les petits écrans
                }
              }
            }
          }
        },
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 200,
            },
            xaxis: {
              labels: {
                show: false,
              }
            }
          }
        }
      ]
    };


     // troisieme graphique
     this.chartOptionsTopCauses = {
      series: [],
      chart: {
        height: 300,
        type: "donut",
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const cause = this.chartOptionsTopCauses.labels[config.dataPointIndex];
            this.onCauseSelected(cause);
          }
        }
      },
      fill: {
        colors: ['#9b2be5', '#b865e6', '#d193e5', '#e5c0e4', '#f7ece1']
      },
      markers: {
        colors: ['#9b2be5', '#b865e6', '#d193e5', '#e5c0e4', '#f7ece1']
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        hideEmptySeries: true,
        fillSeriesColor: false,
        theme: false,
        style: {
          fontSize: '12px',
          fontFamily: undefined
        },
        marker: {
          show: false,
        },
      },
      title: {
        text: "Top 5 - Causes de Décès / Année",
        style: {
          fontSize: '10px',

        }
      },
      labels: [],
      


    };


    // quatrieme graphique

    this.chartOptionsAgeGroupPercentage = {
      series: [],
      chart: {
        height: 200,
        type: "pie"
      },
      title: {
        text: "Pourcentage de Décès par Tranche d'Âge pour la Cause Sélectionnée",
        style: {
          fontSize: '10px'
        }
      },
      labels: [],
      fill: {
        colors: ['#9b2be5', '#b865e6', '#d193e5', '#e5c0e4', '#f7ece1']
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        hideEmptySeries: true,
        fillSeriesColor: false,
        theme: false,
        style: {
          fontSize: '12px',
          fontFamily: undefined
        },
        marker: {
          show: false,
        },
      },
      markers: {
        colors: ['#9b2be5', '#b865e6', '#d193e5', '#e5c0e4', '#f7ece1']
      }


    };
  }
  ngOnInit(): void {
    // PREMIER GRAPHIQUE = total des décès par années
    this.apiService.getTotalDecesParAnnee().subscribe(data => {
      console.log('TotalDecesParAnnee Data:', data);
      // données
      const years = data.map((item: any) => item.annee);
      const totalDeces = data.map((item: any) => item.total_deces);

      // chart
      if (years && totalDeces) {
        this.chartOptionsTotalDeces.series = [{
          name: "Total Décès",
          data: totalDeces
        }];
        this.chartOptionsTotalDeces.xaxis = {
          categories: years
        };
        this.cdr.detectChanges();
      } else {
        console.error('Invalid data for Total Deces Par Annee:', data);
      }
    }, error => {
      console.error('There was an error!', error);
    });


    // DEUXIEME GRAPHIQUE = decés par classe d'age
    this.apiService.getDecesParAge().subscribe(data => {
      console.log('DecesParClasseAge Data:', data);
      const years = [...new Set(data.map((item: any) => item.annee))];
      const ageClasses = [...new Set(data.map((item: any) => item.classe_age))];

      console.log(years, ageClasses);

      if (years && ageClasses) {
        const seriesData = ageClasses.map(ageClass => {
          return {
            name: ageClass,
            data: data.filter((item: any) => item.classe_age === ageClass).map((item: any) => item.deces_classe_age)
          };
        });

        this.chartOptionsDecesParClasseAge.series = seriesData;
        this.chartOptionsDecesParClasseAge.xaxis = {
          categories: years
        };
        this.cdr.detectChanges();
      } else {
        console.error('Invalid data for Deces Par Classe Age:', data);
      }
    }, error => {
      console.error('There was an error!', error);
    });
  }

  loadTopCausesByYear(year: number): void {
    this.selectedYear = year;
    this.apiService.getTopCausesByYear(year).subscribe(data => {
      console.log('TopCausesByYear Data:', data);
      const causes = data.map((item: any) => item.cause);
      const counts = data.map((item: any) => parseInt(item.count, 10));

      if (causes && counts) {
        this.chartOptionsTopCauses.series = counts;
        this.chartOptionsTopCauses.labels = causes;
        this.updateTopCausesTitle(year.toString());
        this.cdr.detectChanges();
      } else {
        console.error('Invalid data for Top Causes By Year:', data);
      }
    }, error => {
      console.error('There was an error!', error);
    });
  }

  onCauseSelected(cause: string): void {
    console.log('Selected cause:', cause, this.selectedYear);

    // 2e graphique
    this.apiService.getAgeGroupPercentageByCause(cause, this.selectedYear).subscribe({
      next: (data) => {
        console.log('AgeGroupPercentageByCause Data:', data);
        if (!Array.isArray(data)) {
          console.error('Expected an array but got:', data);
          return;
        }

        const ageGroups = data.map((item: any) => item.classe_age);
        const percentages = data.map((item: any) => item.total_deces);

        if (ageGroups.length > 0 && percentages.length > 0) {
          this.chartOptionsAgeGroupPercentage.series = percentages;
          this.chartOptionsAgeGroupPercentage.labels = ageGroups;
          this.updateAgeGroupPercentageChartTitle(cause);  // Mettre à jour le titre ici
          this.cdr.detectChanges();
        } else {
          console.error('Invalid data for Age Group Percentage By Cause:', data);
        }
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  updateAgeGroupPercentageChartTitle(cause: string): void {
    this.chartOptionsAgeGroupPercentage.title.text = `Décès causé par ${cause}`;
  }

  updateTopCausesTitle(year: string): void {
    this.chartOptionsTopCauses.title.text = `Top 5 - Causes de Décès par Tranche d'Âge en ${year}`
  }

  clearAgeGroupPercentageChart(): void {
    this.chartOptionsAgeGroupPercentage.series = [];
    this.chartOptionsAgeGroupPercentage.labels = [];
    this.chartOptionsAgeGroupPercentage.title.text = "Pourcentage de Décès par Tranche d'Âge pour la Cause Sélectionnée";  // Réinitialiser le titre
  }
}
