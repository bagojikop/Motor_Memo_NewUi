
import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   iconComponent: { name: 'cil-speedometer' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    name: 'Master',
    url: '/Masters',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Ledger',
        url: '/base',
        iconComponent: { name: 'cil-puzzle' },
        children: [
          { name: 'Account', url: 'accountMaster', icon: 'nav-icon-bullet' },
          { name: 'Group', url: 'subgroup', icon: 'nav-icon-bullet' },
          { name: 'Primary Group', url: 'primarygroup', icon: 'nav-icon-bullet' },
          { name: 'Opening Balance', url: 'Opningbalance', icon: 'nav-icon-bullet' },
          { name: 'TDS', url: 'Tdsmaster', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Place',
        url: '/buttons',
        iconComponent: { name: 'cil-cursor' },
        children: [
          { name: 'District', url: 'District', icon: 'nav-icon-bullet' },
          { name: 'Taluka', url: 'Taluka', icon: 'nav-icon-bullet' },
          { name: 'Place', url: 'Place', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Product',
        url: '/forms',
        iconComponent: { name: 'cil-notes' },
        children: [
          { name: 'Product Info', url: 'Productmaster', icon: 'nav-icon-bullet' },
          { name: 'Unit', url: 'Unitmaster', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Sender/Receiver',
        iconComponent: { name: 'cil-people' },
        url: 'venderMaster'
      },
      {
        name: 'Vehicle Type',
        iconComponent: { name: 'cil-spreadsheet' },
        url: 'VehicleTypeMaster'
      },
      {
        name: 'Vehicle Info',
        iconComponent: { name: 'cil-spreadsheet' },
        url: 'VehicleInfomaster'
      },

      {
        name: 'Vehicle Declaration',
        iconComponent: { name: 'cil-spreadsheet' },
        url: 'Declarationmaster'
      }
    ]
  },
  {
    name: 'Transaction',
    url: '/Transactions',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      { name: 'Motor Memo', iconComponent: { name: 'cil-file' }, url: 'Motormaster' },
      { name: 'Sundry', iconComponent: { name: 'cil-list' }, url: 'Summary' },
      // { name: 'Expenses', iconComponent: { name: 'cil-credit-card' }, url: 'Expense' },
      { name: 'Contra Entry', iconComponent: { name: 'cil-credit-card' }, url: 'Contramaster' },
      { name: 'Journal Entry', iconComponent: { name: 'cil-notes' }, url: 'Journalmaster' },
      { name: 'Receipt', iconComponent: { name: 'cil-credit-card' }, url: 'Receiptmaster' },
      { name: 'Payment', iconComponent: { name: 'cil-credit-card' }, url: 'Paymentmaster' }
    ]
  },
  {
    name: 'Admin',
    url: '/Admins',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      { name: 'Firms', iconComponent: { name: 'cil-layers' }, url: 'FirmMaster' },
      { name: 'Financial Year', iconComponent: { name: 'cil-calendar' }, url: 'Finyearmaster' },
      { name: 'Balance Forward', iconComponent: { name: 'cil-calculator' }, url: 'Balanceforward' },
      { name: 'Firm Type', iconComponent: { name: 'cil-layers' }, url: 'Firmtypemaster' },
      { name: 'UserInfo', iconComponent: { name: 'cil-layers' }, url: 'Userinfomaster' },
      { name: 'RoleInfo', iconComponent: { name: 'cil-layers' }, url: 'Roleinfomaster' },



      {
        name: 'Permission',
        url: '/Permission',
        iconComponent: { name: 'cil-notes' },
        children: [
          { name: 'User Access', iconComponent: { name: 'cil-layers' }, url: 'UserAccess' },
          { name: 'Role Access', iconComponent: { name: 'cil-layers' }, url: 'Roleaccess' },
          { name: 'Module Access', iconComponent: { name: 'cil-layers' }, url: 'Moduleaccess' },
        ]
      },
    ]
  }
];
