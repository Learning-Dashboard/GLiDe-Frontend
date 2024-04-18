import { TestBed } from '@angular/core/testing';

import { LearningdashboardService } from './learningdashboard.service';

describe('LearningdashboardService', () => {
  let service: LearningdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
