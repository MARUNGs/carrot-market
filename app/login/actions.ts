"use server";

import { redirect } from "next/navigation";

// Server Action
export async function onSubmit(prevState: any, formData: FormData) {
  // Server Action이 이전에 반환했던 값이 prevState로 매핑된다.
  console.log(prevState);

  /*
    이 함수 내에서만 서버 역할을 하게 된다. 무조건 비동기 함수에서만 사용이 가능하다.
    form을 이용한 submit기능을 사용할때 보낸 데이터를 확인하려면 input의 name 속성을 사용해야 한다.
  */
  await new Promise((resolve) => setTimeout(resolve, 5000));
  redirect("/");
  return { errors: ["wrong...", "패스워드가 짧아요."] };
  /*
    데이터는 어떻게 받아와야하는가?
    Server Action으로 선언한 함수는 기본적으로 파라미터에 FormData를 받을 수 있다. (타입 중요)
    그 상태에서 매핑되는 key값(input의 name)을 get()함수로 호출하여 가져올 수 있다.
  */
  console.log(formData.get("email"), formData.get("password"));
}
