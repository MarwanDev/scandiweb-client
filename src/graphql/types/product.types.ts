export interface Product {
  id: string;
  name: string;
  brand: string;
  in_stock: boolean;
  category: string;
  description: string;
  prices: Price[];
  gallery: Gallery[];
  attributes: Attribute[];
}

export interface Gallery {
  image_url: string;
}

export interface Price {
  amount: number;
  currency_label: string;
  currency_symbol: string;
}

export interface Attribute {
  name: string;
  type: string;
  id: number;
  items: AttributeItem[];
}

export interface AttributeItem {
  display_value: string;
  value: string;
  item_id: string;
}

export interface OrderProduct {
  productDetails?: Product;
  id?: string;
  attributes: Record<string, number>;
  total?: number;
  quantity: number;
}
