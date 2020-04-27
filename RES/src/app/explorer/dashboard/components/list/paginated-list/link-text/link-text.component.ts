import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ESSource } from 'src/app/explorer/filters/services/interfaces';
import { PaginatedListConfigs } from 'src/app/explorer/configs/generalConfig.interface';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-link-text',
  templateUrl: './link-text.component.html',
  styleUrls: ['./link-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkTextComponent {
  objectKeys = Object.keys;
  
  @Input() source: ESSource;
  @Input() content: PaginatedListConfigs;
  baselink = environment.api
}
