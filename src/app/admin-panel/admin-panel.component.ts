import {Component} from '@angular/core';
import {CardHandler} from "../services/card-handler";
import {PlayerHandler} from "../services/player-handler";
import {ElementType} from "../shared/enums/element-type";
import {MusicHandler} from "../services/music-handler";
import {SearchHandler} from "../services/search-handler";
import {CardLocation} from "../shared/enums/card-location";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  constructor(private cardHandler: CardHandler, private playerHandler: PlayerHandler,
              private musicHandler: MusicHandler, private searchHandler: SearchHandler) { }

  drawCard(): void {
    this.cardHandler.drawCards(this.playerHandler.getCurrentPlayer(), 1);
  }

  gainElement(): void {
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.WOOD, amount: 2});
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.FIRE, amount: 2});
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.STORM, amount: 2});
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.OCEAN, amount: 2});
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.DAWN, amount: 2});
    this.cardHandler.gainElement(this.playerHandler.getCurrentPlayer(), {type: ElementType.SHADOW, amount: 2});
  }

  playMainTheme(): void {
    this.musicHandler.playAudio('../../assets/music/Main Theme (Agni Kai).mp3');
  }

  addCard(): void {
    this.searchHandler.drawCards(this.playerHandler.getCurrentPlayer(), CardLocation.DECK, 1, null);
  }
}
