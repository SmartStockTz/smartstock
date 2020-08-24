import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'smartstock-footer',
  template: `
    <footer class="pt-4 my-md-5 pt-md-5 border-top">
      <div class="row">
        <div class="col-12 col-md">
          <img class="mb-2" src="../../assets/img/ss_logo_black.svg" alt="" width="50">
          <small class="d-block mb-3 text-muted">© 2017-2020</small>
          <!--            <small class="d-block mb-3 text-muted">+255764943055</small>-->
          <!--            <small class="d-block mb-3 text-muted">mama27j@gmail.com</small>-->
        </div>
        <div class="col-6 col-md">
          <h5>Features</h5>
          <ul class="list-unstyled text-small">
            <li><a class="text-muted" href="#">Offline Support</a></li>
            <li><a class="text-muted" href="#">Data Sync</a></li>
            <li><a class="text-muted" href="#">Realtime Reports</a></li>
            <li><a class="text-muted" href="#">Desktop Apps</a></li>
            <li><a class="text-muted" href="#">Free Front Shop</a></li>
            <!--              <li><a class="text-muted" href="#">Last time</a></li>-->
          </ul>
        </div>
        <div class="col-6 col-md">
          <h5>Resources</h5>
          <ul class="list-unstyled text-small">
            <li>
              <a target="_blank" href="https://snapcraft.io/smartstock">
                <img alt="Get it from the Snap Store"
                     src="https://snapcraft.io/static/images/badges/en/snap-store-black.svg"/>
              </a>
            </li>
            <li style="margin-top: 4px">
              <a class="text-muted" target="_blank"
                 href="">
                <img style="background: black" width="182" alt="Download for windows"
                     src="/assets/img/window_badge.png">
              </a>
            </li>
            <!--        <li><a class="text-muted" href="#">MacOS Application</a></li>-->
            <li style="margin-top: 4px">
              <!--          <a class="text-muted" href="">Android Application</a>-->
              <a
                target="_blank"
                href='https://play.google.com/store/apps/details?id=com.fahamutech.smartstock&pcampaignid=
                pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                <img width="182" alt='Get it on Google Play'
                     style="background-color: black"
                     src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
              </a>
            </li>
            <!--        <li><a class="text-muted" href="#">iOS Application</a></li>-->
          </ul>
        </div>
        <div class="col-6 col-md">
          <h5>About</h5>
          <ul class="list-unstyled text-small">
            <li><a class="text-muted" href="#">Team</a></li>
            <li><a class="text-muted" href="#">Locations</a></li>
            <li><a class="text-muted" routerLink="/privacy">Privacy Policy</a></li>
            <li><a class="text-muted" href="#">Terms And Condition</a></li>
            <li><a class="text-muted" href="#">Community Responsibility</a></li>
          </ul>
        </div>
      </div>

      <div class="foo">
        <div class="row">
          <h6 class="col-12">+255 764 943 055</h6>
          <h6 class="col-12">smartstocktz@gmail.com</h6>
          <div class="col-md-6 text-right">
          </div>
        </div>
      </div>

    </footer>
  `,
  styleUrls: ['../styles/footer.style.css']
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
