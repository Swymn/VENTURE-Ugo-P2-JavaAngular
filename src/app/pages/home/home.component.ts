import { Component, OnInit } from '@angular/core';
import { Olympic } from '../../core/models/olympic';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../../core/services/olympic.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  public olympics$: Observable<Olympic[] | null> = of(null);

  constructor(private readonly olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
