export class MyDiscount {
  totalSpent: number = 0;
  currentDiscountPercent: number = 0;
  nextTierThreshold: number | null = null;
  nextTierDiscountPercent: number | null = null;

  constructor(
    totalSpent: number = 0,
    currentDiscountPercent: number = 0,
    nextTierThreshold: number | null = null,
    nextTierDiscountPercent: number | null = null
  ) {
    this.totalSpent = totalSpent;
    this.currentDiscountPercent = currentDiscountPercent;
    this.nextTierThreshold = nextTierThreshold;
    this.nextTierDiscountPercent = nextTierDiscountPercent;
  }
}

export class PromoCheckResult {
  valid: boolean = false;
  discountPercent: number = 0;
  code: string = '';
  error: string | null = null;

  constructor(valid: boolean = false, discountPercent: number = 0, code: string = '', error: string | null = null) {
    this.valid = valid;
    this.discountPercent = discountPercent;
    this.code = code;
    this.error = error;
  }
}