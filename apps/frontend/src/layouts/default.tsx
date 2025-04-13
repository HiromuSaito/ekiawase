import Header from "../components/Header";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}
