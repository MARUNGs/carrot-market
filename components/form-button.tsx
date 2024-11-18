interface IFormButtonProps {
  // 버튼 타입 선언할 경우
  // type: React.ButtonHTMLAttributes< HTMLButtonElement >["type"];
  loading: boolean;
  text: string;
}

export default function FormButton({ loading, text }: IFormButtonProps) {
  // 버튼은 로딩중일 때 비활성화되어 있어야할 수도 있으므로 disable 속성을 사용한다.
  return (
    <button
      disabled={loading}
      className="primary-btn h-10
      disabled:bg-neutral-400
      disabled:text-neutral-300
      disabled:cursor-not-allowed"
    >
      {loading ? "로딩중" : text}
    </button>
  );
}
