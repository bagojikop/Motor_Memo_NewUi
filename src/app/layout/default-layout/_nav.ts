
// import { INavData } from '@coreui/angular';

// export const navItems = ({
//   isMasterDisabled = false,
//   isMotorMemoDisabled = false,
//   isFinanceDisabled = false,
//   isAdminDisabled = false
// }): INavData[] => {
//   const items: INavData[] = [


//     {
//       name: 'Master',
//       url: '/Masters',
//       iconComponent: { name: 'cil-puzzle' },

//       children: [
//         {
//           name: 'Ledger',
//           url: '/base',
//           iconComponent: { name: 'cil-puzzle' },
//           children: [
//             { name: 'Account', url: 'accountMaster', icon: 'nav-icon-bullet' },
//             { name: 'Group', url: 'subgroup', icon: 'nav-icon-bullet' },
//             { name: 'Primary Group', url: 'primarygroup', icon: 'nav-icon-bullet' },
//             { name: 'Opening Balance', url: 'Opningbalance', icon: 'nav-icon-bullet' },
//             { name: 'TDS', url: 'Tdsmaster', icon: 'nav-icon-bullet' }
//           ]
//         },
//         {
//           name: 'Place',
//           url: '/buttons',
//           iconComponent: { name: 'cil-cursor' },
//           children: [
//             { name: 'District', url: 'District', icon: 'nav-icon-bullet' },
//             { name: 'Taluka', url: 'Taluka', icon: 'nav-icon-bullet' },
//             { name: 'Place', url: 'Place', icon: 'nav-icon-bullet' }
//           ]
//         },
//         {
//           name: 'Product',
//           url: '/forms',
//           iconComponent: { name: 'cil-notes' },
//           children: [
//             { name: 'Product Info', url: 'Productmaster', icon: 'nav-icon-bullet' },
//             { name: 'Unit', url: 'Unitmaster', icon: 'nav-icon-bullet' }
//           ]
//         },
//         {
//           name: 'Sender/Receiver',
//           iconComponent: { name: 'cil-people' },
//           url: 'venderMaster'
//         },
//         {
//           name: 'Vehicle Type',
//           iconComponent: { name: 'cil-spreadsheet' },
//           url: 'VehicleTypeMaster'
//         },
//         {
//           name: 'Vehicle Info',
//           iconComponent: { name: 'cil-spreadsheet' },
//           url: 'VehicleInfomaster'
//         },

//         {
//           name: 'Vehicle Declaration',
//           iconComponent: { name: 'cil-spreadsheet' },
//           url: 'Declarationmaster'
//         }
//       ]
//     },
//     {
//       name: 'Transaction',
//       url: '/Transactions',
//       iconComponent: { name: 'cil-puzzle' },
//       children: [
//         { name: 'Motor Memo', iconComponent: { name: 'cil-file' }, url: 'Motormaster' },
//         { name: 'Sundry', iconComponent: { name: 'cil-list' }, url: 'Summary' },
//         { name: 'Contra Entry', iconComponent: { name: 'cil-credit-card' }, url: 'Contramaster' },
//         { name: 'Journal Entry', iconComponent: { name: 'cil-notes' }, url: 'Journalmaster' },
//         { name: 'Receipt', iconComponent: { name: 'cil-credit-card' }, url: 'Receiptmaster' },
//         { name: 'Payment', iconComponent: { name: 'cil-credit-card' }, url: 'Paymentmaster' }
//       ]
//     },
//     {
//       name: 'Admin',
//       url: '/Admins',
//       iconComponent: { name: 'cil-puzzle' },
//       children: [
//         { name: 'Firms', iconComponent: { name: 'cil-layers' }, url: 'FirmMaster' },
//         { name: 'Financial Year', iconComponent: { name: 'cil-calendar' }, url: 'Finyearmaster' },
//         { name: 'Balance Forward', iconComponent: { name: 'cil-calculator' }, url: 'Balanceforward' },
//         { name: 'Firm Type', iconComponent: { name: 'cil-layers' }, url: 'Firmtypemaster' },
//         { name: 'UserInfo', iconComponent: { name: 'cil-layers' }, url: 'Userinfomaster' },
//         { name: 'RoleInfo', iconComponent: { name: 'cil-layers' }, url: 'Roleinfomaster' },



//         {
//           name: 'Permission',
//           url: '/Permission',
//           iconComponent: { name: 'cil-notes' },
//           children: [
//             { name: 'User Access', iconComponent: { name: 'cil-layers' }, url: 'UserAccess' },
//             { name: 'Role Access', iconComponent: { name: 'cil-layers' }, url: 'Roleaccess' },
//             { name: 'Module Access', iconComponent: { name: 'cil-layers' }, url: 'Moduleaccess' },
//           ]
//         },
//       ]
//     }
//   ]

//   return items.filter(item => {
//     // if (item.name === 'Master' && isMasterDisabled) return false;
//     if (item.name === 'Admin' && isAdminDisabled) return false;
//     // if (item.name === 'Transaction' && isPaymentDisabled) return false;


//     if (item.children) {
//       item.children = item.children.filter(child => {

//         if (child.name === 'Sender/Receiver' && isMasterDisabled) return false;


//         if (child.name === 'Motor Memo' && isMotorMemoDisabled) return false;
//         if (child.name === 'Contra Entry' && isFinanceDisabled) return false;
//         if (child.name === 'Journal Entry' && isFinanceDisabled) return false;
//         if (child.name === 'Receipt' && isFinanceDisabled) return false;
//         if (child.name === 'Payment' && isFinanceDisabled) return false;

//         return true;
//       });
//     }

//     return true;
//   });


// };





import { INavData } from '@coreui/angular';

export const navItems = ({
  isMasterDisabled = false,
  isMotorMemoDisabled = false,
  isFinanceDisabled = false,
  isAdminDisabled = false
}): INavData[] => {
  const items: INavData[] = [
    {
      name: 'Master',
      url: '/Masters',
      iconComponent: { name: 'cil-puzzle' },
      children: [
        {
          name: 'Account',
          url: '/base',
          iconComponent: { name: 'cil-puzzle' },
          children: [
            { name: 'Ledger', url: 'accountMaster', icon: 'nav-icon-bullet' },
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
        { name: 'Contra Entry', iconComponent: { name: 'cil-credit-card' }, url: 'Contramaster' },
        { name: 'Journal Entry', iconComponent: { name: 'cil-notes' }, url: 'Journalmaster' },
        { name: 'Receipt', iconComponent: { name: 'cil-credit-card' }, url: 'Receiptmaster' },
        { name: 'Payment', iconComponent: { name: 'cil-credit-card' }, url: 'Paymentmaster' },
        { name: 'Bilty', iconComponent: { name: 'cil-credit-card' }, url: 'BiltyMaster' },
        { name: 'Lorry Receipt 2', iconComponent: { name: 'cil-credit-card' }, url: 'lorry-receipt2' },
        { name: 'Aknowledgment 1', iconComponent: { name: 'cil-credit-card' }, url: 'Aknowledgment1' },
        { name: 'Aknowledgment 2', iconComponent: { name: 'cil-credit-card' }, url: 'Aknowledgment2' }
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
    },
    {
      name: 'Report',
      url: '/Reports',
      iconComponent: { name: 'cil-puzzle' },
      children: [
        { name: 'Cash Bank Book', iconComponent: { name: 'cil-file' }, url: 'cashbankbook' },
        { name: 'Day Book', iconComponent: { name: 'cil-list' }, url: 'daybook' },
        { name: 'Ledger', iconComponent: { name: 'cil-list' }, url: 'Ledger' },
        { name: 'Group List', iconComponent: { name: 'cil-list' }, url: 'SubGroupreport' },
        { name: 'Trial Balance', iconComponent: { name: 'cil-list' }, url: 'Trialbalance' },
        { name: 'Balance Sheet', iconComponent: { name: 'cil-list' }, url: 'balancesheet' },
        { name: 'Profit Loss', iconComponent: { name: 'cil-list' }, url: 'profitloss' },
        { name: 'Motormemo Register', iconComponent: { name: 'cil-list' }, url: 'motor-memo-register' },
        { name: 'Sundry Wise Expenses', iconComponent: { name: 'cil-list' }, url: 'sundry-wise' },
        { name: 'Lorry Receipt 2 Register', iconComponent: { name: 'cil-list' }, url: 'lorry-receipt2_Register' },
      ]
    }
  ];

  return items.filter(item => { 
    if (item.name === 'Admin' && isAdminDisabled) return false;
 
    if(item.name === 'Master' && !isMotorMemoDisabled && !isMasterDisabled) return true;

    if (item.children) {
      if (item.name === 'Master') { 
        if (!isMotorMemoDisabled) {
          item.children = item.children.filter(child => 
            child.name === 'Sender/Receiver' || 
            child.name === 'Vehicle Info' ||
            child.name === 'Product' 
          );
        }

        
 
        if (!isMotorMemoDisabled) return true;
         
        if (isMasterDisabled) return false; 
      } 
      else if (item.name === 'Transaction') {
        item.children = item.children.filter(child => {
          if (child.name === 'Motor Memo' && isMotorMemoDisabled) return false;
          if (child.name === 'Contra Entry' && isFinanceDisabled) return false;
          if (child.name === 'Journal Entry' && isFinanceDisabled) return false;
          if (child.name === 'Receipt' && isFinanceDisabled) return false;
          if (child.name === 'Payment' && isFinanceDisabled) return false;
          return true;
        });
      }
    }

    return true;
});
};


