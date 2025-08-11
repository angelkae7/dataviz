import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexFill,
  ApexLegend,
  ApexTitleSubtitle,
  ChartComponent,
  ApexResponsive
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
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

interface DecesData {
  annee: number;
  chapitre: string;
  total_deces: number;
}

interface BlocData {
  'cause initiale: bloc': string;
  total_deces: number;
}
interface ClasseData {
  'cause initiale: classe': string;
  total_deces: number;
}

@Component({
  selector: 'app-quotidien',
  templateUrl: './quotidien.component.html',
  styleUrl: './quotidien.component.css'
})
export class QuotidienComponent  implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsCauses: Partial<ChartOptions> | any;
  public chartOptionsBloc: Partial<ChartOptions> | any;
  public chartOptionsClassesByBloc: Partial<ChartOptions> | any;

  public causes_corps_os: string[] = [
   'Maladies endocriniennes, nutritionnelles et métaboliques'
  ];

  selectedYear: number | undefined;
  causes_chapitre: string | undefined;
  causes_bloc:string |undefined;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    //HEATMAP
    this.chartOptionsCauses = {
      series: [],
      chart: {
        height: 180,
        type: 'heatmap',
        toolbar: { 
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
       
          
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const seriesIndex = config.seriesIndex;
            const dataPointIndex = config.dataPointIndex;
            const selectedYear = config.w.config.series[seriesIndex]?.data[dataPointIndex]?.x;
            const selectedChapter = config.w.config.series[seriesIndex]?.name;

            console.log('Data Point Selected:');
            console.log('Année:', selectedYear);
            console.log('Chapitre:', selectedChapter);

            if (selectedYear && selectedChapter) {
              this.loadBlocData(selectedChapter, selectedYear);
              this.clearGraph();
            }
          }
        }
      },
      xaxis: {
        categories: [] // Initialisé dans ngOnInit
      },
      yaxis: {
        categories: [], // Initialisé dans ngOnInit
        title: {
          text: 'Chapitre'
        }
      },
      title: {
        text: 'Nombre de décès | Cause de mortalité (Chapitre) / An'
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              { from: 0, to: 10, color: '#f7ece1', name: '0-10' },
              { from: 11, to: 50, color: '#dfb0e4', name: '11-50' },
              { from: 51, to: 100, color: '#ea84bb', name: '51-100' },
              { from: 101, to: 500, color: '#9b2be5', name: '101-500' }
            ],
          },
          radius: 2,
          useFillColorAsStroke: false,
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        shared: false,
        followCursor: false,
      },
      legend: {
        position: 'top',
        show: true,
        markers: {
          fillColors: ['#f7ece1', '#dfb0e4', '#ea84bb', '#9b2be5'],
          useSeriesColors: true
        }
      }
    };

    //BLOC
    this.chartOptionsBloc = {
      series: [],
      chart: {
        height: 300,
        type: 'bar',
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const seriesIndex = config.seriesIndex;
            const dataPointIndex = config.dataPointIndex;

            const selectedBloc = config.w.config.series[seriesIndex]?.data[dataPointIndex]?.x;
            const totalDeces = config.w.config.series[seriesIndex]?.data[dataPointIndex]?.y;
    
            console.log('Data Point Selected in BLOC');

            console.log('Bloc:', selectedBloc);
            console.log('Total Décès:', totalDeces);

            if (selectedBloc) {
              this.loadClassesByBlocData(selectedBloc, this.selectedYear!);
            }

    
          }
        }
      },
      xaxis: {
        categories: [] // Initialisé dans loadBlocData
      },
      title: {
        text: 'Nombre de décès | Cause de mortalité Précise (Bloc) / An'
      },
      fill: {
        colors: ['#9b2be5']
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true, // Indique que les barres doivent être horizontales
          dataLabels: {
            position: 'center' // Position des labels de données au-dessus des barres
          },
        }
      },
      dataLabels: {
        enabled: true
      },
      tooltip: {
        enabled: true
      },
      legend: {
        position: 'top'
      }
    };

    //CLASSE
    this.chartOptionsClassesByBloc = {
      series: [],
      chart: {
        height: 300,
        type: 'bar'
      },
      xaxis: {
        categories: [] // Initialisé lors du chargement des données
      },
      title: {
        text: 'Nombre de décès | Cause de mortalité Plus Précise (Classe) / An'
      },
      fill: {
        colors: ['#9b2be5']
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: true,
          dataLabels: {
            position: 'center'
          },
        }
      },
      dataLabels: {
        enabled: true
      },
      tooltip: {
        enabled: true
      },
      legend: {
        position: 'top'
      }
    };
  
  }

  ngOnInit(): void {
    //HEATMAP
    this.apiService.getTotalDecesParChapitre().subscribe(
      (data: DecesData[]) => {
        console.log('Total Deces Par Chapitre Data:', data);

        // Map data for heatmap
        const seriesData = this.causes_corps_os.map(cause => ({
          name: cause,
          data: data
            // Filter for the 9 chapters
            .filter((d: DecesData) => d.chapitre === cause)
            .map((d: DecesData) => ({
              x: d.annee,
              y: d.total_deces
            }))
        }));

        const annees = [...new Set(data.map((d: DecesData) => d.annee))];
        const causes_chapitre = this.causes_corps_os;

        console.log('Series complète for Heatmap:', seriesData);
        console.log('Années for Heatmap:', annees);
        console.log('Les causes for Heatmap:', causes_chapitre);

        if (seriesData.length > 0 && annees.length > 0 && causes_chapitre.length > 0) {
          this.chartOptionsCauses.series = seriesData;
          this.chartOptionsCauses.xaxis.categories = annees;
          this.chartOptionsCauses.yaxis.categories = causes_chapitre;
          this.cdr.detectChanges();
        } else {
          console.error('Invalid data for Total Deces Par Chapitre:', data);
        }
      }, error => {
        console.error('There was an error!', error);
      });
  }

  //BLOCMAP
  loadBlocData(causeChapitre: string, annee: number): void {
    this.selectedYear = annee;
    this.causes_chapitre = causeChapitre;
  
    this.apiService.getDecesParBlocEtClasse(causeChapitre, annee).subscribe(
      (datas: BlocData[]) => {
        if (datas && datas.length > 0) {
          // Préparer les données pour le graphique à barres
          const seriesData = [
            {
              name: 'Nombre de décès',
              data: datas.map((d: BlocData) => ({
                x: d['cause initiale: bloc'],
                y: d.total_deces
              }))
            }
          ];
  
          const blocs = datas.map((d: BlocData) => d['cause initiale: bloc']);
  
          this.chartOptionsBloc.series = seriesData;
          this.chartOptionsBloc.xaxis.categories = blocs;
  
          // Charger les données des classes pour le bloc sélectionné
         
  
          this.cdr.detectChanges();
        } else {
          console.warn('No data available for the selected Cause Chapitre and Year.');
        }
      },
      error => {
        console.error('Error fetching bloc data', error);
      }
    );
  }

  loadClassesByBlocData(bloc: string, annee: number): void {
    this.selectedYear = annee;
    this.causes_bloc= bloc;
    console.log(annee, this.causes_bloc)

    this.apiService.getCausesParBloc(bloc, annee).subscribe(
      (datas: ClasseData[]) => {
        console.log('Classes Data:', datas);
  
        if (datas && datas.length > 0) {
          const seriesData = [
            {
              name: 'Nombre de décès',
              data: datas.map((d: ClasseData) => ({
                x: d['cause initiale: classe'],
                y: d.total_deces
              }))
            }
          ];
  
          const classes = datas.map((d: ClasseData) => d['cause initiale: classe']);
  
          this.chartOptionsClassesByBloc.series = seriesData;
          this.chartOptionsClassesByBloc.xaxis.categories = classes;
          this.cdr.detectChanges();
        } else {
          console.warn('No data available for the selected Bloc and Year.');
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // Check if the error is related to JSON parsing
          if (error.error instanceof ProgressEvent) {
            console.error('Network error or response not available');
          } else {
            console.error('API error:', error.error);
          }
        } else {
          console.error('Unexpected error:', error);
        }
      }
    );
  }
  clearGraph(): void {
    this.chartOptionsClassesByBloc.series = [];
    this.chartOptionsClassesByBloc.labels = [];
    this.chartOptionsClassesByBloc.title.text = "Pourcentage de Décès par Tranche d'Âge pour la Cause Sélectionnée";  // Réinitialiser le titre
  }
}
