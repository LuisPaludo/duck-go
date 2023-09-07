export interface Prizes {
  name: string;
  id: number;
  description: string;
  cost_in_points: number;
  category: number;
  generated_by: number;
  generated_by_company_name: string;
  generated_by_slug:string;
  discount_value: number;
  logo: string;
  times_to_be_used: number;
  expiry_date: Date;
  disabled: boolean;
}

export interface PrizeResponse {
  prize: Prizes;
}
