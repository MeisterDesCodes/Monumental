import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CardComponent } from './card/card.component';
import { HandComponent } from './hand/hand.component';
import { ElementIconComponent } from './card/element-icon/element-icon.component';
import { CardSlotComponent } from './field/card-slot/card-slot.component';
import { HandCardActionsComponent } from './hand/hand-card-actions/hand-card-actions.component';
import {CardHandler} from "./services/card-handler";
import {Player} from "./shared/player";
import {PlayerHandler} from "./services/player-handler";
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import {PlayerElementsComponent} from "./playerElements/playerElements.component";
import {GamestateHandler} from "./services/gamestate-handler";
import {DeckHandler} from "./services/deck-handler";
import {FieldComponent} from "./field/field.component";
import {TestDeck} from "../assets/decks/test-deck";
import {GamephaseHandler} from "./services/gamephase-handler";
import { PhasesComponent } from './phases/phases.component';
import {AngularTiltModule} from "angular-tilt";

export let serviceInjector: Injector;

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    CardComponent,
    HandComponent,
    ElementIconComponent,
    FieldComponent,
    CardSlotComponent,
    HandCardActionsComponent,
    PlayerElementsComponent,
    AdminPanelComponent,
    PhasesComponent
  ],
  imports: [
    BrowserModule,
    AngularTiltModule
  ],
  providers: [
    DeckHandler,
    CardHandler,
    Player,
    PlayerHandler,
    GamestateHandler,
    TestDeck,
    GamephaseHandler
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(private injector: Injector) {
    serviceInjector = this.injector;
  }
}
