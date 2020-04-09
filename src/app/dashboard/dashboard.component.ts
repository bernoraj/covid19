import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../dashboard.service'
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
//import Rx from 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {  
    
    
  //   this.dashboardService.getStats().subscribe(data=>{      
  //     this.tempData=data.data.covid19Stats;     
  //     this.lastcheck=new Date(data.data.lastChecked).toLocaleDateString();
  //  var test= _.chain(this.tempData).groupBy('country')
  //    .map(g => {
  //     return {
  //       name: g[0].country,
  //       confirmed: _.sumBy(g, 'confirmed'), 
  //       deaths: _.sumBy(g, 'deaths'),
  //       recovered:_.sumBy(g,'recovered')
  //     }
  //   }).value();
  //   this.covidData=_.slice(test,0,3);    
  //   this.sortByConfirmed=_.orderBy(test, ['confirmed'],['desc']).slice(0,3);    
  //   this.sortByDeaths=_.orderBy(test, ['deaths'],['desc']).slice(0,3);
  //   this.sortByRecovered=_.orderBy(test, ['recovered'],['desc']).slice(0,3);
    
  //   });
   
      
  this.dashboardService.getTNStats().subscribe(data=>{      
    this.tempData=data;

    //Gender Count     
    var countbyGender=_.countBy(this.tempData,{'gender':'M'});
    this.maleCount=countbyGender.true;
    this.femaleCount=countbyGender.false;

    //Recovered,Deceased,Hospitalized Count
    this.recoveredCount=_.countBy(this.tempData,{'currentstatus':'Recovered'}).true;
    this.deceasedCount=_.countBy(this.tempData,{'currentstatus':'Deceased'}).true;
    this.hospitalizedCount=_.countBy(this.tempData,{'currentstatus':'Hospitalized'}).true;

    //District-Wise 
    var districtData=_.chain(this.tempData).groupBy('detecteddistrict')
    .map(g=>{
      return{
        district:g[0].detecteddistrict,
        city:_.uniqBy(g,'detectedcity').map(x=>x.detectedcity).filter(t=>t!="" && t!=g[0].detecteddistrict),        
        hospitalized:g.map(y=>y.currentstatus).filter(y=>y=='Hospitalized').length,        
        deceased:g.map(y=>y.currentstatus).filter(y=>y=='Deceased').length,   
        recovered:g.map(y=>y.currentstatus).filter(y=>y=='Recovered').length,
        furter:g               
      }
    }).value();

    //Date-Wise
    var dateWise=_.chain(this.tempData).groupBy('dateannounced')
    .map(d=>{
      return{
        date:d[0].dateannounced

      }
    })

    // console.log('distHosp',districtData.reduce(function(acc,dd){ return acc+dd.hospitalized},0));
    // console.log('distDec',districtData.reduce(function(acc,dd){ return acc+dd.deceased},0));
    // console.log('distRec',districtData.reduce(function(acc,dd){ return acc+dd.recovered},0));

    console.log('Malecount',this.maleCount);
    console.log('femaleCount',this.femaleCount);
    console.log('recoveredCount',this.recoveredCount);
    console.log('deceasedCount',this.deceasedCount);
    console.log('hospitalizedCount',this.hospitalizedCount);
    console.log('District Data',districtData);
   
  
  });
    
  
  } 

}

class dataModel{

  Country:String;
  Confirmed:Number;
  Deaths:Number;
  Recovered:Number;

}
