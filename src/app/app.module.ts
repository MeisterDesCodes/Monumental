import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GameBoardComponent} from './game-board/game-board.component';
import {CardComponent} from './card/card.component';
import {HandComponent} from './hand/hand.component';
import {ElementIconComponent} from './card/element-icon/element-icon.component';
import {CardSlotComponent} from './field/card-slot/card-slot.component';
import {CardActionsComponent} from './card/card-actions/card-actions.component';
import {CardHandler} from "./services/card-handler";
import {Player} from "./shared/player";
import {PlayerHandler} from "./services/player-handler";
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {PlayerElementsComponent} from "./player-panel/player-elements/player-elements.component";
import {GamestateHandler} from "./services/gamestate-handler";
import {DeckHandler} from "./services/deck-handler";
import {FieldComponent} from "./field/field.component";
import {TestDeck} from "../assets/decks/test-deck";
import {GamephaseHandler} from "./services/gamephase-handler";
import {PhasesComponent} from './player-panel/phases/phases.component';
import {AngularTiltModule} from "angular-tilt";
import {StatsIconComponent} from './card/stats-icon/stats-icon.component';
import {UnitHandler} from "./services/unit-handler";
import {GraveyardComponent} from './field/graveyard/graveyard.component';
import {DeckComponent} from './field/deck/deck.component';
import {PlayerComponent} from './player-panel/player/player.component';
import {PlayerPanelComponent} from './player-panel/player-panel.component';
import {SearchViewComponent} from './search-view/search-view.component';
import {SearchHandler} from "./services/search-handler";
import {MatGridListModule} from '@angular/material/grid-list';
import {MusicHandler} from "./services/music-handler";
import {DetailViewComponent} from './detail-view/detail-view.component';
import {DetailsHandler} from "./services/details-handler";

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
    CardActionsComponent,
    PlayerElementsComponent,
    AdminPanelComponent,
    PhasesComponent,
    StatsIconComponent,
    GraveyardComponent,
    DeckComponent,
    PlayerComponent,
    PlayerPanelComponent,
    SearchViewComponent,
    DetailViewComponent
  ],
  imports: [
    BrowserModule,
    AngularTiltModule,
    MatGridListModule
  ],
  providers: [
    DeckHandler,
    CardHandler,
    Player,
    PlayerHandler,
    GamestateHandler,
    GamephaseHandler,
    PhasesComponent,
    UnitHandler,
    SearchHandler,
    SearchViewComponent,
    MusicHandler,
    CardSlotComponent,
    DetailsHandler
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

  constructor(private injector: Injector) {
    serviceInjector = this.injector;
  }
}
