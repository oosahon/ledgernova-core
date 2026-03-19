import { AppError } from '../../../shared/value-objects/error';
import {
  EAssetAccountSubType,
  EAssetAccountType,
} from '../../ledger-account/types/asset-account.types';
import {
  EEquityAccountSubType,
  EEquityAccountType,
} from '../../ledger-account/types/equity-account.types';
import {
  EExpenseAccountSubType,
  EExpenseAccountType,
} from '../../ledger-account/types/expense-account.types';
import {
  ELedgerType,
  ULedgerType,
} from '../../ledger-account/types/index.types';
import {
  ELiabilityAccountSubType,
  ELiabilityAccountType,
} from '../../ledger-account/types/liability-account.types';
import {
  ERevenueAccountSubType,
  ERevenueAccountType,
} from '../../ledger-account/types/revenue-account.types';

// ================ LEVEL 0 =================
const LEDGER_CODES = {
  [ELedgerType.Asset]: '10000',
  [ELedgerType.Liability]: '20000',
  [ELedgerType.Equity]: '30000',
  [ELedgerType.Revenue]: '40000',
  [ELedgerType.Expense]: '50000',
};

// ================ LEVEL 1 =================
const ASSET_ACCOUNT_CODES = {
  [EAssetAccountType.Cash]: '11000',
  [EAssetAccountType.Receivable]: '12000',
  [EAssetAccountType.Inventory]: '13000',
  [EAssetAccountType.FixedAsset]: '14000',
  [EAssetAccountType.Investment]: '15000',
  [EAssetAccountType.Other]: '16000',
};

const LIABILITY_ACCOUNT_CODES = {
  [ELiabilityAccountType.Payable]: '21000',
  [ELiabilityAccountType.Loan]: '22000',
  [ELiabilityAccountType.CreditCard]: '23000',
  [ELiabilityAccountType.Other]: '24000',
};

const EQUITY_ACCOUNT_CODES = {
  [EEquityAccountType.OwnerInvestment]: '31000',
  [EEquityAccountType.RetainedEarnings]: '32000',
  [EEquityAccountType.Other]: '33000',
};

const REVENUE_ACCOUNT_CODES = {
  [ERevenueAccountType.Operating]: '41000',
  [ERevenueAccountType.Other]: '42000',
};

const EXPENSE_ACCOUNT_CODES = {
  [EExpenseAccountType.Operating]: '51000',
  [EExpenseAccountType.Other]: '52000',
  [EExpenseAccountType.CostOfGoodsSold]: '53000',
};

// ================ LEVEL 2 =================
const ASSET_ACCOUNT_SUB_CODES = {
  [EAssetAccountSubType.Cash]: '11100',
  [EAssetAccountSubType.Bank]: '11200',
  [EAssetAccountSubType.Savings]: '11300',
  [EAssetAccountSubType.VirtualCard]: '11400',
  [EAssetAccountSubType.EWallet]: '11500',
  // Receivable
  [EAssetAccountSubType.AccountsReceivable]: '12100',
  [EAssetAccountSubType.AllowanceForDoubtfulAccounts]: '12200',
  // Inventory
  [EAssetAccountSubType.RawMaterials]: '13100',
  [EAssetAccountSubType.WorkInProgress]: '13200',
  [EAssetAccountSubType.FinishedGoods]: '13300',
  // FixedAsset
  [EAssetAccountSubType.Property]: '14100',
  [EAssetAccountSubType.Equipment]: '14200',
  [EAssetAccountSubType.Vehicles]: '14300',
  [EAssetAccountSubType.Furniture]: '14400',
  [EAssetAccountSubType.AccumulatedDepreciation]: '14900',
  // Other
  [EAssetAccountSubType.Other]: '11600',
};

const LIABILITY_ACCOUNT_SUB_CODES = {
  // Payable
  [ELiabilityAccountSubType.AccountsPayable]: '21100',
  [ELiabilityAccountSubType.AccruedExpense]: '21200',
  [ELiabilityAccountSubType.SalesTaxPayable]: '21300',
  // Loan
  [ELiabilityAccountSubType.ShortTerm]: '22100',
  [ELiabilityAccountSubType.LongTerm]: '22200',
  [ELiabilityAccountSubType.Mortgage]: '22300',
  // Other
  [ELiabilityAccountSubType.Other]: '24100',
};

const EQUITY_ACCOUNT_SUB_CODES = {
  [EEquityAccountSubType.CommonStock]: '31100',
  [EEquityAccountSubType.PreferredStock]: '31200',
  [EEquityAccountSubType.OwnerDraws]: '31300',
  [EEquityAccountSubType.OwnerContributions]: '31400',
  [EEquityAccountSubType.Other]: '33100',
};

const REVENUE_ACCOUNT_SUB_CODES = {
  // Operating
  [ERevenueAccountSubType.ProductSales]: '41100',
  [ERevenueAccountSubType.ServiceSales]: '41200',
  [ERevenueAccountSubType.Subscription]: '41300',
  [ERevenueAccountSubType.DiscountGiven]: '41400',
  [ERevenueAccountSubType.ReturnsAndAllowances]: '41500',
  // Other
  [ERevenueAccountSubType.InterestIncome]: '42100',
  [ERevenueAccountSubType.DividendIncome]: '42200',
  [ERevenueAccountSubType.RentalIncome]: '42300',
  [ERevenueAccountSubType.Other]: '42900',
};

const EXPENSE_ACCOUNT_SUB_CODES = {
  // Operating
  [EExpenseAccountSubType.Payroll]: '51100',
  [EExpenseAccountSubType.Rent]: '51200',
  [EExpenseAccountSubType.Utilities]: '51300',
  [EExpenseAccountSubType.Marketing]: '51400',
  [EExpenseAccountSubType.OfficeSupplies]: '51500',
  [EExpenseAccountSubType.Software]: '51600',
  [EExpenseAccountSubType.LegalAndProfessional]: '51700',
  [EExpenseAccountSubType.Depreciation]: '51800',
  [EExpenseAccountSubType.TravelAndMeals]: '51900',
  [EExpenseAccountSubType.Insurance]: '51910',
  [EExpenseAccountSubType.BankFees]: '51920',
  // COGS
  [EExpenseAccountSubType.DirectMaterials]: '53100',
  [EExpenseAccountSubType.DirectLabor]: '53200',
  [EExpenseAccountSubType.Overhead]: '53300',
  [EExpenseAccountSubType.Shipping]: '53400',
  // Other
  [EExpenseAccountSubType.InterestExpense]: '52100',
  [EExpenseAccountSubType.TaxExpense]: '52200',
  [EExpenseAccountSubType.Other]: '59000',
};

const ASSETS = [ASSET_ACCOUNT_CODES, ASSET_ACCOUNT_SUB_CODES];
const LIABILITIES = [LIABILITY_ACCOUNT_CODES, LIABILITY_ACCOUNT_SUB_CODES];
const EQUITY = [EQUITY_ACCOUNT_CODES, EQUITY_ACCOUNT_SUB_CODES];
const REVENUE = [REVENUE_ACCOUNT_CODES, REVENUE_ACCOUNT_SUB_CODES];
const EXPENSE = [EXPENSE_ACCOUNT_CODES, EXPENSE_ACCOUNT_SUB_CODES];

const map = {
  [ELedgerType.Asset]: ASSETS,
  [ELedgerType.Liability]: LIABILITIES,
  [ELedgerType.Equity]: EQUITY,
  [ELedgerType.Revenue]: REVENUE,
  [ELedgerType.Expense]: EXPENSE,
};

function generateCode(parentCode: string, precedingSiblingCode?: string) {
  const codeLength = parentCode.length;

  const parentPrefix = parentCode.replace(/0+$/, '');

  if (!precedingSiblingCode) {
    const suffixZeroes = codeLength - parentPrefix.length - 1;
    if (suffixZeroes < 0) {
      throw new AppError('Maximum ledger depth reached.', {
        cause: {
          parentCode,
          precedingSiblingCode,
        },
      });
    }
    return parentPrefix + '1' + '0'.repeat(suffixZeroes);
  }

  const siblingTrailingZeros =
    precedingSiblingCode.length -
    precedingSiblingCode.replace(/0+$/, '').length;
  let incrementLevel = siblingTrailingZeros;

  while (incrementLevel >= 0) {
    const increment = Math.pow(10, incrementLevel);
    const nextValue = parseInt(precedingSiblingCode, 10) + increment;
    const nextCodeStr = nextValue.toString().padStart(codeLength, '0');

    if (
      nextCodeStr.startsWith(parentPrefix) &&
      nextCodeStr.length === codeLength
    ) {
      return nextCodeStr;
    }

    incrementLevel--;
  }

  throw new AppError('No available ledger codes under this parent.', {
    cause: {
      parentCode,
      precedingSiblingCode,
    },
  });
}

const ledgerCodeRules = Object.freeze({
  generateCode,
  map,
  LEDGER_CODES,
});

export default ledgerCodeRules;
