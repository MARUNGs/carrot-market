import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 커스텀 className을 부여할 수 있다.
    extend: {
      margin: {
        tomato: "120px",
      },
      borderRadius: {
        "sexy-name": "11.11px",
      },
    },
  },
  // plugins: base, utilities, components layer 확장하는 역할.
  plugins: [
    formsPlugin, // 유틸리티를 사용하여 form 요소를 쉽게 재정의할 수 있도록 form 스타일에 대한 기본 reset을 제공하는 플러그인
    // 추천: DaisyUI
  ],
};
export default config;
