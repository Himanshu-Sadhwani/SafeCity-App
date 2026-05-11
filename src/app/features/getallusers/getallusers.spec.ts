import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Getallusers } from './getallusers';

describe('Getallusers', () => {
  let component: Getallusers;
  let fixture: ComponentFixture<Getallusers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Getallusers],
    }).compileComponents();

    fixture = TestBed.createComponent(Getallusers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
