import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Olympic } from '../models/olympic';

@Injectable({
  providedIn: 'root'
})
export class OlympicService {

  private readonly olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private readonly olympicURl = './assets/mock/olympic.json';

  constructor(private readonly httpClient: HttpClient) { }

  loadInitialData(): Observable<Array<Olympic>> {
    return this.httpClient.get<Array<Olympic>>(this.olympicURl).pipe(
      tap((value) => this.olympics$.next(value))
    )
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
