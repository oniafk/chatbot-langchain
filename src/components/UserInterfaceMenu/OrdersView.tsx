import { getOrderInfo } from "../../app/dataBaseRequests/orderInfo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

export async function OrderView() {
  const ordersInfo = await getOrderInfo();
  const orders: order[] = ordersInfo.orders;

  return (
    <section className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {orders.map(
          (order) =>
            order && (
              <AccordionItem key={order.order_id} value={`${order.order_id}`}>
                <AccordionTrigger>
                  <div className="flex gap-3">
                    <h3>Order:</h3>
                    <p className="text-slate-500">{order.order_id}</p>
                  </div>
                  <div className="flex gap-3">
                    <h3>Total:</h3>
                    <p className="text-slate-500">{`$ ${order.order_total}`}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <h3>No of products:</h3>
                      <p className="text-slate-500">{order.order_quantity}</p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Created At:</h3>
                      <p className="text-slate-500">
                        {new Date(order.order_createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Carrier:</h3>
                      <p className="text-slate-500">
                        {order.order_carrier.carrier_name}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Address:</h3>
                      <p className="text-slate-500">{order.order_address}</p>
                    </div>
                    <div className="flex gap-3">
                      <h3>City:</h3>
                      <p className="text-slate-500">{order.order_city}</p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Country:</h3>
                      <p className="text-slate-500">{order.order_country}</p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Postal Code:</h3>
                      <p className="text-slate-500">
                        {order.order_postal_code}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Tracking Number:</h3>
                      <p className="text-slate-500">
                        {order.order_tracking_number}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <h3>Order status :</h3>
                      <p className="text-slate-500">
                        {order.order_status.status_delivery_name}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
        )}
      </Accordion>
    </section>
  );
}
