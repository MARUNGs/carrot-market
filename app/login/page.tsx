import FormInput from "@/components/form-input";
import FormButton from "@/components/form-button";
import SocialLogin from "@/components/social-login";

export default function Login() {
  // Server Action
  const onSubmit = async (formData: FormData) => {
    // 이 함수 내에서만 서버 역할을 하게 된다. 무조건 비동기 함수에서만 사용이 가능하다.
    // form을 이용한 submit기능을 사용할때 보낸 데이터를 확인하려면 input의 name 속성을 사용해야 한다.
    "use server";
    console.log("i run in the server.");
    // 데이터는 어떻게 받아와야하는가?
    // Server Action으로 선언한 함수는 기본적으로 파라미터에 FormData를 받을 수 있다. (타입 중요)
    // 그 상태에서 매핑되는 key값(input의 name)을 get()함수로 호출하여 가져올 수 있다.
    console.log(formData.get("email"), formData.get("password"));

    // Q. Server Action의 경과가 얼마나 걸릴까?
    // A. 사용자는 알 수 없다. 따라서 Server Action의 작업이 좀 걸린다는 것을 알려줘야 한다.
    //    ReactJS hook 이용: useFormStatus
  };

  // 여러가지 속성 중, 'pending'은 함수가 끝난 여부를 상태로 알려주는 속성이다.
  // 단, useFormStatus 훅은 action을 실행하는 form과 같은 영역에서 사용할 수 없다.
  // 반드시 form의 상태에 따라 변경하고자 하는 component 내부에서만 사용이 가능하다.
  // const { pending } = useFormStatus();
  // useFormStatus는 자동으로 부모 요소를 찾게 된다. (form)

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hi!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={onSubmit} className="flex flex-col gap-3">
        {/* custom input */}
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
          errors={[]}
        />
        <FormButton text="Login" />
      </form>

      <SocialLogin />
    </div>
  );
}
