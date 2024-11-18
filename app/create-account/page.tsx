import FormInput from "@/components/form-input";
import FormButton from "@/components/form-button";
import SocialLogin from "@/components/social-login";

export default function CreateAccount() {
  return (
    <>
      <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">Hi!</h1>
          <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <form className="flex flex-col gap-3">
          {/* custom input */}
          <FormInput
            name="username"
            type="text"
            placeholder="Username"
            required
            errors={["username is too short"]}
          />
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
          <FormInput
            name="passwordConfirm"
            type="password"
            placeholder="password confirm"
            required
            errors={["plz check password confirm"]}
          />
          <FormButton loading={true} text="Create Account" />
        </form>

        <SocialLogin />
      </div>
    </>
  );
}
