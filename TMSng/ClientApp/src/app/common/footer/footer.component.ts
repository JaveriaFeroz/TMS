import { Component, Input } from '@angular/core';
import { agFooter } from '../../helper/footer';
import { } from 'jasmine';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent  {
  @Input() items: agFooter;
  constructor() { }
  ngOnInit() {}
}
