import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGenericComponent } from './tab-generic.component';

describe('TabGenericComponent', () => {
  let component: TabGenericComponent;
  let fixture: ComponentFixture<TabGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabGenericComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
