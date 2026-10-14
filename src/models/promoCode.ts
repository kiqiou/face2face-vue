
export class PromoCodeAdmin {
  id: number = 0;
  code: string = '';
  discountPercent: number = 0;
  isFirstOrderOnly: boolean = false;
  isActive: boolean = true;
  validFrom: string | null = null;
  validUntil: string | null = null;
  usageLimit: number | null = null;
  usedCount: number = 0;
  createdAt: string = '';

  constructor(data: Partial<PromoCodeAdmin> = {}) {
    Object.assign(this, data);
  }
}