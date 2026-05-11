import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deleteuser } from './deleteuser';

describe('Deleteuser', () => {
  let component: Deleteuser;
  let fixture: ComponentFixture<Deleteuser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deleteuser],
    }).compileComponents();

    fixture = TestBed.createComponent(Deleteuser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
