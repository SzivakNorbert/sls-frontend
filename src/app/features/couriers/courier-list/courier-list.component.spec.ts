import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierListComponent } from './courier-list.component';

describe('CourierListComponent', () => {
  let component: CourierListComponent;
  let fixture: ComponentFixture<CourierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
