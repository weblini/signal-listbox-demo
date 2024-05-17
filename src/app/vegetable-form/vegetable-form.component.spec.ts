import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetableFormComponent } from './vegetable-form.component';

describe('VegetableFormComponent', () => {
  let component: VegetableFormComponent;
  let fixture: ComponentFixture<VegetableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VegetableFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VegetableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
