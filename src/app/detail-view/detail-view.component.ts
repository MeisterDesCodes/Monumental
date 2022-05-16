import {Component} from '@angular/core';
import {Card} from "../shared/card";
import {DetailsHandler} from "../services/details-handler";

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent {

  constructor(private detailsHandler: DetailsHandler) { }

  getCurrentCard(): Card {
    return this.detailsHandler.getCurrentCard();
  }
}
