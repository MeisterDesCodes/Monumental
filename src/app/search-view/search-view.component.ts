import {Component} from '@angular/core';
import {Card} from "../shared/card";
import {GamestateHandler} from "../services/gamestate-handler";
import {GamestateType} from "../shared/enums/gamestate-type";
import {CardHandler} from "../services/card-handler";
import {CardAction} from "../shared/enums/card-action";
import {DeckHandler} from "../services/deck-handler";
import {PlayerHandler} from "../services/player-handler";
import {CardLocation} from "../shared/enums/card-location";

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent {

  allSearchCards: Card[] = [];
  inputValue: string = '';

  constructor(private gamestateHandler: GamestateHandler, private cardHandler: CardHandler,
              private deckHandler: DeckHandler, private playerHandler: PlayerHandler) { }

  getCards(): Card[] | null {
    return this.cardHandler.getActiveSearchCards();
  }

  isSearchActive(): boolean {
    return this.gamestateHandler.isValidGamestate([GamestateType.SEARCH]);
  }

  selectCard(card: Card): void {
    switch (this.cardHandler.getActiveSearchCardsAction()) {
      case CardAction.DRAW:
        switch(this.gamestateHandler.getGamestateLocation()) {
          case CardLocation.GRAVEYARD:
            this.cardHandler.addCardFromGraveyardToHand(card);
            break;
          case CardLocation.DECK:
            this.cardHandler.addCardFromDeckToHand(card);
            break;
        }
        break;
      case CardAction.DESTROY:
        this.cardHandler.sendCardFromFieldToGraveyard(card);
        break;
      case CardAction.DISCARD:
        this.cardHandler.discardCard(card);
        break;
      case CardAction.SUMMON:
      case CardAction.PLACE:
        switch(this.gamestateHandler.getGamestateLocation()) {
          case CardLocation.GRAVEYARD:
            this.cardHandler.addCardFromGraveyardToField(card);
            break;
          case CardLocation.HAND:
            this.cardHandler.addCardFromHandToField(card);
            break;
          default:
            this.cardHandler.addCardFromGraveyardToField(card);
        }
        break;
      case CardAction.MILL:
        this.cardHandler.millCard(card);
        break;
      default:
        break;
    }
    this.cardHandler.setActiveSearchCardsCount(this.cardHandler.getActiveSearchCardsCount() - 1);
    if (this.cardHandler.getActiveSearchCardsCount() >= 1) {
      let cards: Card[] = this.cardHandler.getActiveSearchCards()!;
      cards.splice(cards.indexOf(card), 1);
    }
    else {
      this.resetState();
      this.cardHandler.setSelectedSearchCards([card]);
      this.cardHandler.continueOrBreakChain();
    }
  }

  exitSearchView(): void {
    this.cardHandler.continueOrBreakChain();
    this.resetState();
  }

  resetState(): void {
    switch(this.cardHandler.getActiveCardAction()) {
      case CardAction.SUMMON:
        this.gamestateHandler.setGamestate(GamestateType.SUMMON);
        break;
      case CardAction.PLACE:
        this.gamestateHandler.setGamestate(GamestateType.PLACE);
        break;
      default:
        this.gamestateHandler.setGamestate(GamestateType.NORMAL);
        break;
    }
    this.cardHandler.setActiveSearchCards([]);
    this.cardHandler.setActiveSearchCardsAction(null);
    this.cardHandler.setActiveSearchCardsCount(0);
    this.playerHandler.getPlayers().forEach(player => this.deckHandler.shuffleDeck(player.deck));
    this.allSearchCards = [];
  }

  canExitSearchView(): boolean {
    return this.inputValue === '' && (this.cardHandler.getActiveSearchCards()!.length === 0 ||
      this.cardHandler.getActiveSearchCardsAction() === CardAction.DRAW ||
      this.cardHandler.getActiveSearchCardsAction() === CardAction.VIEW_GRAVEYARD ||
      this.cardHandler.getActiveSearchCardsAction() === CardAction.VIEW_DECK);
  }

  getDescription(): string {
    let description: string = this.cardHandler.getActiveSearchCardsAction()!
      if (this.cardHandler.getActiveSearchCardsCount() !== 0) {
        description += ' ' + this.cardHandler.getActiveSearchCardsCount();
      }
    description += ' card';
    if (this.cardHandler.getActiveSearchCardsCount() !== 1) {
      description += 's';
    }
    return description;
  }

  filterCards(text: string): void {
    this.inputValue = text;
    if (this.allSearchCards.length === 0) {
      this.allSearchCards = this.cardHandler.getActiveSearchCards();
    }
    this.cardHandler.setActiveSearchCards(this.allSearchCards.filter(
      card => card.name.toLowerCase().includes(text.toLowerCase()) ||
        card.description.toLowerCase().includes(text.toLowerCase())));
  }
}
