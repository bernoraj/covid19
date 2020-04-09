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
  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {   
    this.dashboardService.getStats().subscribe(data=>{      
      this.tempData=data.data.covid19Stats;     
      this.lastcheck=new Date(data.data.lastChecked).toLocaleDateString();
   var test= _.chain(this.tempData).groupBy('country')
     .map(g => {
      return {
        name: g[0].country,
        confirmed: _.sumBy(g, 'confirmed'), 
        deaths: _.sumBy(g, 'deaths'),
        recovered:_.sumBy(g,'recovered')
      }
    }).value();
    this.covidData=test;
    this.sortByConfirmed=_.orderBy(test, ['confirmed'],['desc']);    
    this.sortByDeaths=_.orderBy(test, ['deaths'],['desc']);
    this.sortByRecovered=_.orderBy(test, ['recovered'],['desc']);
    
    });
   
   
    
  
  } 

}

class dataModel{

  Country:String;
  Confirmed:Number;
  Deaths:Number;
  Recovered:Number;

}
