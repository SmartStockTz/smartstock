(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{C4Ps:function(t,o,e){"use strict";e.r(o),e.d(o,"WebModule",(function(){return y}));var n=e("ofXK"),a=e("3Pt+"),r=e("fXoL"),c=e("tyNb"),i=e("f0Cb"),b=e("Wp6s"),s=e("5RNC"),l=e("kmnG"),u=e("d3UM"),d=e("FKr1"),p=function(){function t(){}return t.prototype.ngOnInit=function(){},t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=r.Gb({type:t,selectors:[["smartstock-footer"]],decls:64,vars:0,consts:[[1,"pt-4","my-md-5","pt-md-5","border-top"],[1,"row"],[1,"col-12","col-md"],["src","../../assets/img/ss_logo_black.svg","alt","","width","50",1,"mb-2"],[1,"d-block","mb-3","text-muted"],[1,"col-6","col-md"],[1,"list-unstyled","text-small"],["href","#",1,"text-muted"],["target","_blank","href","https://snapcraft.io/smartstock"],["alt","Get it from the Snap Store","src","https://snapcraft.io/static/images/badges/en/snap-store-black.svg"],[2,"margin-top","4px"],["target","_blank","href","",1,"text-muted"],["width","182","alt","Download for windows","src","/assets/img/window_badge.png",2,"background","black"],["target","_blank","href","https://play.google.com/store/apps/details?id=com.fahamutech.smartstock&pcampaignid=\n                pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"],["width","182","alt","Get it on Google Play","src","https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",2,"background-color","black"],["routerLink","/privacy",1,"text-muted"],[1,"foo"],[1,"col-12"],[1,"col-md-6","text-right"]],template:function(t,o){1&t&&(r.Sb(0,"footer",0),r.Sb(1,"div",1),r.Sb(2,"div",2),r.Nb(3,"img",3),r.Sb(4,"small",4),r.Ec(5,"\xa9 2017-2020"),r.Rb(),r.Rb(),r.Sb(6,"div",5),r.Sb(7,"h5"),r.Ec(8,"Features"),r.Rb(),r.Sb(9,"ul",6),r.Sb(10,"li"),r.Sb(11,"a",7),r.Ec(12,"Offline Support"),r.Rb(),r.Rb(),r.Sb(13,"li"),r.Sb(14,"a",7),r.Ec(15,"Data Sync"),r.Rb(),r.Rb(),r.Sb(16,"li"),r.Sb(17,"a",7),r.Ec(18,"Realtime Reports"),r.Rb(),r.Rb(),r.Sb(19,"li"),r.Sb(20,"a",7),r.Ec(21,"Desktop Apps"),r.Rb(),r.Rb(),r.Sb(22,"li"),r.Sb(23,"a",7),r.Ec(24,"Free Front Shop"),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Sb(25,"div",5),r.Sb(26,"h5"),r.Ec(27,"Resources"),r.Rb(),r.Sb(28,"ul",6),r.Sb(29,"li"),r.Sb(30,"a",8),r.Nb(31,"img",9),r.Rb(),r.Rb(),r.Sb(32,"li",10),r.Sb(33,"a",11),r.Nb(34,"img",12),r.Rb(),r.Rb(),r.Sb(35,"li",10),r.Sb(36,"a",13),r.Nb(37,"img",14),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Sb(38,"div",5),r.Sb(39,"h5"),r.Ec(40,"About"),r.Rb(),r.Sb(41,"ul",6),r.Sb(42,"li"),r.Sb(43,"a",7),r.Ec(44,"Team"),r.Rb(),r.Rb(),r.Sb(45,"li"),r.Sb(46,"a",7),r.Ec(47,"Locations"),r.Rb(),r.Rb(),r.Sb(48,"li"),r.Sb(49,"a",15),r.Ec(50,"Privacy Policy"),r.Rb(),r.Rb(),r.Sb(51,"li"),r.Sb(52,"a",7),r.Ec(53,"Terms And Condition"),r.Rb(),r.Rb(),r.Sb(54,"li"),r.Sb(55,"a",7),r.Ec(56,"Community Responsibility"),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Sb(57,"div",16),r.Sb(58,"div",1),r.Sb(59,"h6",17),r.Ec(60,"+255 764 943 055"),r.Rb(),r.Sb(61,"h6",17),r.Ec(62,"smartstocktz@gmail.com"),r.Rb(),r.Nb(63,"div",18),r.Rb(),r.Rb(),r.Rb())},directives:[c.d],styles:[".foo[_ngcontent-%COMP%]{background-color:#fff;margin-bottom:48px}.top-box[_ngcontent-%COMP%]{height:200px;padding:0 50px;margin:0}.top-box[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin:auto 0}.bottom-box[_ngcontent-%COMP%]{margin:0;padding:20px 50px;background-color:#fff}a[_ngcontent-%COMP%]{text-decoration:none;color:#000}"]}),t}(),g=function(){function t(t){this.router=t,this.currencyFormControl=new a.f("TZS"),this.totalProducts=1,this.totalSales=1,this.totalPurchases=1}return t.prototype.ngOnInit=function(){},t.prototype.login=function(){this.router.navigateByUrl("login").catch((function(t){console.log(t.toString())}))},t.prototype.formatLabel=function(t){return t>=1e3?Math.round(t/1e3)+"k":99990===t?"10k + ":t},t.prototype.monthlyCost=function(){var t=this.calculateBill(30,this.totalSales,this.totalPurchases,this.totalProducts,this.currencyFormControl.value),o="TZS"===this.currencyFormControl.value?15e4:65,e="TZS"===this.currencyFormControl.value?17e3:7;return t>o?o:t<e?e:t},t.prototype.actualMonthlyCost=function(){return this.calculateBill(30,this.totalSales,this.totalPurchases,this.totalProducts,this.currencyFormControl.value)},t.prototype.discount=function(){var t=this.calculateBill(30,this.totalSales,this.totalPurchases,this.totalProducts,this.currencyFormControl.value),o="TZS"===this.currencyFormControl.value?23e3:10;return t>o?t-o:0},t.prototype.calculateBill=function(t,o,e,n,a){var r="TZS"===a?2300:1;return 133333e-9*t*r*o+4e-4*t*r*e+3e-4*t*r*n+.01*t*r},t.\u0275fac=function(o){return new(o||t)(r.Mb(c.b))},t.\u0275cmp=r.Gb({type:t,selectors:[["smartstock-landing"]],decls:129,vars:19,consts:[[1,"navbar","position-sticky","navbar-expand-lg","navbar-light","bg-light",2,"top","0","z-index","10000"],["href","",1,"navbar-brand"],["id","navbarSupportedContent",1,"collapse","navbar-collapse"],[1,"navbar-nav","mr-auto"],[1,"nav-item"],["href","#why-us",1,"nav-link"],["href","#pricing",1,"nav-link"],[1,"flex-grow-1"],["routerLink","/account/login",1,"btn","btn-outline-success"],[2,"width","10px","height","10px"],["routerLink","/account/register",1,"btn","btn-outline-success"],[1,"header","d-flex","flex-column"],[1,"header-jumbo","flex-grow-1","container","d-flex","align-items-start","justify-content-center","flex-column"],[1,""],[2,"padding","10px"],["mat-flat-button","","color","primary","routerLink","/account/register",1,"header-btn"],["id","why-us",1,"why-smartstock",2,"padding-top","16px"],[1,"container"],[1,"row"],[1,"col-md-3","text-center"],["src","../../assets/img/everyWhere_icon.png"],["src","../../assets/img/\u201c99.9%25\u201d.png","width","50%",2,"padding","40px 10px"],["src","../../assets/img/customisable_icon.png"],["src","../../assets/img/\u201c$\u201d.svg","width","50%",2,"padding","19px 10px"],["src","../../assets/img/receipt.svg"],["id","pricing",2,"padding-top","36px"],[1,"container",2,"margin-top","60px"],[1,"col-12","col-sm-12","col-md-8","col-lg-6","col-xl-8","box-shadow","d-flex","flex-column","align-items-start","justify-content-center"],[1,"btn-block"],[1,"btn-block","d-flex","flex-row","flex-nowrap"],["thumbLabel","","color","primary","min","1","max","10000","step","1",1,"flex-grow-1",3,"displayWith","ngModel","tickInterval","ngModelChange"],["type","number","min","1",1,"pricing-input",3,"ngModel","ngModelChange"],[1,"col-12","col-sm-12","col-md-4","col-xl-4","col-lg-6","box-shadow","d-flex","flex-column",2,"padding","24px"],["appearance","outline",1,"btn-block"],[3,"formControl"],[3,"value"],["mat-button","","color","primary","routerLink","/account/register",1,"col-sm-12","col-md-12","col-12","col-xl-4","col-lg-4","header-btn-secondary",2,"margin-top","24px"]],template:function(t,o){1&t&&(r.Sb(0,"nav",0),r.Sb(1,"a",1),r.Ec(2," SmartStock "),r.Rb(),r.Sb(3,"div",2),r.Sb(4,"ul",3),r.Sb(5,"li",4),r.Sb(6,"a",5),r.Ec(7,"Why Us"),r.Rb(),r.Rb(),r.Sb(8,"li",4),r.Sb(9,"a",6),r.Ec(10,"Pricing"),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Nb(11,"span",7),r.Sb(12,"button",8),r.Ec(13,"Login"),r.Rb(),r.Nb(14,"span",9),r.Sb(15,"button",10),r.Ec(16,"Register"),r.Rb(),r.Rb(),r.Sb(17,"section",11),r.Sb(18,"div",12),r.Sb(19,"h4",13),r.Ec(20," You can\u2019t continue using papers "),r.Nb(21,"br"),r.Ec(22," to keep records of your business. "),r.Rb(),r.Sb(23,"p",14),r.Ec(24,"Start your sales with us, today"),r.Rb(),r.Sb(25,"button",15),r.Ec(26,"Open Account For Free"),r.Rb(),r.Rb(),r.Rb(),r.Sb(27,"section",16),r.Sb(28,"div",17),r.Sb(29,"h4"),r.Ec(30,"Why Smartstock?"),r.Rb(),r.Nb(31,"mat-divider"),r.Sb(32,"div",18),r.Sb(33,"div",19),r.Nb(34,"img",20),r.Sb(35,"h4"),r.Ec(36,"Work everywhere"),r.Rb(),r.Sb(37,"p"),r.Ec(38," You can access our system either by "),r.Sb(39,"b"),r.Ec(40,"desktop / laptop"),r.Rb(),r.Ec(41,", "),r.Sb(42,"b"),r.Ec(43,"mobile"),r.Rb(),r.Ec(44," or "),r.Sb(45,"b"),r.Ec(46,"web browser"),r.Rb(),r.Rb(),r.Rb(),r.Sb(47,"div",19),r.Nb(48,"img",21),r.Sb(49,"h4"),r.Ec(50,"Always available"),r.Rb(),r.Sb(51,"p"),r.Ec(52," Due to internet connectivity challenge our service available offline and online "),r.Rb(),r.Rb(),r.Sb(53,"div",19),r.Nb(54,"img",22),r.Sb(55,"h4"),r.Ec(56,"Customizable"),r.Rb(),r.Sb(57,"p"),r.Ec(58,"Say how you want it to work for you and it will work the way you want"),r.Rb(),r.Rb(),r.Rb(),r.Sb(59,"div",18),r.Sb(60,"div",19),r.Nb(61,"img",20),r.Sb(62,"h4"),r.Ec(63,"Customer Engagement"),r.Rb(),r.Sb(64,"p"),r.Ec(65," Create your online shop for customer to make order and see your products. "),r.Rb(),r.Rb(),r.Sb(66,"div",19),r.Nb(67,"img",23),r.Sb(68,"h4"),r.Ec(69,"Pay As You Use"),r.Rb(),r.Sb(70,"p"),r.Ec(71," Pay for what you use in a month, and not for packages. "),r.Rb(),r.Rb(),r.Sb(72,"div",19),r.Nb(73,"img",24),r.Sb(74,"h4"),r.Ec(75,"Printer"),r.Rb(),r.Sb(76,"p"),r.Ec(77," Printer is integrated by default. Your customer deserve a receipt. "),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Sb(78,"section",25),r.Sb(79,"div",17),r.Sb(80,"h4"),r.Ec(81,"Price Calculator"),r.Rb(),r.Nb(82,"mat-divider"),r.Sb(83,"div",26),r.Sb(84,"span"),r.Ec(85," We understand price is a sensitive issue for business. "),r.Nb(86,"br"),r.Ec(87," You will pay for what you use only no hidden payment or adds on cost. The maximum payment you will pay is "),r.Sb(88,"b"),r.Ec(89,"TZS 150,000 ( $65 )"),r.Rb(),r.Ec(90," and the minimum payment you will pay is "),r.Sb(91,"b"),r.Ec(92,"TZS 17,000 ( $7 )"),r.Rb(),r.Rb(),r.Sb(93,"div",18),r.Sb(94,"div",27),r.Sb(95,"div",28),r.Sb(96,"mat-card-subtitle"),r.Ec(97,"Total Products"),r.Rb(),r.Sb(98,"div",29),r.Sb(99,"mat-slider",30),r.Zb("ngModelChange",(function(t){return o.totalProducts=t})),r.Rb(),r.Sb(100,"input",31),r.Zb("ngModelChange",(function(t){return o.totalProducts=t})),r.Rb(),r.Rb(),r.Sb(101,"mat-card-subtitle"),r.Ec(102,"Total Items You Sale Per month"),r.Rb(),r.Sb(103,"div",29),r.Sb(104,"mat-slider",30),r.Zb("ngModelChange",(function(t){return o.totalSales=t})),r.Rb(),r.Sb(105,"input",31),r.Zb("ngModelChange",(function(t){return o.totalSales=t})),r.Rb(),r.Rb(),r.Sb(106,"mat-card-subtitle"),r.Ec(107,"Total Items You Purchase Per month"),r.Rb(),r.Sb(108,"div",29),r.Sb(109,"mat-slider",30),r.Zb("ngModelChange",(function(t){return o.totalPurchases=t})),r.Rb(),r.Sb(110,"input",31),r.Zb("ngModelChange",(function(t){return o.totalPurchases=t})),r.Rb(),r.Rb(),r.Rb(),r.Rb(),r.Sb(111,"div",32),r.Sb(112,"mat-form-field",33),r.Sb(113,"mat-label"),r.Ec(114,"Choose Currency"),r.Rb(),r.Sb(115,"mat-select",34),r.Sb(116,"mat-option",35),r.Ec(117,"TZS"),r.Rb(),r.Sb(118,"mat-option",35),r.Ec(119,"USD"),r.Rb(),r.Rb(),r.Rb(),r.Sb(120,"mat-card-subtitle"),r.Ec(121,"Your Approximately Monthly Payment"),r.Rb(),r.Sb(122,"h4"),r.Ec(123),r.ec(124,"currency"),r.Rb(),r.Nb(125,"span",7),r.Rb(),r.Sb(126,"button",36),r.Ec(127," Open Account For Free "),r.Rb(),r.Rb(),r.Nb(128,"smartstock-footer"),r.Rb(),r.Rb(),r.Rb()),2&t&&(r.Bb(99),r.jc("displayWith",o.formatLabel)("ngModel",o.totalProducts)("tickInterval",1),r.Bb(1),r.jc("ngModel",o.totalProducts),r.Bb(4),r.jc("displayWith",o.formatLabel)("ngModel",o.totalSales)("tickInterval",1),r.Bb(1),r.jc("ngModel",o.totalSales),r.Bb(4),r.jc("displayWith",o.formatLabel)("ngModel",o.totalPurchases)("tickInterval",1),r.Bb(1),r.jc("ngModel",o.totalPurchases),r.Bb(5),r.jc("formControl",o.currencyFormControl),r.Bb(1),r.jc("value","TZS"),r.Bb(2),r.jc("value","$"),r.Bb(5),r.Fc(r.gc(124,16,o.monthlyCost(),o.currencyFormControl.value+" ")))},directives:[c.c,i.a,b.g,s.a,a.o,a.r,a.s,a.c,l.c,l.f,u.a,a.g,d.n,p],pipes:[n.d],styles:[".header[_ngcontent-%COMP%]{width:100%;height:70vh;padding:0 50px;background:url(header.e38e55821440ee7477cd.png) no-repeat 50%;background-size:cover;color:#fff;background-color:#0b2e13}mat-toolbar[_ngcontent-%COMP%]{background:none}a[_ngcontent-%COMP%]{text-decoration:none;padding:0 10px;color:#fff}.link[_ngcontent-%COMP%]{font-size:16px;font-weight:500}.header-btn[_ngcontent-%COMP%]{background:#00aa07;border-color:#00aa07;border-radius:6px}.header-btn[_ngcontent-%COMP%], .header-btn-secondary[_ngcontent-%COMP%]{margin-bottom:5px;padding:15px;font-weight:500;font-size:24px}.header-btn-secondary[_ngcontent-%COMP%]{border:solid #00aa07;border-radius:6px}.why-smartstock[_ngcontent-%COMP%]{margin:30px 50px 20px}.why-smartstock[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin:10px auto 20px}.why-smartstock[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{padding:20px;margin-bottom:10px;border-color:#00aa07;border-style:solid;border-radius:7px}.sale-on-go[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{margin:0;border-radius:0 50px 0 0;padding:0}.sale-on-go[_ngcontent-%COMP%]   .right-box[_ngcontent-%COMP%]{margin:50px auto}.testmon-container[_ngcontent-%COMP%]{align-content:center;margin:50px 10% 50px 5%}.testmon-info[_ngcontent-%COMP%]{margin:20px auto}.details[_ngcontent-%COMP%]{margin:40px;color:#939393;font-size:20px}.testmon-info[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#00aa07;color:#fff;padding:10px 60px 0}mat-carousel[_ngcontent-%COMP%]     mat-icon{font-size:50px!important;color:#1b1e21}mat-card-subtitle[_ngcontent-%COMP%]{margin-bottom:8px!important}"]}),t}(),m=function(){function t(){}return t.prototype.ngOnInit=function(){},t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=r.Gb({type:t,selectors:[["smartstock-privacy"]],decls:35,vars:0,consts:[[1,"navbar","position-sticky","navbar-expand-lg","navbar-light","bg-light",2,"top","0","z-index","10000"],["href","/",1,"navbar-brand"],["id","navbarSupportedContent",1,"collapse","navbar-collapse"],[1,"navbar-nav","mr-auto"],[1,"flex-grow-1"],["routerLink","/account/login",1,"btn","btn-outline-success"],[2,"width","10px","height","10px"],["routerLink","/account/register",1,"btn","btn-outline-success"],[1,"container"],[2,"margin-top","48px"],["href","http://smartstock.co.tz"]],template:function(t,o){1&t&&(r.Sb(0,"nav",0),r.Sb(1,"a",1),r.Ec(2," SmartStock "),r.Rb(),r.Sb(3,"div",2),r.Nb(4,"ul",3),r.Rb(),r.Nb(5,"span",4),r.Sb(6,"button",5),r.Ec(7,"Login"),r.Rb(),r.Nb(8,"span",6),r.Sb(9,"button",7),r.Ec(10,"Register"),r.Rb(),r.Rb(),r.Sb(11,"div",8),r.Sb(12,"div",9),r.Sb(13,"h2"),r.Ec(14,"Privacy Policy"),r.Rb(),r.Sb(15,"p"),r.Ec(16,"Your privacy is important to us. It is Fahamu Tech's policy to respect your privacy regarding any information we may collect from you across our website, "),r.Sb(17,"a",10),r.Ec(18,"http://smartstock.co.tz"),r.Rb(),r.Ec(19,", and other sites and desktop application we own and operate."),r.Rb(),r.Sb(20,"p"),r.Ec(21,"We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we\u2019re collecting it and how it will be used."),r.Rb(),r.Sb(22,"p"),r.Ec(23,"We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we\u2019ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification."),r.Rb(),r.Sb(24,"p"),r.Ec(25,"We don\u2019t share any personally identifying information publicly or with third-parties, except when required to by law."),r.Rb(),r.Sb(26,"p"),r.Ec(27,"Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies."),r.Rb(),r.Sb(28,"p"),r.Ec(29,"You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services."),r.Rb(),r.Sb(30,"p"),r.Ec(31,"Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us."),r.Rb(),r.Sb(32,"p"),r.Ec(33,"This policy is effective as of 19 February 2020."),r.Rb(),r.Rb(),r.Nb(34,"smartstock-footer"),r.Rb())},directives:[c.c,p],styles:[""]}),t}(),h=e("AytR"),S=function(){function t(t){this.router=t}return t.prototype.canActivate=function(t,o){return!!h.a.browser||(this.router.navigateByUrl("/account/login").catch(console.log),!1)},t.\u0275fac=function(o){return new(o||t)(r.Wb(c.b))},t.\u0275prov=r.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t}(),f=[{path:"",canActivate:[S],component:g},{path:"privacy",canActivate:[S],component:m}],y=function(){function t(){}return t.\u0275mod=r.Kb({type:t}),t.\u0275inj=r.Jb({factory:function(o){return new(o||t)},imports:[[n.c,c.e.forChild(f),i.b,a.k,b.f,s.b,d.o,u.b,a.t]]}),t}()}}]);