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
  };

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
          errors={["plz check email"]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="password"
          required
          errors={["plz check password"]}
        />
        <FormButton loading={false} text="Create Account" />
      </form>

      <SocialLogin />
    </div>
  );
}
