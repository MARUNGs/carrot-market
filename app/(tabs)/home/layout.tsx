interface LayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function HomeLayout({ children, modal }: LayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
