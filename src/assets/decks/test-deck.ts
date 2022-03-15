import {Deck} from "../../app/shared/deck";
import {
  BlightedTreant, JungleElf,
  MagicalTreehouses,
  Sawmill,
  Scout,
  SpiritWolf,
  WoodFactory,
  WoodlandHuntress
} from "../../app/shared/card";
import {Injectable} from "@angular/core";

@Injectable()
export class TestDeck {

  deck: Deck = {
    cards: [
      new Sawmill(),
      new Sawmill(),
      new Sawmill(),
      new WoodFactory(),
      new WoodFactory(),
      new WoodFactory(),
      new MagicalTreehouses(),
      new MagicalTreehouses(),
      new MagicalTreehouses(),
      new Scout(),
      new Scout(),
      new Scout(),
      new SpiritWolf(),
      new SpiritWolf(),
      new SpiritWolf(),
      new BlightedTreant(),
      new BlightedTreant(),
      new BlightedTreant(),
      new WoodlandHuntress(),
      new WoodlandHuntress(),
      new WoodlandHuntress(),
      new JungleElf(),
      new JungleElf(),
      new JungleElf()
    ]
  }
}
