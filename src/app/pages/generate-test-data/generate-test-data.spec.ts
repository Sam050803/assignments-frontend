import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTestData } from './generate-test-data';

describe('GenerateTestData', () => {
  let component: GenerateTestData;
  let fixture: ComponentFixture<GenerateTestData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateTestData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateTestData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
