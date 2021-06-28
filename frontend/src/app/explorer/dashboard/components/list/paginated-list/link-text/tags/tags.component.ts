import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  Numbers,
  Altmetric,
} from 'src/app/explorer/filters/services/interfaces';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent {
  @Input() label: string;
  @Input() labelData: any;
}
