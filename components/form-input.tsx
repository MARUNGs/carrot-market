interface IFormInputProps {
  // type: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"]; // 정확한 표현
  name: string;
  placeholder: string;
  required: boolean;
  errors: string[];
}

export default function FormInput({
  type,
  name,
  placeholder,
  required,
  errors,
}: IFormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
      />

      {errors.map((error, i) => (
        <span key={i} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
