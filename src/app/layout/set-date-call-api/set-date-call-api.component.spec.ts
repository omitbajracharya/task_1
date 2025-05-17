import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDateCallApiComponent } from './set-date-call-api.component';

describe('SetDateCallApiComponent', () => {
  let component: SetDateCallApiComponent;
  let fixture: ComponentFixture<SetDateCallApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetDateCallApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetDateCallApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
