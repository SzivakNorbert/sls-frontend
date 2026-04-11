import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAssignComponent } from './package-assign.component';

describe('PackageAssignComponent', () => {
  let component: PackageAssignComponent;
  let fixture: ComponentFixture<PackageAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageAssignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
