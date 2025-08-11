import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { CategoryService } from '../services/category.service'; // Import du service CategoryService
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
  selector: 'app-corps-os',
  templateUrl: './corps-os.component.html',
  styleUrls: ['./corps-os.component.css']
})
export class CorpsOsComponent implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsCauses: Partial<ChartOptions> | any;
  public chartOptionsBloc: Partial<ChartOptions> | any;
  public chartOptionsClassesByBloc: Partial<ChartOptions> | any;

  public causes_corps_os: string[] = [
    'Maladies de l\'appareil circulatoire',
    'Maladies de l\'appareil digestif',
    'Maladies de l\'appareil génito-urinaire',
    'Maladies de l\'appareil respiratoire',
    'Maladies de l\'oreille et de l\'apophyse mastoïde',
    'Maladies de la peau et du tissu cellulaire sous-cutané',
    'Maladies du système nerveux',
    'Tumeurs',
    'Maladies du système ostéo-articulaire, des muscles et du tissu conjonctif'
  ];

  selectedYear: number | undefined;
  causes_chapitre: string | undefined;
  causes_bloc: string | undefined;

  constructor(
    private apiService: ApiService,
    private categoryService: CategoryService, // Injection de CategoryService
    private cdr: ChangeDetectorRef
  ) {
    // HEATMAP
    this.chartOptionsCauses = {
      series: [],
      chart: {
        height: 300,
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
        text: 'Nombre de décès | Cause de mortalité (Chapitre) / An',
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              { from: 0, to: 10, color: '#cbcbcb', name: '0-10' },
              { from: 11, to: 50, color: '#e1cef7', name: '11-50' },
              { from: 51, to: 100, color: '#b680fb', name: '51-100' },
              { from: 101, to: 500, color: '#8b32ff', name: '101-500' }
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
      },
      legend: {
        position: 'top',
        show: true,
        markers: {
          fillColors: [],
          useSeriesColors: true
        }
      }
    };

    // BLOC
    this.chartOptionsBloc = {
      series: [],
      chart: {
        height: 350,
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
        labels: {
        show: true,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: ['#fff'],
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
        },
        offsetX: 0,
        offsetY: 0,
      },
        categories: [] // Initialisé dans loadBlocData
      },
      yaxis: {
        labels: {
          show: true,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,
          style: {
            colors: ['#fff'],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          },
          offsetX: 0,
          offsetY: 0,
        },
      },  
      title: {
        text: 'Nombre de décès | Cause de mortalité Précise (Bloc) / An',
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#fff',
        }
      },
      fill: {
        colors: ['#8b32ff']
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          dataLabels: {
            position: 'center'
          },
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true
        },
      },
      tooltip: {
        enabled: true,
        style: {
          color:['#000'],
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
        }
      },
      legend: {
        position: 'top'
      }
    };

    // CLASSE
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
          borderRadius: 3,
          endingShape: "rounded",
          horizontal: true,
          dataLabels: {
            position: 'center'
          },
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true
        }
      },
      tooltip: {
        enabled: true
      },
    };
  }

  ngOnInit(): void {
    this.apiService.getTotalDecesParChapitre().subscribe(
      (data: DecesData[]) => {
        console.log('Total Deces Par Chapitre Data:', data);

        // Map data for heatmap
        const seriesData = this.causes_corps_os.map(cause => ({
          name: cause,
          data: data
            .filter((d: DecesData) => d.chapitre === cause)
            .map((d: DecesData) => ({
              x: d.annee,
              y: d.total_deces
            }))
        }));

        const annees = [...new Set(data.map((d: DecesData) => d.annee))];
        const causes_chapitre = this.causes_corps_os;

        this.chartOptionsCauses.series = seriesData;
        this.chartOptionsCauses.xaxis.categories = annees;
        this.chartOptionsCauses.yaxis.categories = causes_chapitre;
        this.chartOptionsCauses.legend.markers.fillColors = ['#3ebfea'];
        this.chartOptionsCauses.legend.markers.useSeriesColors = true;
        
        this.cdr.detectChanges(); // Detect and apply changes
      },
      
      (error: HttpErrorResponse) => {
        console.error('Error fetching total deces par chapitre data:', error);
      }
    );
  }

  triggerOnCorpsClick(): void {
    this.categoryService.onCorpsClick();
  }

  loadBlocData(chapitre: string, year: number): void {
    this.apiService.getDecesParBlocEtClasse(chapitre, year).subscribe(
      (data: BlocData[]) => {
        console.log('Total Deces By Bloc Data:', data);

        const blocCategories = data.map((item: BlocData) => item['cause initiale: bloc']);
        const blocSeriesData = [
          {
            name: chapitre,
            data: data.map((item: BlocData) => ({x: item['cause initiale: bloc'], y: item.total_deces}))
          }
        ];

        this.selectedYear = year;
        this.causes_chapitre = chapitre;
        this.chartOptionsBloc.series = blocSeriesData;
        this.chartOptionsBloc.xaxis.categories = blocCategories;
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching total deces by bloc data:', error);
      }
    );
  }

  loadClassesByBlocData(bloc: string, year: number): void {
    this.apiService.getCausesParBloc(bloc, year).subscribe(
      (data: ClasseData[]) => {
        console.log('Total Deces By Classe Data:', data);

        const classeCategories = data.map((item: ClasseData) => item['cause initiale: classe']);
        const classeSeriesData = [
          {
            name: bloc,
            data: data.map((item: ClasseData) => ({x: item['cause initiale: classe'], y: item.total_deces}))
          }
        ];

        this.causes_bloc = bloc;
        this.chartOptionsClassesByBloc.series = classeSeriesData;
        this.chartOptionsClassesByBloc.xaxis.categories = classeCategories;
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching total deces by classe data:', error);
      }
    );
  }

  clearGraph(): void {
    this.chartOptionsBloc.series = [];
    this.chartOptionsClassesByBloc.series = [];
    this.cdr.detectChanges();
  }
}
