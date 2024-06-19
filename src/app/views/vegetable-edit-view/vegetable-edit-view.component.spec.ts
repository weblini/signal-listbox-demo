import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetableEditViewComponent } from './vegetable-edit-view.component';

describe('EditComponent', () => {
  let component: VegetableEditViewComponent;
  let fixture: ComponentFixture<VegetableEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VegetableEditViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VegetableEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
