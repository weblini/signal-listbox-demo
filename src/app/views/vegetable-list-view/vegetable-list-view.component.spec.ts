import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetableListViewComponent } from './vegetable-list-view.component';

describe('VegetableEditorComponent', () => {
  let component: VegetableListViewComponent;
  let fixture: ComponentFixture<VegetableListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VegetableListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VegetableListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
