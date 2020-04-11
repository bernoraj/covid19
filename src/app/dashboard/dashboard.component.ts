import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service'
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable, of, BehaviorSubject} from 'rxjs';
//import Rx from 'rxjs/Rx';
import * as _ from 'lodash';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
import { finalize, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  covidData;
  sortByConfirmed;
  sortByDeaths;
  sortByRecovered;
  tempData;
  lastcheck;
  //final
  maleCount;
  femaleCount;
  recoveredCount;
  confirmedCount;
  deceasedCount;
  hospitalizedCount;

  displayedColumns = ['district', 'hospitalized', 'deceased','recovered'];
  dataSource:ExampleDataSource;
  expandedElement: any;

  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {

    this.dataSource = new ExampleDataSource(this.dashboardService);
    this.dataSource.loadCovidData();
    console.log(this.dataSource);
    // this.dashboardService.getTNStats().subscribe(data=>{      
    //   this.tempData=data;

    //   //Gender Count     
    //   var countbyGender=_.countBy(this.tempData,{'gender':'M'});
    //   this.maleCount=countbyGender.true;
    //   this.femaleCount=countbyGender.false;

    //   //Recovered,Deceased,Hospitalized Count
    //   this.recoveredCount=_.countBy(this.tempData,{'currentstatus':'Recovered'}).true;
    //   this.deceasedCount=_.countBy(this.tempData,{'currentstatus':'Deceased'}).true;
    //   this.hospitalizedCount=_.countBy(this.tempData,{'currentstatus':'Hospitalized'}).true;

    //   //District-Wise 
    //   var districtData=_.chain(this.tempData).groupBy('detecteddistrict')
    //   .map(g=>{
    //     return{
    //       district:g[0].detecteddistrict,
    //       city:_.uniqBy(g,'detectedcity').map(x=>x.detectedcity).filter(t=>t!="" && t!=g[0].detecteddistrict),        
    //       hospitalized:g.map(y=>y.currentstatus).filter(y=>y=='Hospitalized').length,        
    //       deceased:g.map(y=>y.currentstatus).filter(y=>y=='Deceased').length,   
    //       recovered:g.map(y=>y.currentstatus).filter(y=>y=='Recovered').length,
    //       furter:g               
    //     }
    //   }).value();

    //   //Date-Wise
    //   var dateWise=_.chain(this.tempData).groupBy('dateannounced')
    //   .map(d=>{
    //     return{
    //       date:d[0].dateannounced

    //     }
    //   })

    //   // console.log('distHosp',districtData.reduce(function(acc,dd){ return acc+dd.hospitalized},0));
    //   // console.log('distDec',districtData.reduce(function(acc,dd){ return acc+dd.deceased},0));
    //   // console.log('distRec',districtData.reduce(function(acc,dd){ return acc+dd.recovered},0));

    //   console.log('Malecount',this.maleCount);
    //   console.log('femaleCount',this.femaleCount);
    //   console.log('recoveredCount',this.recoveredCount);
    //   console.log('deceasedCount',this.deceasedCount);
    //   console.log('hospitalizedCount',this.hospitalizedCount);
    //   console.log('District Data',districtData);


    // });


  }

}


export interface districtElement {
  district: string;
  city: Array<any>[];
  hospitalized: number;
  deceased:number;
  recovered: number;
  detailRow:boolean;
}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  private covidData = new BehaviorSubject<districtElement[]>([]);
  private loadingCovidData = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingCovidData.asObservable();


  constructor(private dashboardService: DashboardService) {
    super();
  }
 
  connect(collectionViewer: CollectionViewer): Observable<districtElement[]> {
    return this.covidData.asObservable();  
  }

  disconnect(collectionViewer: CollectionViewer) { 
    this.covidData.complete();
    this.loadingCovidData.complete();
  }

  loadCovidData()
  {
    this.loadingCovidData.next(true);


    this.dashboardService.getTNStats().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingCovidData.next(false))
  )
  .subscribe(dataPiped => {
 
      var districtData = _.chain(dataPiped).groupBy('detecteddistrict')
        .map(g => {
          return {
            district: g[0].detecteddistrict,
            city: _.uniqBy(g, 'detectedcity').map(x => x.detectedcity).filter(t => t != "" && t != g[0].detecteddistrict),
            hospitalized: g.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length,
            deceased: g.map(y => y.currentstatus).filter(y => y == 'Deceased').length,
            recovered: g.map(y => y.currentstatus).filter(y => y == 'Recovered').length,
            detailRow:_.uniqBy(g, 'detectedcity').map(x => x.detectedcity).filter(t => t != "" && t != g[0].detecteddistrict).length>0?true:false
          }
        }).value();
        
        this.covidData.next(districtData);
        
  })
  }
}