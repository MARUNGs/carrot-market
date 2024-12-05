"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

export default function SmsLogin() {
  const initState = {
    token: false,
    error: undefined,
  };

  const [state, action] = useFormState(smsLogin, initState);

  return (
    <>
      <div className="flex flex-col gap-10 py-8 px-6">
        <div className="flex flex-col gap-2 *:font-medium">
          <h1 className="text-2xl">SMS Login</h1>
          <h2 className="text-xl">Verify your phone number.</h2>
        </div>
        <form action={action} className="flex flex-col gap-3">
          <Input name="phone" type="text" placeholder="phone number" required />
          {state?.token ? (
            <Input
              name="token"
              type="number"
              placeholder="verification code"
              required
              errors={state.errors?.token}
            />
          ) : null}
          <Button
            text={state.token ? "Verify Token" : "Send Virification SMS"}
          />
        </form>
      </div>
    </>
  );
}
