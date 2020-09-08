import { Component, OnInit } from '@angular/core';

import { CovidDataService } from '../../../services/covid-data.service';
import { CountriesCount } from '../../../models/covid';
import { StorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  // radio button chart data class setup
  caseClasses: string[] = ['Confirmed', 'Recovered', 'Dead'];
  caseClass: string;
  selectedClass = 'Confirmed';

  // chart data setup
  chartDataArray = [];
  worldData: CountriesCount[];
  title = '';
  columnNames = ['Country', 'Cases'];

  // angular-charts setup
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    height: 400,
    options: {
      animation: {
        duration: 500,
        easing: 'out',
      },
      is3D: true,
    },
  };

  countries: CountriesCount[];
  constructor(
    private dataService: CovidDataService,
    private storageService: StorageService
  ) {}

  getChartData(caseClass: string) {
    // console.log('started getChartData function with caseClass: ', caseClass);
    this.chartDataArray = [];
    this.worldData.forEach((cases) => {
      let country: string;
      let value: number;
      const confirmedThreshold = 600000;
      const recoveredThreshold = 400000;
      const deadThreshold = 30000;

      // Switch case to change between user-selected case class
      switch (caseClass) {
        case 'Confirmed':
          if (cases.totalConfirmed > confirmedThreshold) {
            country = cases.country;
            value = cases.totalConfirmed;
          }
          this.title = `Countries having more than ${confirmedThreshold} ${caseClass} cases`;
          break;

        case 'Recovered':
          if (cases.totalRecovered > recoveredThreshold) {
            country = cases.country;
            value = cases.totalRecovered;
          }
          this.title = `Countries having more than ${recoveredThreshold} ${caseClass} cases`;
          break;

        case 'Dead':
          if (cases.totalDeaths > deadThreshold) {
            country = cases.country;
            value = cases.totalDeaths;
          }
          this.title = `Countries having more than ${deadThreshold} deaths`;
          break;
      }

      if (country && value) {
        this.chartDataArray.push([country, value]);
        this.storageService.set("chartDataArray", this.chartDataArray);
      }
    });
  }

  ngOnInit(): void {
    this.dataService.getCountriesArrayData().subscribe({
      next: (result) => {
        this.storageService.set('storedCountriesArrayData', result);
        this.worldData = this.storageService.get('storedCountriesArrayData');
        this.getChartData('Confirmed');
      },
    });
  }
}
