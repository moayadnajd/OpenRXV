import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingMetadataComponent } from './mapping-metadata.component';

describe('MappingMetadataComponent', () => {
  let component: MappingMetadataComponent;
  let fixture: ComponentFixture<MappingMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
