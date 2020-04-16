import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable, of, BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import { finalize, catchError } from 'rxjs/operators';
import { ChartDataSets } from 'chart.js';
import { Color, Label,BaseChartDirective} from 'ng2-charts';
import { MatSort } from '@angular/material/sort';


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
  hide='hidden';
  show='unset';
  covidData;
  sortByConfirmed;
  sortByDeaths;
  sortByRecovered;
  tempData;
  lastcheck;
  //final
  maleCount;
  femaleCount;
  recoveredCount=0;
  confirmedCount=0;
  deceasedCount=0;
  hospitalizedCount;
  //dashboard
  districtHeaderBlock='TamilNadu';
  dashConfirmedCount=0;
  dashDeathCount=0;
  dashRecoveredCount=0;

  dashTodayConfirmedCount=0;
  dashTodayDeathCount=0;
  dashTodayRecoveredCount=0;

  dashTodaysamples=0;
  dashTodaynegatives=0;
  dashTodayinprog=0;

  dashTodayventillators=0;
  dashTodaybeds=0;
  dashTodaycenters=0;

  //color block
  svgData=[];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  //chart
  lineChartData: ChartDataSets[] = [{data:[1,2,3],label:'Confirmed'}];

  lineChartLabels: Label[] = [];
  
  lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgb(255,0,0)',
      backgroundColor: 'white',
    }, 
    {
      borderColor: 'green',
      backgroundColor: 'white',
    }
  ];
  
  lineChartPlugins = [];
  lineChartType = 'line';

  chartFun()
  {
    var temp=[];
    var tempactive=[];
    dateblock.forEach(t=>{     
      this.lineChartLabels.push(t.date);
      temp.push(t.confirmed);
      tempactive.push(t.recovered);
    }); 
    this.lineChartData=[{data:temp,label:'Confirmed'},{data:tempactive,label:'Recovered'}];
   
  }


    Dashboard(){
      if(dateblock.length>0)
      {
        var todayDate=new Date().toLocaleDateString();
        var todaysData=dateblock.filter(x=>x.date==todayDate);

        this.dashConfirmedCount=datablock.reduce(function(acc,dd){ return acc+dd.confirmed},0);
        this.dashDeathCount=datablock.reduce(function(acc,dd){ return acc+dd.deceased},0);
        this.dashRecoveredCount=datablock.reduce(function(acc,dd){ return acc+dd.recovered},0);
        
        this.dashTodayConfirmedCount=todaysData.reduce(function(acc,dd){return acc+dd.confirmed},0);
        this.dashTodayDeathCount=todaysData.reduce(function(acc,dd){return acc+dd.deceased},0);
        this.dashTodayRecoveredCount=todaysData.reduce(function(acc,dd){return acc+dd.recovered},0);

      }      
    }

  //  FillColor(districtName){
  //   var redzone="#000000";
  //   var zone=this.datacolorBlock.filter(t=>t.district==districtName);
  //   console.log(districtName);
  //   console.log('zone',zone);
  //   if(zone!=null && zone.length>0)
  //   {
  //     var count=_.first(zone).confirmed;
  //     if(count>20)
  //     {
  //       return redzone;
  //     }
  //   }
  //   return 'none';
  //  } 

  Stats(districtHeaderBlock){
    this.districtHeaderBlock=districtHeaderBlock;
    if(districtHeaderBlock!='TamilNadu' && datablock!=[])
    {
        var stats=datablock.filter(t=>t.district==districtHeaderBlock);
        
        if(stats!=null && stats!=undefined && stats.length>0)
        {         
         this.confirmedCount = _.first(stats).confirmed;
         this.deceasedCount=_.first(stats).deceased;
         this.recoveredCount=_.first(stats).recovered;
        }
        else
        {
          this.confirmedCount=0;
          this.deceasedCount=0;
          this.recoveredCount=0;
        }
        
      
    }

  }

  displayedColumns = ['district', 'confirmed','active','recovered','deceased'];
  dataSource:ExampleDataSource;
  expandedElement: any;

  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getTNDistrict().subscribe(data=>{
      //console.log('DistrictData',data[0].districtData);
      var dataHandle=data[0].districtData;

    //   <a xlink:title="Thiruvallur" (mouseover)="Stats('Thiruvallur')">
    //   <path
    //     d="M392.7960730151344,37.91737027910631L387.4657957014442,37.91737027910631L384.0831197139105,39.44082725416547L382.5967923860553,45.68590850788678L382.8018030519652,48.680895362045476L377.5740310712308,47.7164519264968L373.62757575244177,47.56416757765919L373.37131242005216,49.39151126383467L370.1936470984301,49.03620613614771L368.3998037717065,47.15807090319663L365.8371704478186,46.599675912451175L360.7631564665162,47.868735236970906L361.2244304648166,50.051348669871004L356.7141958147704,55.786040141853164L353.3827724937137,55.430836332162016L350.6151285039141,54.1622054641457L350.3588651715254,50.40663767517208L347.8474845141136,48.6301362189904L347.69372651468075,45.736674345924484L344.0547871947574,46.19356168757804L343.3372498640674,44.92440706342177L343.18349186463456,35.733565855937286L339.4932998782333,36.44459560701944L339.2370365458437,34.819351148965325L335.3930865600114,32.83842280531144L333.9067592321553,37.66345060042886L328.47397658550835,38.42520090560561L323.91248926898606,37.86658657623366L320.78607661384103,38.22207005170458L320.2222972825839,41.116509082520906L318.06968529051755,42.3858808456157L316.58335796266147,38.52676563433715L313.71320863990513,41.42116491894899L313.9182193058168,43.553638865133735L307.87040466143753,45.38131105207026L305.10276067163704,43.2997836402069L303.41142267786927,39.745506088658885L305.66654000289145,40.710294800012434L307.3578779966592,39.034582297540055L310.5355433182822,39.034582297540055L309.71550065463725,35.98750767669367L312.8931659762611,33.447958151896955L316.3783472967507,33.752719512083786L318.32594862290534,31.263711847384002L318.27469595642924,29.28246396278996L315.1995359677603,28.876032090146964L314.78951463593876,23.744182608384335L313.45694530751643,20.99992828770678L321.9648879428287,19.678497743763728L325.65507992922994,20.237574272611482L325.91134326161955,26.234041668516966L328.8839979173317,27.45346135416571L331.7028945736092,24.811299699004394L337.4431932191219,25.522682222961976L338.57075188163253,28.774422948217307L341.59465920382263,31.263711847384002L342.82472319929,29.434873978699216L345.23359852374506,32.07647993583055L348.308758512414,28.977640762525425L343.0297338652017,25.929176159677127L345.95113585443505,22.4737373013013L348.00124251354646,24.303155186838694L350.25635983856864,22.067179221383185L360.3018824682167,19.068579740153154L362.65950512619474,16.57790411816063L361.0194197989049,12.460039531293432L363.99207445461616,12.002450819765727L363.8895691216612,8.443097620873914L367.01598177680626,7.629448972408909L368.70731977057403,4.425409414956221L368.8610777700069,2.136518183297312L373.1150490876644,3.2555620685568556L373.2175544206193,6.6632014113042715L379.11161106556574,6.459775363929566L386.1844790394998,7.019192383250129L387.619553700878,8.137982966284653L389.56715502703446,2.2737367544323206e-13L392.12978835092326,6.0529175187825786L394.9999376736805,10.629626739469586L396.7937810004023,22.372098489872315L396.69127566744646,25.573494377109L394.43615834242337,34.00668409837954Z"
    //   />
    // </a>
      var svgdata=this.SVGTemplate();

      svgdata.forEach(x=>{
          const zonedetails=dataHandle.filter(t=>t.district==x.title)[0];
          
          if(zonedetails.confirmed>23){
            x.zone="#FF0000";
          }
          else if(zonedetails.confirmed< 23 && zonedetails.confirmed >11)
          {
            x.zone="#FFFF00";
          }
          else{
            x.zone="#008000";
          }

          var template=`<a xlink:title="${x.title}" (mouseover)="Stats('${x.title}')">
          <path fill="${x.zone}" d="${x.d}"/> </a>`;


          this.svgData.push({template});

      });
      console.log(this.svgData);

    });

    this.dataSource = new ExampleDataSource(this.dashboardService);
    this.dataSource.loadCovidData();
    //this.dataSource.sort = this.sort;
    setTimeout(() => { 
      this.chartFun();  
      this.Dashboard();
      if(this.chart!=undefined){
        this.chart.chart.update()
      }   
      
    }, 2000);
    
    
    //console.log(this.dataSource);
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

  SVGTemplate(){

    const data=[
      {title:'Thiruvallur',d:'M392.7960730151344,37.91737027910631L387.4657957014442,37.91737027910631L384.0831197139105,39.44082725416547L382.5967923860553,45.68590850788678L382.8018030519652,48.680895362045476L377.5740310712308,47.7164519264968L373.62757575244177,47.56416757765919L373.37131242005216,49.39151126383467L370.1936470984301,49.03620613614771L368.3998037717065,47.15807090319663L365.8371704478186,46.599675912451175L360.7631564665162,47.868735236970906L361.2244304648166,50.051348669871004L356.7141958147704,55.786040141853164L353.3827724937137,55.430836332162016L350.6151285039141,54.1622054641457L350.3588651715254,50.40663767517208L347.8474845141136,48.6301362189904L347.69372651468075,45.736674345924484L344.0547871947574,46.19356168757804L343.3372498640674,44.92440706342177L343.18349186463456,35.733565855937286L339.4932998782333,36.44459560701944L339.2370365458437,34.819351148965325L335.3930865600114,32.83842280531144L333.9067592321553,37.66345060042886L328.47397658550835,38.42520090560561L323.91248926898606,37.86658657623366L320.78607661384103,38.22207005170458L320.2222972825839,41.116509082520906L318.06968529051755,42.3858808456157L316.58335796266147,38.52676563433715L313.71320863990513,41.42116491894899L313.9182193058168,43.553638865133735L307.87040466143753,45.38131105207026L305.10276067163704,43.2997836402069L303.41142267786927,39.745506088658885L305.66654000289145,40.710294800012434L307.3578779966592,39.034582297540055L310.5355433182822,39.034582297540055L309.71550065463725,35.98750767669367L312.8931659762611,33.447958151896955L316.3783472967507,33.752719512083786L318.32594862290534,31.263711847384002L318.27469595642924,29.28246396278996L315.1995359677603,28.876032090146964L314.78951463593876,23.744182608384335L313.45694530751643,20.99992828770678L321.9648879428287,19.678497743763728L325.65507992922994,20.237574272611482L325.91134326161955,26.234041668516966L328.8839979173317,27.45346135416571L331.7028945736092,24.811299699004394L337.4431932191219,25.522682222961976L338.57075188163253,28.774422948217307L341.59465920382263,31.263711847384002L342.82472319929,29.434873978699216L345.23359852374506,32.07647993583055L348.308758512414,28.977640762525425L343.0297338652017,25.929176159677127L345.95113585443505,22.4737373013013L348.00124251354646,24.303155186838694L350.25635983856864,22.067179221383185L360.3018824682167,19.068579740153154L362.65950512619474,16.57790411816063L361.0194197989049,12.460039531293432L363.99207445461616,12.002450819765727L363.8895691216612,8.443097620873914L367.01598177680626,7.629448972408909L368.70731977057403,4.425409414956221L368.8610777700069,2.136518183297312L373.1150490876644,3.2555620685568556L373.2175544206193,6.6632014113042715L379.11161106556574,6.459775363929566L386.1844790394998,7.019192383250129L387.619553700878,8.137982966284653L389.56715502703446,2.2737367544323206e-13L392.12978835092326,6.0529175187825786L394.9999376736805,10.629626739469586L396.7937810004023,22.372098489872315L396.69127566744646,25.573494377109L394.43615834242337,34.00668409837954Z',zone:''},
      {title:'Chennai',d:'M377.5740310712308,47.7164519264968L382.8018030519652,48.680895362045476L382.5967923860553,45.68590850788678L384.0831197139105,39.44082725416547L387.4657957014442,37.91737027910631L392.7960730151344,37.91737027910631L392.283546350357,42.43665420831621L389.157133695212,56.49643092964902L388.28583836508915,63.70055825049417L384.69815171164373,62.381664555563475L382.44303438662064,62.78748619011776L382.90430838492193,57.967883369445644L381.3667283905879,53.80697597987023L378.44532640135276,52.386001809372374Z'}
    ];
    
    return data;
    }

}
let datablock=[];
let dateblock=[];




export interface districtElement {
  district: string;
  city: Array<any>[];
  confirmed: number;
  deceased:number;
  recovered: number;
  active:number;
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
      console.log(dataPiped);

      var districtData = _.chain(dataPiped).groupBy('detecteddistrict')
        .map(g => {
          return {
            district: g[0].detecteddistrict,
            city: _.uniqBy(g, 'detectedcity').map(x => x.detectedcity).filter(t => t != "" && t != g[0].detecteddistrict),
            confirmed: g.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length,
            deceased: g.map(y => y.currentstatus).filter(y => y == 'Deceased').length,
            recovered: g.map(y => y.currentstatus).filter(y => y == 'Recovered').length,
            active:Math.abs(g.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length-(g.map(y => y.currentstatus).filter(y => y == 'Deceased').length+g.map(y => y.currentstatus).filter(y => y == 'Recovered').length))
          }
        }).value();
        
        var dated=_.chain(dataPiped).groupBy('dateannounced')
        .map(g => {
          return {
            date: g[0].dateannounced,               
            confirmed: g.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length,
            deceased: g.map(y => y.currentstatus).filter(y => y == 'Deceased').length,
            recovered: g.map(y => y.currentstatus).filter(y => y == 'Recovered').length,
            active:Math.abs(g.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length-(g.map(y => y.currentstatus).filter(y => y == 'Deceased').length+g.map(y => y.currentstatus).filter(y => y == 'Recovered').length))
          }
        }).value();

        console.log('dated',dated);
        var cityData =_.chain(dataPiped).groupBy('detectedcity')
        .map(c=>{
          return{
            cityName:c[0].detectedcity,
            confirmed: c.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length,
            deceased: c.map(y => y.currentstatus).filter(y => y == 'Deceased').length,
            recovered: c.map(y => y.currentstatus).filter(y => y == 'Recovered').length,
            active:Math.abs(c.map(y => y.currentstatus).filter(y => y == 'Hospitalized').length-(c.map(y => y.currentstatus).filter(y => y == 'Deceased').length+c.map(y => y.currentstatus).filter(y => y == 'Recovered').length))
          }
        }).value();
        //console.log('CityData',cityData);

       
        districtData.forEach(t=>{
          var cityDataTable=[];
          t.city.forEach(c=>{
            var temp=cityData.filter(x=>x.cityName==c);
            cityDataTable.push(temp[0]);
            
          })  

          //init
          var check=0;
          //find sum of hospitalized,deceased,confirmed
          var confirmedCount=  cityDataTable.reduce(function(acc,dd){ return acc+dd.confirmed},0);
          var deceasedCount= cityDataTable.reduce(function(acc,dd){ return acc+dd.deceased},0);
          var recoveredCount= cityDataTable.reduce(function(acc,dd){ return acc+dd.recovered},0);
          var activeCount= cityDataTable.reduce(function(acc,dd){ return acc+dd.active},0);

          var unknown={cityName:'Unknown',confirmed:0,active:0,deceased:0,recovered:0};
          if(confirmedCount!=t.confirmed)
          {
            check=1;
            unknown.confirmed=Math.abs(t.confirmed-confirmedCount);
          }
          if(activeCount!=t.active)
          {
            check=1;
            unknown.active=Math.abs(t.active-activeCount);
          }


          if(deceasedCount!=t.deceased)
          {
            check=1;
            unknown.deceased=Math.abs(t.deceased-deceasedCount);
          }

          if(recoveredCount!=t.recovered)
          {
            check=1;
            unknown.recovered=Math.abs(t.recovered-recoveredCount);
          }

          if(check==1)
          {
            cityDataTable.push(unknown);
            t.city=(cityDataTable);  
          }
          else{
            t.city=(cityDataTable); 
          }
                  
        });  
        datablock=(districtData);
        dateblock=dated;
        //console.log(datablock);
        this.covidData.next(districtData);
        
  })
  }
}