// Prisma Client 호출
import { PrismaClient } from "@prisma/client";

// Prisma Client 초기화
const db = new PrismaClient();

async function test() {
  /*
  const token = await db.sMSToken.create({
    data: {
      token: "1234",
      user: {
        connect: { id: 2 },
      },
    },
  });
  */

  // 토큰찾기
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
      userId: 2,
    },
    // include: 관계를 포함하는 데 사용
    include: {
      user: true,
    },
  });

  console.log(token);
}

test();

export default db;

/*
  사용자는 타입스크립트를 이용해서 SQL을 만들었고 SQL로서 DB로 전달되었다.
  DB는 SQL 객체로 응답하게 된다.
  Prisma는 응답받은 결과값을 타입스크립트 객체로 변경하여 보여준다.
*/
