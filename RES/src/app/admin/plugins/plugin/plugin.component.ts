import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {
  @Input() plugin: any = null;
  formdata: FormArray = new FormArray([]);
  @Output() onEdit: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.plugin.values)
      this.plugin.values.forEach(element => {
        console.log(element)
        this.addNew(element)
      });
    this.formdata.valueChanges.subscribe(d => this.onEdit.emit(this.formdata))


  }

  addNew(value = null) {
    let form = {};
    this.plugin.params.forEach(element => {
      if (value)
        form[element.name] = this.fb.control(value[element.name])
      else
        form[element.name] = this.fb.control('')
    });
    this.formdata.push(this.fb.group(form))

  }

  delete(index) {
    this.formdata.removeAt(index)
  }

}
