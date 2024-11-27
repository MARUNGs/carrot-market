// route.ts라고 명칭을 부여하면 NextJS에게 이 파일이 "API route 핸들러"라고 명시하는 것.

import { NextRequest } from "next/server";

// method를 정의할 필요없이 함수명을 method명으로 선언하면 자동으로 method에 맞는 request 처리를 수행한다.
export async function GET(request: NextRequest) {
  return Response.json({
    ok: true,
  });
}

// server action이 있기 전에 작업했던 예제. 더이상 이렇게 사용할 필요가 없다.
export async function POST(request: NextRequest) {
  const data = await request.json(); // request body를 읽어야 하므로 그것을 전달해준다.
  return Response.json(data);
}
