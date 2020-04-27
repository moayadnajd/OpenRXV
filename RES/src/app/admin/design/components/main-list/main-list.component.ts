import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss']
})
export class MainListComponent implements OnInit {
  @Output() edited: EventEmitter<any> = new EventEmitter()
  @Input() content: any = null;
  tagsControls = [];
  filterOptions = [];
  listForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    identifierUri: new FormControl(''),
    altmetric: new FormControl(''),
  });
  baseFilterOptions(element = null) {
    return {
      display: new FormControl(element ? element.display : ''),
      value: new FormControl(element ? element.value : ''),
      sort: new FormControl(element ? element.sort : '')
    }
  }
  baseTags(element = null) {
    return {
      metadata: new FormControl(element ? element.metadata : ''),
      disply_name: new FormControl(element ? element.disply_name : ''),
    }
  }
  constructor() { }
  save() {
    if (this.listForm.valid)
      this.edited.emit(this.listForm.value)
    console.log(this.listForm.value);
  }
  ngOnInit(): void {
    console.log(this.content)
    if (this.content && this.content.tags)
      this.content.tags.forEach(element => {
        this.tagsControls.push(new FormGroup(this.baseTags(element)))
      });
    if (this.content && this.content.filterOptions)
      this.content.filterOptions.forEach(element => {
        this.filterOptions.push(new FormGroup(this.baseFilterOptions(element)))
      });
    if (this.tagsControls.length)
      this.listForm.addControl('tags', new FormArray(this.tagsControls))

    if (this.filterOptions.length)
      this.listForm.addControl('filterOptions', new FormArray(this.filterOptions))


    if (this.content)
      this.listForm.patchValue(this.content);


  }
  delete(type, index) {
    if (type == 'tags') {
      this.tagsControls.splice(index, 1)
      this.listForm.removeControl('tags');
      this.listForm.addControl('tags', new FormArray(this.tagsControls))
    } else {
      this.filterOptions.splice(index, 1)
      this.listForm.removeControl('filterOptions');
      this.listForm.addControl('filterOptions', new FormArray(this.filterOptions))
    }
  }
  AddNewdata(array, type) {
    if (type == 'tags') {
      this.tagsControls.push(new FormGroup(this.baseTags()))
      this.listForm.removeControl('tags');
      this.listForm.addControl('tags', new FormArray(this.tagsControls))
    } else {
      this.filterOptions.push(new FormGroup(this.baseFilterOptions()))
      this.listForm.removeControl('filterOptions');
      this.listForm.addControl('filterOptions', new FormArray(this.filterOptions))
    }
  }
}
