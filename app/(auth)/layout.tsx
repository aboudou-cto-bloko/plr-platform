export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
