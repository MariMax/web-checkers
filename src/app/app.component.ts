import { GameManagerService } from './services/game-manager/game-manager.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'web-checkers-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private gameManager: GameManagerService) {
  }

  ngOnInit() {
    this.gameManager.initGame();
  }
}
