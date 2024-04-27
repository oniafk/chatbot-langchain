import { getPaymentMethods } from "../../app/dataBaseRequests/paymentMethodInfo";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PasswordCell,
} from "@/components/ui/table";

import { cn } from "../../lib/utils";
import React from "react";

interface paymentMethod {
  paymet_method_number: number;
  payment_method_type: string;
  payment_method_expiration_date: string;
}

export async function PaymentMethodsView() {
  const paymenthInfo = await getPaymentMethods();
  const paymentMethods: paymentMethod[] = paymenthInfo.paymentMethods;

  return (
    <section className="w-full">
      <Table className="w-full">
        <TableCaption>A list of your payment methods.</TableCaption>
        <TableHeader>
          <TableRow className={cn("border-b border-slate-400")}>
            <TableHead className="w-[150px] ">Payment Method</TableHead>
            <TableHead>Franchise</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right w-[150px]">
              Expiration date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMethods.map((paymentMethod) => (
            <TableRow key={paymentMethod.paymet_method_number}>
              <TableCell className="font-medium">
                {"***" +
                  paymentMethod.paymet_method_number.toString().slice(-4)}
              </TableCell>
              <TableCell>{paymentMethod.payment_method_type}</TableCell>
              <TableCell>Credit Card</TableCell>

              <PasswordCell
                className="text-right pl-10"
                value={new Date(
                  paymentMethod.payment_method_expiration_date
                ).toLocaleDateString()}
              >
                {paymentMethod.payment_method_expiration_date}
              </PasswordCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
