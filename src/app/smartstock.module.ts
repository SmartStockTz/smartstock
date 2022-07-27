import { NgModule} from "@angular/core";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "../environments/environment";
import { MatSliderModule } from "@angular/material/slider";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AppComponent } from "./app.component";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HttpClientModule } from "@angular/common/http";
import { MatNativeDateModule } from "@angular/material/core";
import { HammerModule } from "@angular/platform-browser";
import {
  ActiveShopGuard,
  AdminGuard,
  AuthenticationGuard,
  LibModule,
  ManagerGuard,
  NavigationService,
  PaymentGuard,
  SmartstockHttpAdapter,
  SyncsService
} from "smartstock-core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { ReportNavigationService } from "smartstock-reports";
import { SalesNavigationService } from "smartstock-sales";
import { StockNavigationService, StockService } from "smartstock-stocks";
import { PurchaseNavigationService } from "smartstock-purchases";
import { ExpenseNavigationService } from "smartstock-expense";
import { AccountsNavigationService } from "smartstock-accounts";
import { init } from "bfast";
import { InfoComponent } from "./components/info.component";
import { DatePipe } from "@angular/common";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("smartstock-web").then((mod) => mod.WebModule)
  },
  {
    path: "dashboard",
    canActivate: [
      PaymentGuard,
      AuthenticationGuard,
      AdminGuard,
      ActiveShopGuard
    ],
    loadChildren: () => import("smartstock-dashboard").then((mod) => mod.DashboardModule)
  },
  {
    path: "report",
    canActivate: [
      PaymentGuard,
      AuthenticationGuard,
      AdminGuard,
      ActiveShopGuard
    ],
    loadChildren: () =>
      import("smartstock-reports").then((mod) => mod.ReportsModule)
  },
  {
    path: "sale",
    canActivate: [AuthenticationGuard, ActiveShopGuard],
    loadChildren: () =>
      import("smartstock-sales").then((mod) => mod.SalesModule)
  },
  {
    path: "expense",
    canActivate: [PaymentGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () =>
      import("smartstock-expense").then((mod) => mod.ExpenseModule)
  },
  // {
  //   path: 'store',
  //   canActivate: [PaymentGuard, ManagerGuard, ActiveShopGuard],
  //   loadChildren: () => import('@smartstocktz/store').then(mod => mod.StoreModule)
  // },
  {
    path: "stock",
    canActivate: [AuthenticationGuard, ManagerGuard, ActiveShopGuard],
    loadChildren: () => import("smartstock-stocks").then((mod) => mod.StocksModule)
  },
  {
    path: "purchase",
    canActivate: [
      PaymentGuard,
      AuthenticationGuard,
      ManagerGuard,
      ActiveShopGuard
    ],
    loadChildren: () =>
      import("smartstock-purchases").then((mod) => mod.PurchasesModule)
  },
  {
    path: "account",
    loadChildren: () =>
      import("smartstock-accounts").then((mod) => mod.AccountModule)
  },
  {
    path: "home",
    redirectTo: ""
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];

@NgModule({
  declarations: [AppComponent, InfoComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
    LibModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    MatStepperModule,
    HttpClientModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule,
    MatNativeDateModule,
    HammerModule,
    MatDialogModule,
    MatButtonModule,
    MatBottomSheetModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class SmartstockModule {
  private isMaybeStockRunning = false;
  constructor(
    private readonly navigationService: NavigationService,
    private readonly salesNav: SalesNavigationService,
    private readonly reportNav: ReportNavigationService,
    private readonly stockNav: StockNavigationService,
    private readonly purchaseNav: PurchaseNavigationService,
    private readonly expenseNav: ExpenseNavigationService,
    private readonly accountNav: AccountsNavigationService,
    private readonly stockService: StockService,
    private readonly smartstockHttp: SmartstockHttpAdapter,
    private readonly syncsService: SyncsService
  ) {
    // App.addListener("backButton", (e) => {
    //   if (e.canGoBack) {
    //     const curl = window.location.href;
    //     window.history.back();
    //     setTimeout(() => {
    //       if (curl === window.location.href) {
    //         App.exitApp();
    //       }
    //     }, 500);
    //   } else {
    //     App.exitApp();
    //   }
    // });
    // @ts-ignore
    import("../../package.json").then((pkg) => {
      this.navigationService.versionName = pkg.version;
    });
    this.smartstockInit();
    this.menus();
  }

  private smartstockInit(): void {
    init({
      applicationId: "smartstock_lb",
      projectId: "smartstock",
      adapters: {
        // http: _3 => this.smartstockHttp
      }
    });
    init(
      {
        applicationId: "fahamupay",
        projectId: "fahamupay",
        appPassword: "paMnho3EsBF6MxHelep94gQW3nIODMBq8lG9vapX",
        adapters: {
          auth: "DEFAULT",
          cache: "DEFAULT",
          http: "DEFAULT"
        }
      },
      "fahamupay"
    );
    this.syncsService.startWorker().catch(console.log);
    // this.stockService.compactStockQuantity().catch(console.log);
    setInterval(()=>{
      if(this.isMaybeStockRunning===true){
        console.log('maybe stocks already running');
      }
      this.isMaybeStockRunning = true;
      this.stockService.maybeRefreshStocks().catch(console.log).finally(()=>{
        this.isMaybeStockRunning = false;
      });
    },300000);
  }

  private menus(): void {
    [
      {
        name: "Dashboard",
        link: "/dashboard",
        roles: ["admin"],
        icon: "dashboard",
        pages: []
      },
      {
        name: "Report",
        link: "/report",
        roles: ["admin"],
        icon: "table_chart",
        pages: []
      },
      {
        name: "Sale",
        link: "/sale",
        roles: ["*"],
        icon: "shop_front",
        pages: []
      },
      {
        name: "Purchase",
        link: "/purchase",
        roles: ["manager", "admin"],
        icon: "receipt",
        pages: []
      },
      {
        name: "Stock",
        link: "/stock",
        roles: ["manager", "admin"],
        icon: "store",
        pages: []
      },
      // {
      //   name: 'Store',
      //   link: '/store',
      //   roles: ['manager', 'admin'],
      //   icon: 'widgets',
      //   pages: []
      // },
      {
        name: "Expense",
        link: "/expense",
        roles: ["manager", "admin"],
        icon: "receipt",
        pages: []
      },
      {
        name: "Account",
        link: "/account",
        roles: ["*"],
        icon: "supervisor_account",
        pages: []
      },
      {
        name: "Mall",
        link: "/",
        roles: ["admin"],
        icon: "shopping_cart",
        pages: []
      }
    ].forEach((menu) => {
      this.navigationService.addMenu(menu);
    });
    this.reportNav.init();
    this.salesNav.init();
    this.stockNav.init();
    this.purchaseNav.init();
    this.expenseNav.init();
    this.accountNav.init();
    this.navigationService.selectedModuleName = "";
  }
}
