export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/;
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 대소문자 1자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다.";
