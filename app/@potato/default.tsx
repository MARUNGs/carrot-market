/**
 * 기본적으로 렌더링될 페이지 (Pareller route)
 * 파일명이 무조건 default.tsx여야 한다.
 *
 * 최상위 layout.tsx에서 pareller route에 매핑되는 route가 없으면
 * layout.tsx에 사용된 pareller props는 default.tsx로 대체하게 된다.
 *
 * 그리고 사실 layout.tsx의 children props 또한 pareller 자체이다.
 * app/page.tsx ---> app/@children/page.tsx 와 같은 의미이다.
 */
export default function ParellerDefualt() {
  return <h1>I dont match!</h1>;
}
