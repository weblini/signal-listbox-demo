import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegetableEditorComponent } from './vegetable-editor.component';

describe('VegetableEditorComponent', () => {
  let component: VegetableEditorComponent;
  let fixture: ComponentFixture<VegetableEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VegetableEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VegetableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
