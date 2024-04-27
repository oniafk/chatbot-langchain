import { Separator } from "@/components/ui/separator";
import { ShowUserInfo } from "./UserInfoView";
import { PaymentMethodsView } from "./PaymentMethodView";
import { OrderView } from "./OrdersView";

const UserInterfaceMenu = () => {
  return (
    <div className="w-screen h-screen grid place-items-center ">
      <section className="bg-slate-100 w-4/5 h-3/5 rounded-md max-w-3xl">
        <div className="w-full h-full py-2 px-3">
          <div className="h-auto">
            <h3 className=" text-gray-900 text-xl font-bold mb-2">
              Project Description
            </h3>
            <p className=" text-gray-800 mb-3 font-light text-sm ">
              Project description with example of prompts
            </p>
          </div>
          <Separator className="bg-slate-900" />
          <div className="mt-2 h-5/6">
            <section className="flex flex-row h-full items-center space-x-1 text-sm">
              <aside className="flex flex-col text-gray-900 text-sm gap-3 h-full w-auto p-1 font-medium ">
                <a
                  href=""
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                >
                  User Info
                </a>
                <a
                  href=""
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                >
                  Orders
                </a>
                <a
                  href=""
                  className="hover:bg-gray-300 rounded-md  w-full h-auto py-2 px-3"
                >
                  Payment methods
                </a>
              </aside>
              <Separator orientation="vertical" className="bg-slate-700 " />
              <div className=" text-gray-900 h-full grid p-2 w-full">
                <OrderView />
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};
export default UserInterfaceMenu;
