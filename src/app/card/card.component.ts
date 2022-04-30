import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../shared/card';
import VanillaTilt from "vanilla-tilt";
import {CardType} from "../shared/enums/card-type";
import {CardHandler} from "../services/card-handler";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card!: Card;

  constructor(private cardHandler: CardHandler) { }

  ngOnInit(): void {
    VanillaTilt.init(document.querySelectorAll('.game-card') as any);
  }

  isUnit(card: Card): boolean {
    return card.type === CardType.UNIT;
  }

  getSelectedCard(): Card | null {
    return this.cardHandler.getSelectedCard();
  }
}
