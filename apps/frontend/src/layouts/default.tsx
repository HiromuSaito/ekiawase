import Header from "../components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4">
      <Header />
      <main>{children}</main>
    </div>
  );
}
