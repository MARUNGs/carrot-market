import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import FormInput from "../../components/form-input";
import FormButton from "@/components/form-button";

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
            type="text"
            placeholder="Username"
            required
            errors={["username is too short"]}
          />
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
          <FormInput
            type="password"
            placeholder="password confirm"
            required
            errors={["plz check password confirm"]}
          />
          <FormButton loading={true} text="Create Account" />
        </form>
        <div className="w-full h-px bg-neutral-500" />
        <div className="">
          <Link
            className="primary-btn flex h-10 items-center justify-center gap-3"
            href={`/sms`}
          >
            <span>
              <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
            </span>
            <span>Sing up with SMS</span>
          </Link>
        </div>
      </div>
    </>
  );
}
