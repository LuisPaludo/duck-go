export interface Prizes {
  name: string;
  id: number;
  description: string;
  cost_in_points: number;
  category: number;
  generated_by: number;
  discount_value: number;
  logo:string;
}

export interface PrizeResponse {
  prize: Prizes;
}
