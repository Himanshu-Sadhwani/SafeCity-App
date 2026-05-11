import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updateuser } from './updateuser';

describe('Updateuser', () => {
  let component: Updateuser;
  let fixture: ComponentFixture<Updateuser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updateuser],
    }).compileComponents();

    fixture = TestBed.createComponent(Updateuser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
