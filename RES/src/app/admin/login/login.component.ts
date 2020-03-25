import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    submit: new FormControl(''),
  });
  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    if (this.form.valid) {
      this.error="ok there is error"
      //this.submitEM.emit(this.form.value);
    }
  }
  @Input() error: string | null;


}
