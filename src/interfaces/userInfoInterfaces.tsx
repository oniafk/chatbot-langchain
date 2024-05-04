interface order {
  order_id: number;
  order_product_id: number;
  order_quantity: number;
  order_total: number;
  order_createdAt: string;
  order_user_id: number;
  order_carrier_id: number;
  order_address: string;
  order_city: string;
  order_country: string;
  order_postal_code: string;
  order_tracking_number: string;
  order_status_id: number;
  order_date: string;
  order_shipment_date: string;
  order_carrier: {
    carrier_name: string;
  };
  order_status: {
    status_delivery_name: string;
  };
}

interface paymentMethod {
  paymet_method_number: number;
  payment_method_type: string;
  payment_method_expiration_date: string;
}

interface userInfo {
  user_first_name: string;
  user_last_name: string;
  user_email: string;
}

export type { order, paymentMethod, userInfo };
