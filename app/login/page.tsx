import FormInput from "@/components/form-input";
import FormButton from "@/components/form-button";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <>
      <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">Hi!</h1>
          <h2 className="text-xl">Log in with email and password.</h2>
        </div>
        <form className="flex flex-col gap-3">
          {/* custom input */}
          <FormInput
            type="email"
            placeholder="Email"
            required
            errors={["plz check email"]}
          />
          <FormInput
            type="password"
            placeholder="password"
            required
            errors={["plz check password"]}
          />
          <FormButton loading={true} text="Create Account" />
        </form>

        <SocialLogin />
      </div>
    </>
  );
}
