import { redirect } from "next/navigation";
import getSession from "./session";

interface IUserProps {
  id: number;
}

export async function userLogin(user: IUserProps) {
  const session = await getSession();
  session.id = user.id;
  await session.save();
  return redirect("/profile");
}
