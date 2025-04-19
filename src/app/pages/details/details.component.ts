import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from '../../core/models/olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { map } from 'rxjs/operators';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { RenderedData } from '../../core/models/rendered-data';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-details',
  imports: [
    RouterLink,
    CommonModule,
    NgxChartsModule,
    CardComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  public olympic$: Observable<Olympic[] | null> = of(null);
  public statistic = { numberOfEntries: 0, totalMedals: 0, totalNumberOfAthletes: 0, countryName: '' };
  public lineChartData: { name: string, series: RenderedData[] }[] = [];
  public xAxisLabel = 'Year';
  public yAxisLabel = 'Medals';
  public legendPosition: LegendPosition = LegendPosition.Below;
  public schemaColor: Color = {
    name: 'Country Color',
    domain: [
      '#0e7498',
    ],
    group: ScaleType.Ordinal,
    selectable: true,
  }

  constructor(
    private readonly olympicService: OlympicService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  private getCountryNameFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('countryName');
  }

  private loadOlympicData(): void {
    const countryName = this.getCountryNameFromRoute();
    this.olympic$ = this.olympicService.getOlympics();
    this.olympic$.pipe(
      map(olympics => {
        if (olympics) {
          const olympic = olympics.find(olympic => olympic.country === countryName);
          if (olympic) {
            this.updateStatistics(olympic);
            this.updateChart(olympic);
          } else {
            console.warn(`Olympic data for country ${countryName} not found.`);
            this.router.navigate(['/not-found']);
          }
        }
      })
    ).subscribe()
  }

  private updateStatistics(olympic: Olympic): void {
    this.statistic = {
      numberOfEntries: olympic.participations.length,
      totalMedals: olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0),
      totalNumberOfAthletes: olympic.participations.reduce((acc, participation) => acc + participation.athleteCount, 0),
      countryName: olympic.country
    };
  }

  private updateChart(olympic: Olympic): void {
    this.lineChartData = [{
      name: olympic.country,
      series: olympic.participations.map(participation => ({
        name: `${participation.year}`,
        value: participation.medalsCount
      }))
    }];
  }
}
