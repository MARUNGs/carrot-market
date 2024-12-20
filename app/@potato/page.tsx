/**
 * Pareller Routes :: 병렬 라우팅
 * NextJS의 최상위 layout.tsx에서 children, pareller route props가 둘다 적용되는데
 * root(/) 경로를 제외한 나머지 children url은, NextJS가 pareller route에도 url 적용 시 매핑되는 url이 없으면
 * 404 ERROR를 띄우게 된다.
 */

export default function Potato() {
  return <h1>I match</h1>;
}
