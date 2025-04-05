import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OlympicService } from './core/services/olympic.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OlympicService
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  test('should load initial data on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('./assets/mock/olympic.json');
    expect(req.request.method).toEqual('GET');
    req.flush([{ id: 1, name: 'Olympic 1' }]);
  });

  test('should handle error when loading initial data on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne('./assets/mock/olympic.json');
    expect(req.request.method).toEqual('GET');
    req.flush('Error loading data', { status: 500, statusText: 'Server Error' });
  });
});
