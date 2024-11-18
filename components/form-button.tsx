"use client";
import { useFormStatus } from "react-dom";

interface IFormButtonProps {
  // 버튼 타입 선언할 경우
  // type: React.ButtonHTMLAttributes< HTMLButtonElement >["type"];
  // loading: boolean; // useFormStatus을 활용하여 로딩상태를 관리할 것이므로 이 prop은 필요없음
  text: string;
}

export default function FormButton({ text }: IFormButtonProps) {
  // 버튼은 로딩중일 때 비활성화되어 있어야할 수도 있으므로 disable 속성을 사용한다.

  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10
      disabled:bg-neutral-400
      disabled:text-neutral-300
      disabled:cursor-not-allowed"
    >
      {pending ? "로딩중" : text}
    </button>
  );
}
