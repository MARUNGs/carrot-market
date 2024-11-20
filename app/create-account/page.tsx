"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

  return (
    <>
      <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">Hi!</h1>
          <h2 className="text-xl">Fill in the form below to join!</h2>
        </div>
        <form action={action} className="flex flex-col gap-3">
          {/* custom input */}
          <Input
            name="username"
            type="text"
            placeholder="Username"
            required
            errors={state?.fieldErrors.username}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors.email}
          />
          <Input
            name="password"
            type="password"
            placeholder="password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors.password}
          />
          <Input
            name="passwordConfirm"
            type="password"
            placeholder="password confirm"
            required
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors.passwordConfirm}
          />
          <Button text="Create Account" />
        </form>

        <SocialLogin />
      </div>
    </>
  );
}
