import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appVersion: string | undefined;

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/ayat']);
  }

  async ngOnInit() {
    try {
      const info = await App.getInfo();
      this.appVersion = info.version;
    } catch (error) {
      console.error('Error retrieving app version:', error);
    }
  }
}
