import { TestBed } from '@angular/core/testing';

import { OlympicService } from './olympic.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('OlympicService', () => {
  let service: OlympicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OlympicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should load data from api', () => {
    // GIVEN an API with a list of olympic games
    // WHEN the data is loaded
    const dataObservable = service.loadInitialData();

    // THEN the data should be loaded correctly
    dataObservable.subscribe({
      next: (data) => {
        expect(data.length).toBeGreaterThan(0);
      },
      error: (error) => {
        fail(`Expected data to be loaded, but got error: ${error}`);
      }
    });

    // MOCK the API response
    const request = httpMock.expectOne('./assets/mock/olympic.json');
    request.flush('Success', { status: 200, statusText: 'Success' });
  });

  test('shouldn\'t load load data from api', () => {
    // GIVEN an API with a list of olympic games
    // WHEN the data is loaded
    const dataObservable = service.loadInitialData();

    // THEN the data shouldn't be loaded correctly
    dataObservable.subscribe({
      next: (data) => {
        expect(data).toBeNull();
      },
      error: (error) => {
        fail(`Expected data to be null, but got: ${error}`);
      }
    });

    // MOCK the API response
    const request = httpMock.expectOne('./assets/mock/olympic.json');
    request.flush('Bad Request', { status: 400, statusText: 'Bad request' });
  });

  test('Should get olympics', () => {
    // GIVEN an API with a list of olympic games
    // WHEN we get the olympics
    const dataObservable = service.getOlympics();

    // THEN the data should be loaded correctly
    dataObservable.subscribe({
      next: (data) => {
        expect(data).toBeNull();
      },
      error: (error) => {
        fail(`Expected data to be loaded, but got error: ${error}`);
      }
    });
  });

  test('Should get olympics with data', () => {
    // GIVEN an API with a list of olympic games
    service.loadInitialData().subscribe();

    // WHEN we get the olympics
    const dataObservable = service.getOlympics();

    // THEN the data should be loaded correctly
    dataObservable.subscribe({
      next: (data) => {
        expect(data?.length).toBeGreaterThan(0);
      },
      error: (error) => {
        fail(`Expected data to be loaded, but got error: ${error}`);
      }
    });

    // MOCK the API response
    const request = httpMock.expectOne('./assets/mock/olympic.json');
    request.flush('Success', { status: 200, statusText: 'Success' });
  });
});
