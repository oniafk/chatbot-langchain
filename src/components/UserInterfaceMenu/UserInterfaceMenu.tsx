"use client";

import { Separator } from "@/components/ui/separator";
import { ShowUserInfo } from "./UserInfoView";
import { PaymentMethodsView } from "./PaymentMethodView";
import { OrderView } from "./OrdersView";
import { useEffect, useState } from "react";
import {
  order,
  paymentMethod,
  userInfo,
} from "../../interfaces/userInfoInterfaces";

const UserInterfaceMenu = () => {
  const [currentView, setCurrentView] = useState("OrderView");
  const [data, setData] = useState<{
    orders: order[];
    payments: paymentMethod[];
    user: userInfo[];
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const responseOrders = await fetch(
        "https://chatbot-langchain-backend.onrender.com/all-order-info"
      );
      const responsePayments = await fetch(
        "https://chatbot-langchain-backend.onrender.com/payment-methods"
      );
      const responseUser = await fetch(
        "https://chatbot-langchain-backend.onrender.com/users"
      );

      if (!responseOrders.ok || !responsePayments.ok || !responseUser.ok) {
        throw new Error("Failed to fetch");
      }

      const dataOrders = await responseOrders.json();
      const dataPayments = await responsePayments.json();
      const dataUser = await responseUser.json();

      const data = {
        orders: dataOrders.orders,
        payments: dataPayments.paymentMethods,
        user: dataUser.users,
      };

      console.log(data, "data");
      setData(data);
    };
    fetchUserData();
  }, []);

  const changeComponentStatus = () => {
    switch (currentView) {
      case "OrderView":
        return <OrderView orders={data?.orders ?? []} />;
      case "PaymentMethodsView":
        return <PaymentMethodsView payments={data?.payments ?? []} />;
      case "UserInfo":
        return <ShowUserInfo user={data?.user ?? []} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen grid place-items-center ">
      <section className="bg-slate-100 w-4/5 h-4/5 rounded-md max-w-7xl">
        <div className="w-full h-full py-2 px-3">
          <div className="h-auto">
            <h3 className=" text-gray-900 text-xl font-bold mb-2">
              AI-Powered Order Support Chatbot
            </h3>
            <p className="text-gray-800 mb-3 font-normal text-sm">
              Streamline your order fulfillment process with this AI-driven
              chatbot solution. Designed to provide personalized and efficient
              support, this platform combines advanced natural language
              processing capabilities with a comprehensive knowledge base of
              your company&apos;s policies and procedures.
              <br />
              The intuitive interface features a customer information menu,
              allowing users to easily access and review their order details. At
              the core of the solution lies an intelligent chatbot, empowered by
              cutting-edge language models and tailored to your business needs.
              <br />
              Customers can engage in natural conversations, inquiring about
              undelivered or delayed orders, and receive accurate,
              contextualized resolutions in real-time. By leveraging AI to
              automate and optimize the order support process, you can enhance
              customer satisfaction, reduce operational costs, and streamline
              your overall fulfillment workflow.
            </p>
          </div>
          <Separator className="bg-slate-900" />
          <div className="mt-2 h-5/6">
            <section className="flex flex-row h-full items-center space-x-1 text-sm">
              <aside className="flex flex-col text-gray-900 text-sm gap-3 h-full w-auto p-1 font-medium pt-10">
                <a
                  href="#"
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView("UserInfo");
                  }}
                >
                  User Info
                </a>
                <a
                  href="#"
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView("OrderView");
                  }}
                >
                  Orders
                </a>
                <a
                  href="#"
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView("PaymentMethodsView");
                  }}
                >
                  Payment methods
                </a>
              </aside>
              <Separator orientation="vertical" className="bg-slate-700 " />
              <div className=" text-gray-900 h-full grid p-2 w-full">
                {changeComponentStatus()}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
export default UserInterfaceMenu;
