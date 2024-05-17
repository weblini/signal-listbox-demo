import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVegetableBtnComponent } from './add-vegetable-btn.component';

describe('AddVegetableBtnComponent', () => {
  let component: AddVegetableBtnComponent;
  let fixture: ComponentFixture<AddVegetableBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVegetableBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVegetableBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
