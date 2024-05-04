import React from "react";
import { order } from "../../interfaces/userInfoInterfaces";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "../../lib/utils";

interface OrderProps {
  orders: order[];
}
export const OrderView: React.FC<OrderProps> = ({ orders }) => {
  return (
    <section className="w-full overflow-hidden ">
      <Accordion type="single" collapsible className="w-full h-full">
        <div
          className={cn(
            "overflow-y-scroll scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-full"
          )}
        >
          {orders.map(
            (order) =>
              order && (
                <AccordionItem key={order.order_id} value={`${order.order_id}`}>
                  <AccordionTrigger>
                    <div className={cn("flex gap-3")}>
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
        </div>
      </Accordion>
    </section>
  );
};
