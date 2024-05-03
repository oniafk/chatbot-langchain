import { getUserInfo } from "../../app/dataBaseRequests/userInfo";

export async function ShowUserInfo() {
  const userInfo = await getUserInfo();
  const user = userInfo.users[0];

  return (
    <div>
      <section className="w-full h-auto flex flex-col gap-3 px-3">
        <div className="mb-2">
          <h3 className="text-xl text-slate-900 font-bold">Profile</h3>
        </div>
        <div className=" flex flex-col space-y-5">
          <div className=" flex gap-3">
            <div className=" w-36">
              <h4 className=" text-sm font-semibold text-slate-700 mb-2">
                First Name
              </h4>
              <p className="w-full border border-slate-300  px-2 py-1 rounded-md ">
                {user.user_first_name}
              </p>
            </div>
            <div className=" w-40">
              <h4 className=" text-sm font-semibold text-slate-700 mb-2">
                Last Name
              </h4>
              <p className="w-full border border-slate-300  px-2 py-1 rounded-md ">
                {user.user_last_name}
              </p>
            </div>
          </div>
          <div>
            <h4 className=" text-sm font-semibold text-slate-700 mb-2">
              Email
            </h4>
            <p className="w-full border border-slate-300  px-2 py-1 rounded-md ">
              {user.user_email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
