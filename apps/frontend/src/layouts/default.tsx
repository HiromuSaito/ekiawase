import Header from "../components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="px-6 py-4">{children}</main>
    </div>
  );
}
