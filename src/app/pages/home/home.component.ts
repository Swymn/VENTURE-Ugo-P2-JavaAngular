import { Component, OnInit } from '@angular/core';
import { Olympic } from '../../core/models/olympic';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RenderedData } from '../../core/models/rendered-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public olympics$: Observable<Olympic[] | null> = of(null);
  public statistic = { numberOfJOs: 0, numberOfCountries: 0 };
  public pieChartData: RenderedData[] = [];

  constructor(
    private readonly olympicService: OlympicService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  onChartClick(event: { name: string, value: number }): void {
    this.router.navigate(['/details', event.name]);
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
      numberOfJOs: olympics
        .reduce((acc, olympic) => acc + olympic.participations.length, 0),
      numberOfCountries: olympics.length,
    };
  }

  private updateChartData(olympics: Olympic[]): void {
    this.pieChartData = olympics.map(olympic => ({
      value: olympic.participations
        .map((participation) => participation.medalsCount)
        .reduce((acc, medals) => acc + medals, 0),
      name: olympic.country,
    }));
  }
}
