import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  const { id } = session;

  if (id) {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (user) return user;
  }

  notFound(); // 불특정 경로로 진입하여 sessio이 없거나, session.id를 찾지 못했을 경우
}

// 비동기
export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    // inline server action
    "use server";
    const session = await getSession();
    session.destroy(); // cookie 사라짐
    redirect("/");
  };

  return (
    <div>
      <h1>{user!.name}님의 페이지입니다.</h1>
      <form action={logout}>
        {/* onClick을 사용하게 된다면 상호작용하는 것이기 때문에 client component로 인식하게 된다. */}
        {/* 따라서, form을 submit하면 inline server action 처리가 가능하다. */}
        <button>Logout</button>
      </form>
    </div>
  );
}
