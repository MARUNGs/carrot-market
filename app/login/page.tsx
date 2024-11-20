"use client";
import FormInput from "@/components/form-input";
import FormButton from "@/components/form-button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { onSubmit } from "./actions";

export default function Login() {
  /*
    Server Action 위치변경... 
    왜냐하면 'use client'로 선언된 컴포넌트 내에서 'use server'로 선언된 Server Action을 사용할 수 없기 때문이다.
  */

  /*
      만약, Server Action에서 오류가 발생하면 어떻게 해야할까? 
      useFormState: 이 훅을 사용하려면 결과를 알고싶은 Server Action을 인자로 넘겨줘야 한다.
      useState 훅이랑 비슷함.
      마찬가지로, useState 훅과 비슷한 것처럼 두번째 인자로 기본값을 필수로 초기화해줘야 한다.
    */
  const [state, action] = useFormState(onSubmit, null);
  console.log(state);

  /*
    Q. Server Action의 경과가 얼마나 걸릴까?
    A. 사용자는 알 수 없다. 따라서 Server Action의 작업이 좀 걸린다는 것을 알려줘야 한다.
       ReactJS hook 이용: useFormStatus

    여러가지 속성 중, 'pending'은 함수가 끝난 여부를 상태로 알려주는 속성이다.
    단, useFormStatus 훅은 action을 실행하는 form과 같은 영역에서 사용할 수 없다.
    반드시 form의 상태에 따라 변경하고자 하는 component 내부에서만 사용이 가능하다.
    useFormStatus는 자동으로 부모 요소를 찾게 된다. (form)
  */
  // const { pending } = useFormStatus(); // 여기서 사용불가.

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hi!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>

      {/* Server Action 자체를 설정하면 내부오류를 알 수 없을 것이다. useFormState의 트리거를 넣어주어야 한다. */}
      <form action={action} className="flex flex-col gap-3">
        {/* custom input */}
        <FormInput name="email" type="email" placeholder="Email" required />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
        />
        <FormButton text="Login" />
      </form>

      <SocialLogin />
    </div>
  );
}
