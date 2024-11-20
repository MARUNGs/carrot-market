import { InputHTMLAttributes } from "react";

interface IInputProps {
  /*
    html attributes 전체를 받을 수 있도록 타입을 변경했기 때문에 기본설정한 props를 모두 지울 수 있게 된다.
    단, errors는 html attribute가 아니므로 설정해주어야 한다.
    그리고, 기본제공이지만 별도로 확인하고 싶은 기본 attribute도 그냥 선언하면 된다.

  type: React.InputHTMLAttributes<HTMLInputElement>["type"]; // 정확한 표현
  placeholder: string;
  required: boolean;
  */
  name: string;
  errors?: string[];
}

export default function Input({
  // type,
  // placeholder,
  // required,
  name,
  errors = [],
  // 모든 props를 가져오자!
  ...props
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  /* 기본 props 뿐만 아니라 input이 받을 수 있는 모든 html attributes 또한 받을 수 있도록 타입선언 */

  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        name={name}
        {...props}
        // type={type}
        // placeholder={placeholder}
        // required={required}
      />

      {errors?.map((error, i) => (
        <span key={i} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
