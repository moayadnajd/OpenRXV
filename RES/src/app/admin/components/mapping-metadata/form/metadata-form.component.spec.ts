import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataForm } from './metadata-form.component';

describe('MetadataForm', () => {
  let component: MetadataForm;
  let fixture: ComponentFixture<MetadataForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
