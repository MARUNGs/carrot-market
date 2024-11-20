"use client";
import FormInput from "@/components/form-input";
import FormButton from "@/components/form-button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  console.log(state);

  return (
    <>
      <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">Hi!</h1>
          <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <form action={action} className="flex flex-col gap-3">
          {/* custom input */}
          <FormInput
            name="username"
            type="text"
            placeholder="Username"
            required
            errors={state?.fieldErrors.username}
          />
          <FormInput
            name="email"
            type="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors.email}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="password"
            required
            errors={state?.fieldErrors.password}
          />
          <FormInput
            name="passwordConfirm"
            type="password"
            placeholder="password confirm"
            required
            errors={state?.fieldErrors.passwordConfirm}
          />
          <FormButton text="Create Account" />
        </form>

        <SocialLogin />
      </div>
    </>
  );
}
