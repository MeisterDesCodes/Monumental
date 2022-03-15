import {Component} from '@angular/core';
import {CardHandler} from "../services/card-handler";
import {PlayerHandler} from "../services/player-handler";
import {ElementType} from "../shared/element-type";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  constructor(private cardHandler: CardHandler, private playerHandler: PlayerHandler) { }

  drawCard(): void {
    this.cardHandler.drawCards(this.playerHandler.getCurrentPlayer(), 1);
  }

  gainElement(): void {
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.WOOD, amount: 2});
  }
}
