import {Component, Input} from '@angular/core';
import {Card} from "../../shared/card";
import {GamestateHandler} from "../../services/gamestate-handler";
import {GamestateType} from "../../shared/enums/gamestate-type";
import {CardHandler} from "../../services/card-handler";
import {CardAction} from "../../shared/enums/card-action";
import {CardType} from "../../shared/enums/card-type";
import {Player} from "../../shared/player";
import {PlayerHandler} from "../../services/player-handler";
import {CardLocation} from "../../shared/enums/card-location";

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
            if (activeCard.location === CardLocation.HAND) {
              this.cardHandler.payElementCosts(activeCard);
            }
            this.cardHandler.resetState();
            this.cardHandler.summonCard(activeCard);
            this.setCard(activeCard);
          }
          break;
        case CardAction.PLACE:
          if (this.canPlaceCard()) {
            if (activeCard.location === CardLocation.HAND) {
              this.cardHandler.payElementCosts(activeCard);
            }
            this.cardHandler.resetState();
            this.cardHandler.placeCard(activeCard);
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

  update(): void {
    let elements: NodeListOf<Element> = document.querySelectorAll('.game-card-slot');
    elements.forEach(element => {
      if (element.classList.contains('usable') || element.classList.contains('attackable')) {
        element.parentElement!.classList.add('z-index-2');
      }
      else {
        element.parentElement!.classList.remove('z-index-2');
      }
    });
  }

  canSummonCard(): boolean {
    return !this.card && this.cardHandler.getActiveCard()! &&
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

  isUsable(): boolean {
    return this.canSummonCard() || this.canPlaceCard();
  }

  isAttackable(): boolean {
    return this.card! && this.cardHandler.getActiveCard()! && this.card.type === CardType.UNIT &&
      this.gamestateHandler.isValidGamestate([GamestateType.ATTACK]) &&
      this.card.owner !== this.cardHandler.getActiveCard()!.owner;
  }

  setSelectedCard(card: Card) {
    this.cardHandler.setSelectedCard(card);
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }

  setCard(card: Card): void {
    this.card = card;
    this.card.slot = this;
  }
}
