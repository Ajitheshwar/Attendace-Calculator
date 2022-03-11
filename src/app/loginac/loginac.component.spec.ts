import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginacComponent } from './loginac.component';

describe('LoginacComponent', () => {
  let component: LoginacComponent;
  let fixture: ComponentFixture<LoginacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
