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
import { paymentMethod } from "../../interfaces/userInfoInterfaces";

interface paymentMethodsProps {
  payments: paymentMethod[];
}

export const PaymentMethodsView: React.FC<paymentMethodsProps> = ({
  payments,
}) => {
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
          {payments.map((paymentMethod) => (
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
};
