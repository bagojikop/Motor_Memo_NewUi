import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full'
  // },
  {
    path: 'selectfirm',
    loadComponent: () => import('./assets/pg/Login/select-firm/select-firm.component').then(m => m.SelectFirmComponent),
    data: { name: 'firm' }
  },
  {
    path: 'login',
    loadComponent: () => import('./assets/pg/Login/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },

      {
        path: 'accountMaster',
        loadComponent: () => import('./views/Master/account info/accountinfomaster/accountinfomaster.component').then((m) => m.AccountinfomasterComponent)
      },
      {
        path: 'accountChild',
        loadComponent: () => import('./views/Master/account info/accountinfochild/accountinfochild.component').then((m) => m.AccountinfochildComponent)
      },
      {
        path: 'subgroup',
        loadComponent: () => import('./views/Master/group/subgroup.component').then((m) => m.SubgroupComponent)
      },
      {
        path: 'primarygroup',
        loadComponent: () => import('./views/Master/primarygroup/groupmaster.component').then((m) => m.GroupmasterComponent)
      },
      {
        path: 'Tdsmaster',
        loadComponent: () => import('./views/Master/tdsmaster/tdsmaster.component').then((m) => m.TdsmasterComponent)
      },
      {
        path: 'Opningbalance',
        loadComponent: () => import('./views/Master/opningbalance/opningbalance.component').then((m) => m.OpningbalanceComponent)
      },
      {
        path: 'Taluka',
        loadComponent: () => import('./views/Master/Place/taluka/taluka.component').then((m) => m.TalukaComponent)
      },
      {
        path: 'Place',
        loadComponent: () => import('./views/Master/Place/place/place.component').then((m) => m.PlaceComponent)
      },
      {
        path: 'District',
        loadComponent: () => import('./views/Master/Place/district/district.component').then((m) => m.DistrictComponent)
      },
      {
        path: 'Productmaster',
        loadComponent: () => import('./views/Master/Product/product/productmaster/homemaster.component').then((m) => m.HomemasterComponent)
      },
      {
        path: 'Productchild',
        loadComponent: () => import('./views/Master/Product/product/productchild/productchild.component').then((m) => m.ProductchildComponent)
      },
      {
        path: 'Unitmaster',
        loadComponent: () => import('./views/Master/Product/unit/unitmaster.component').then((m) => m.UnitmasterComponent)
      },
      {
        path: 'venderChild',
        loadComponent: () => import('./views/Master/sender-receiver/SenderReceiverChild/sender-receiver-child.component').then((m) => m.SenderReceiverChildComponent)
      },
      {
        path: 'venderMaster',
        loadComponent: () => import('./views/Master/sender-receiver/SenderReceiverMaster/sender-receiver.component').then((m) => m.SenderReceiverComponent)
      },
      {
        path: 'VehicleInfochild',
        loadComponent: () => import('./views/Master/Vehicle/vehicle-infochild/vehicle-infochild.component').then((m) => m.VehicleInfochildComponent)
      },
      {
        path: 'VehicleInfomaster',
        loadComponent: () => import('./views/Master/Vehicle/vehicle-infomaster/vehicle-infomaster.component').then((m) => m.VehicleInfomasterComponent)
      },
      {
        path: 'VehicleTypeChild',
        loadComponent: () => import('./views/Master/VehicleType/vehicle-type-child/vehicle-type-child.component').then((m) => m.VehicleTypeChildComponent)
      },
      {
        path: 'VehicleTypeMaster',
        loadComponent: () => import('./views/Master/VehicleType/vehicle-type-master/vehicle-type-master.component').then((m) => m.VehicleTypeMasterComponent)
      },
      {
        path: 'Contrachild',
        loadComponent: () => import('./views/Transaction/contra/contrachild/contrachild.component').then((m) => m.ContrachildComponent)
      },
      {
        path: 'Contramaster',
        loadComponent: () => import('./views/Transaction/contra/contramaster/contramaster.component').then((m) => m.ContramasterComponent)
      },
      // {
      //   path: 'Expense',
      //   loadComponent: () => import('./views/Transaction/expense/expense.component').then((m) => m.ExpenseComponent)
      // },
      {
        path: 'Journalchild',
        loadComponent: () => import('./views/Transaction/journal/journalchild/journalchild.component').then((m) => m.JournalchildComponent)
      },
      {
        path: 'Journalmaster',
        loadComponent: () => import('./views/Transaction/journal/journalmaster/journalmaster.component').then((m) => m.JournalmasterComponent)
      },
      {
        path: 'Motorchild',
        loadComponent: () => import('./views/Transaction/motormemo/motorchild/motorchild.component').then((m) => m.MotorchildComponent)
      },
      {
        path: 'Motormaster',
        loadComponent: () => import('./views/Transaction/motormemo/motormaster/motormaster.component').then((m) => m.MotormasterComponent)
      },
      {
        path: 'Paymentchild',
        loadComponent: () => import('./views/Transaction/payment/paymentchild/paymentchild.component').then((m) => m.PaymentchildComponent)
      },
      {
        path: 'Paymentmaster',
        loadComponent: () => import('./views/Transaction/payment/paymentmaster/paymentmaster.component').then((m) => m.PaymentmasterComponent)
      },
      {
        path: 'Receiptchild',
        loadComponent: () => import('./views/Transaction/receipt/receiptchild/receiptchild.component').then((m) => m.ReceiptchildComponent)
      },
      {
        path: 'Receiptmaster',
        loadComponent: () => import('./views/Transaction/receipt/receiptmaster/receiptmaster.component').then((m) => m.ReceiptmasterComponent)
      },
      {
        path: 'Summary',
        loadComponent: () => import('./views/Transaction/summary/summary.component').then((m) => m.SummaryComponent)
      },
      {
        path: 'Balanceforward',
        loadComponent: () => import('./views/Admin/balanceforward/balanceforward.component').then((m) => m.BalanceforwardComponent)
      },
      {
        path: 'Finyearchild',
        loadComponent: () => import('./views/Admin/Finyear/finyearchild/finyearchild.component').then((m) => m.FinyearchildComponent)
      },
      {
        path: 'Finyearmaster',
        loadComponent: () => import('./views/Admin/Finyear/finyearmaster/finyearmaster.component').then((m) => m.FinyearmasterComponent)
      },
      {
        path: 'FirmChild',
        loadComponent: () => import('./views/Admin/Firm/firm-child/firm-child.component').then((m) => m.FirmChildComponent)
      },
      {
        path: 'FirmMaster',
        loadComponent: () => import('./views/Admin/Firm/firm-master/firm-master.component').then((m) => m.FirmMasterComponent)
      },
      {
        path: 'Firmtypemaster',
        loadComponent: () => import('./views/Admin/firmtypemaster/firmtypemaster.component').then((m) => m.FirmtypemasterComponent)
      },
      {
        path: 'Declarationchild',
        loadComponent: () => import('./views/Master/Declaration/declarationchild/declarationchild.component').then((m) => m.DeclarationchildComponent)
      },
      {
        path: 'Declarationmaster',
        loadComponent: () => import('./views/Master//Declaration/declarationmaster/declarationmaster.component').then((m) => m.DeclarationmasterComponent)
      },
      {
        path: 'Roleinfomaster',
        loadComponent: () => import('./views/Admin/RoleInfo/roleinfomaster/roleinfomaster.component').then((m) => m.RoleinfomasterComponent)
      },
      {
        path: 'cashbankbook',
        loadComponent: () => import('./views/Reports/chashbank-book/chashbank-book.component').then((m) => m.ChashbankBookComponent)
      },
      {
        path: 'daybook',
        loadComponent: () => import('./views/Reports/day-book/day-book.component').then((m) => m.DayBookComponent)
      },
      {
        path: 'Ledger',
        loadComponent: () => import('./views/Reports/ledger/ledger.component').then((m) => m.LedgerComponent)
      },
      {
        path: 'SubGroupreport',
        loadComponent: () => import('./views/Reports/grouplist/grouplist.component').then((m) => m.GrouplistComponent)
      },
      {
        path: 'Trialbalance',
        loadComponent: () => import('./views/Reports/trial-balance/trial-balance.component').then((m) => m.TrialBalanceComponent)
      },
      {
        path: 'balancesheet',
        loadComponent: () => import('./views/Reports/balance-sheet/balance-sheet.component').then((m) => m.BalanceSheetComponent)
      },
      {
        path: 'profitloss',
        loadComponent: () => import('./views/Reports/profit-loss/profit-loss.component').then((m) => m.ProfitLossComponent)
      },
      {
        path: 'profit-loss-child',
        loadComponent: () => import('./views/Reports/profit-loss/profit-loss-child/profit-loss-child.component').then((m) => m.ProfitLossChildComponent)
      },
      {
        path: 'motor-memo-register',
        loadComponent: () => import('./views/Reports/motormemo-register/motormemo-register.component').then((m) => m.MotormemoRegisterComponent)
      },
       {
        path: 'sundry-wise',
        loadComponent: () => import('./views/Reports/sundry-wise/sundry-wise.component').then((m) => m.SundryWiseComponent)
      },
      {
        path: 'Roleinfochild',
        loadComponent: () => import('./views/Admin/RoleInfo/roleinfochild/roleinfochild.component').then((m) => m.RoleinfochildComponent)
      },
      {
        path: 'Userinfochild',
        loadComponent: () => import('./views/Admin/UserInfo/userinfochild/userinfochild.component').then((m) => m.UserinfochildComponent)
      },
      {
        path: 'Userinfomaster',
        loadComponent: () => import('./views/Admin/UserInfo/userinfomaster/userinfomaster.component').then((m) => m.UserinfomasterComponent)
      },
      {
        path: 'UserAccess',
        loadComponent: () => import('./views/Admin/UserInfo/user-accesschild/user-accesschild.component').then((m) => m.UserAccesschildComponent)
      },
      {
        path: 'Roleaccess',
        loadComponent: () => import('./views/Admin/RoleInfo/roleaccess/roleaccess.component').then((m) => m.RoleaccessComponent)
      },
      {
        path: 'Moduleaccess',
        loadComponent: () => import('./views/Admin/moduleaccess/moduleaccess.component').then((m) => m.ModuleaccessComponent)
      },
      {
        path: 'Forgotpassword',
        loadComponent: () => import('./assets/pg/Login/forgotpassword/forgotpassword.component').then((m) => m.ForgotpasswordComponent)
      },


    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
