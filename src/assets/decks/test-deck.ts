import {Deck} from "../../app/shared/models/deck";
import {
  BlightedTreant,
  ForestFire,
  WoodlandsElven,
  TreetopSociety,
  Sawmill,
  WoodlandsScout,
  SpiritWolf,
  GreenLair,
  LogManufacturingPlant,
  WoodlandsHuntress,
  PrimalWrath,
  RootGolem,
  OpenWilderness,
  OvergrownTemple,
  BearBrute,
  TribeLeader,
  DawnDrake,
  Wetlands,
  StormValley,
  VerdantSanctuary,
  LostParadise,
  Terraform,
  SpiritDeer,
  SpiritDragon,
  WoodlandsScavenger,
  Terraduct,
  WoodlandsExile,
  FleshToSoil,
  ShadowSurge,
  GardenOfHope,
  ElderwoodProphet,
  Craftsmanship,
  ElderwoodDryad,
  ThicketSpawn,
  SpiritTree,
  JungleRebornRitual,
  JungleWyrm,
  WoodlandsApexPredator,
  SummonedSaplings,
  ANewBeginning,
  ElderwoodTreant, ElderwoodStag, SpiritCrows, Bioterror, WoodlandsWitch
} from "../../app/shared/card";
import {Injectable} from "@angular/core";

@Injectable()
export class TestDeck {

  deck: Deck = {
    cards: [
      new Sawmill(),
      new LogManufacturingPlant(),
      new TreetopSociety(),
      new WoodlandsScout(),
      new SpiritWolf(),
      new WoodlandsHuntress(),
      new WoodlandsElven(),
      new GreenLair(),
      new ForestFire(),
      new PrimalWrath(),
      new OpenWilderness(),
      new TribeLeader(),
      new Wetlands(),
      new StormValley(),
      new LostParadise(),
      new SpiritDeer(),
      new SpiritDragon(),
      new WoodlandsScavenger(),
      new WoodlandsExile(),
      new GardenOfHope(),
      new ElderwoodProphet(),
      new Craftsmanship(),
      new SpiritTree(),
      new JungleRebornRitual(),
      new SummonedSaplings(),
      new ANewBeginning(),
      new ElderwoodTreant(),
      new ElderwoodDryad(),
      new OvergrownTemple(),
      new DawnDrake(),
      new WoodlandsApexPredator(),
      new ElderwoodStag(),
      new SpiritCrows(),
      new VerdantSanctuary(),
      new Terraduct(),
      new Terraform(),
      new ThicketSpawn(),
      new BlightedTreant(),
      new BearBrute(),
      new RootGolem(),
      new JungleWyrm(),
      new Bioterror(),
      new WoodlandsWitch()
    ]
  }
}
