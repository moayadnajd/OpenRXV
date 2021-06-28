import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss'],
})
export class DocComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  image(image) {
    return environment.api + '/images/' + image;
  }
}
