import {Component, Input} from '@angular/core';
import {Card} from "../../shared/card";
import {GamestateHandler} from "../../services/gamestate-handler";
import {GamestateType} from "../../shared/gamestate-type";
import {CardHandler} from "../../services/card-handler";
import {CardAction} from "../../shared/card-action";
import {CardType} from "../../shared/card-type";
import {Player} from "../../shared/player";
import {PlayerHandler} from "../../services/player-handler";

@Component({
  selector: 'app-card-slot',
  templateUrl: './card-slot.component.html',
  styleUrls: ['./card-slot.component.css']
})
export class CardSlotComponent {

  @Input() card!: Card | null;
  @Input() rowType!: CardType;
  @Input() player!: Player;

  constructor(private gamestateHandler: GamestateHandler, private cardHandler: CardHandler,
              private playerHandler: PlayerHandler) { }

  performAction(): void {
    let activeCard = this.cardHandler.getActiveCard();
    let activeCardAction = this.cardHandler.getActiveCardAction();
    if (activeCard && activeCardAction) {
      switch (activeCardAction) {
        case CardAction.SUMMON:
          if (this.canSummonCard()) {
            this.cardHandler.summonCard(activeCard);
            this.cardHandler.payElementCost(activeCard);
            this.cardHandler.resetState();
            this.setCard(activeCard);
          }
          break;
        case CardAction.PLACE:
          if (this.canPlaceCard()) {
            this.cardHandler.placeCard(activeCard);
            this.cardHandler.payElementCost(activeCard);
            this.cardHandler.resetState();
            this.setCard(activeCard);
          }
          break;
        case CardAction.ATTACK:
          if (this.isAttackable()) {
            this.cardHandler.attackUnit(activeCard, this.card!);
          }
          break;
      }
    }
  }

  isUsable(): boolean {
    return this.canSummonCard() || this.canPlaceCard();
  }

  canSummonCard(): boolean {
    return !this.card &&
      this.gamestateHandler.isValidGamestate([GamestateType.SUMMON]) &&
      this.playerHandler.getCurrentPlayer() === this.player &&
      this.rowType === this.cardHandler.getActiveCard()!.type;
  }

  canPlaceCard(): boolean {
    return !this.card && this.cardHandler.getActiveCard()! &&
      this.gamestateHandler.isValidGamestate([GamestateType.PLACE]) &&
      this.playerHandler.getCurrentPlayer() === this.player &&
      this.rowType === this.cardHandler.getActiveCard()!.type;
  }

  isAttackable(): boolean {
    return this.card! && this.cardHandler.getActiveCard()! && this.card.type === CardType.UNIT &&
      this.gamestateHandler.isValidGamestate([GamestateType.ATTACK]) &&
      this.card.owner !== this.cardHandler.getActiveCard()!.owner;
  }

  setSelectedCard(card: Card) {
    this.getSelectedCard() !== card ? this.cardHandler.setSelectedCard(card) :
      this.cardHandler.setSelectedCard(null);
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }

  setCard(card: Card): void {
    this.card = card;
    this.card.slot = this;
  }
}
