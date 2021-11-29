import {Component, OnInit} from '@angular/core';
import {BackgroundService} from './workers/background.service';
import {initializeApp} from 'firebase/app';
import {environment} from '../environments/environment';
import {getAnalytics} from 'firebase/analytics';
import {getMessaging, getToken, onMessage} from 'firebase/messaging';

@Component({
  selector: 'smartstock-root',
  template: `
    <!--    <app-info></app-info>-->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {

  constructor(private readonly backgroundService: BackgroundService) {
  }

  async ngOnInit() {
    document.getElementById('splash12').style.display = 'none';
    this.firebaseInit();
    return this.backgroundService.start();
  }

  private firebaseInit(): void {
    const firebaseApp = initializeApp(environment.firebase);
    getAnalytics(firebaseApp);
    const messaging = getMessaging(firebaseApp);
    getToken(messaging, {
      vapidKey: 'BAjyuI_opZiVghN7ixIu7csRcOXNExhhjdfTU0CbUkKwXmc4v_C0X2KA8x5vFSPp3PHdI1-A6Bco-ReFMl7W9gw'
    }).then(value => {
      console.log(value);
    }).catch(console.log);
    onMessage(messaging, c => {
      // console.log(c, 'OM');
      const a = new Notification(c.notification.title, {
        body: c.notification.body,
        image: '/sslogo.png'
      });
      a.onclick = ev => {
        if (c.data.link) {
          window.location.replace(c.data.link);
        }
      };
    });
  }
}

