import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {TransferHttpCacheModule} from '@nguniversal/common';

import { AppComponent } from './app.component';
import { SimpleCheckersComponent } from './components/simple-checkers/simple-checkers.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BoardComponent } from './components/board/board.component';
import { CellComponent } from './components/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleCheckersComponent,
    ToolbarComponent,
    BoardComponent,
    CellComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'web-checkers'}),
    TransferHttpCacheModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
