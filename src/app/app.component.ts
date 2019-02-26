import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup, Validators, FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';

  weatherQueryForm: FormGroup;
  region: string;
  metric: string;
  startDate: string;
  endDate: string;

  regions: string[] = ['England', 'UK', 'Scotland', 'Wales'];
  metrics: string[] = ['Tmax', 'Tmin', 'Rainfall'];
  chart : Chart;
  other = [];
  error: any = { isError: false, errorMessage: '' };

  constructor(private _weather: WeatherService, private fb: FormBuilder) {
    this.weatherQueryForm = fb.group({
      'region': [null, Validators.required],
      'metric': [null, Validators.required],
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    if (new Date(this.weatherQueryForm.value.startDate) > new Date(this.weatherQueryForm.value.endDate)) {
      this.error = { isError: true, errorMessage: 'Start Date should be earlier than End Date' };
      console.log(this.error.errorMessage);
    }
    else {
      this.error = { isError: false, errorMessage: '' };
      let startdateobj = new Date(this.weatherQueryForm.value.startDate);
      let startmonth = startdateobj.getUTCMonth() + 1;
      let startyear = startdateobj.getUTCFullYear();
      let enddateobj = new Date(this.weatherQueryForm.value.endDate);
      let endmonth = enddateobj.getUTCMonth() + 1;
      let endyear = enddateobj.getUTCFullYear();
      let metric = this.weatherQueryForm.value.metric;
      let region = this.weatherQueryForm.value.region;

      this.filterJson(startmonth, startyear, endmonth, endyear, metric, region);
      console.log(form);
      console.log(startdateobj);
      console.log(enddateobj);
      }
  }

  filterJson(startmonth, startyear, endmonth, endyear, metric, region) {
    console.log('in filter json method');
    console.log("Start Date :- " + startmonth + "/" + startyear + " End Date :- " + endmonth + "/"
      + endyear + " Metric :- " + metric + " Region :- " + region);
    this._weather.weatherForecast(metric, region)
      .subscribe(res => {
        let { year_dataset, value_dataset, month_dataset } = this.createDatasets(res);
        year_dataset.filter(res => res);
        this.drawChart(year_dataset, value_dataset, month_dataset, metric);
      });
  }

  private drawChart(year_dataset: any[], value_dataset: any[], month_dataset: any[],metric) {
    if (this.chart != null) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: year_dataset,
        datasets: [
          {
            label: metric,
            data: value_dataset,
            borderColor: "#3cba9f",
            fill: true
          },
          {
            label: 'Month',
            data: month_dataset,
            borderColor: "#ffcc00",
            fill: true
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

  private createDatasets(res: Object) {
    
    let jsonArray: any = res;
    let year_dataset = [];
    let month_dataset = [];
    let value_dataset = [];
    for (let i = 0; i < jsonArray.length; i++) {
      year_dataset.push(res[i].year);
      month_dataset.push(res[i].month);
      value_dataset.push(res[i].value);
    }
    return { year_dataset, value_dataset, month_dataset };
  }
}
