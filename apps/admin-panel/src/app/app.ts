import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare const Telegram: any;

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'admin-panel';

  ngOnInit() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
      Telegram.WebApp.ready();
      Telegram.WebApp.expand();
    }
  }
}
