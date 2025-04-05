import { Component, OnInit, ViewChild } from '@angular/core';
import { Olympic } from '../../core/models/olympic';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { BaseChartDirective } from 'ng2-charts';
import { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public olympics$: Observable<Olympic[] | null> = of(null);
  public statistic = { numberOfJOs: 0, numberOfCountries: 0 };
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: { legend: { display: true, position: 'bottom' } },
    onClick: this.onChartClick.bind(this)
  };
  public pieChartData: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [] }] };
  public pieChartType: ChartConfiguration['type'] = 'pie';

  constructor(
    private readonly olympicService: OlympicService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  onChartClick(_: ChartEvent, activeElements: ActiveElement[]): void {
    if (activeElements.length > 0) {
      const index = activeElements[0].index;
      this.router.navigate(['/details', index]);
    }
  }

  private loadOlympicData(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      map(olympics => {
        if (olympics) {
          this.updateStatistics(olympics);
          this.updateChartData(olympics);
        }
      })
    ).subscribe();
  }

  private updateStatistics(olympics: Olympic[]): void {
    this.statistic = {
      numberOfJOs: olympics.reduce((acc, olympic) => acc + olympic.participations.length, 0),
      numberOfCountries: olympics.length,
    };
  }

  private updateChartData(olympics: Olympic[]): void {
    this.pieChartData = {
      labels: olympics.map(olympic => olympic.country),
      datasets: [{
        data: olympics.map(olympic => olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)),
      }]
    };
  }
}
