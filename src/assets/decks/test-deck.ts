import {Deck} from "../../app/shared/models/deck";
import {
  BlightedTreant,
  ForestFire,
  JungleElf,
  TreetopSociety,
  Sawmill,
  Scout,
  SpiritWolf,
  GreenLair,
  WoodFactory,
  WoodlandHuntress,
  PrimalWrath,
  RootGolem,
  OpenWilderness,
  OvergrownTemple,
  BearBrute,
  TribeLeader,
  LeafDrake,
  Wetlands,
  StormValley
} from "../../app/shared/card";
import {Injectable} from "@angular/core";

@Injectable()
export class TestDeck {

  deck: Deck = {
    cards: [
      new Sawmill(),
      new WoodFactory(),
      new TreetopSociety(),
      new Scout(),
      new SpiritWolf(),
      new BlightedTreant(),
      new WoodlandHuntress(),
      new JungleElf(),
      new GreenLair(),
      new ForestFire(),
      new PrimalWrath(),
      new RootGolem(),
      new OpenWilderness(),
      new OvergrownTemple(),
      new BearBrute(),
      new TribeLeader(),
      new Sawmill(),
      new WoodFactory(),
      new TreetopSociety(),
      new Scout(),
      new SpiritWolf(),
      new BlightedTreant(),
      new WoodlandHuntress(),
      new JungleElf(),
      new GreenLair(),
      new ForestFire(),
      new PrimalWrath(),
      new RootGolem(),
      new OpenWilderness(),
      new OvergrownTemple(),
      new BearBrute(),
      new TribeLeader(),
      new LeafDrake(),
      new LeafDrake(),
      new Wetlands(),
      new Wetlands(),
      new StormValley(),
      new StormValley()
    ]
  }
}
