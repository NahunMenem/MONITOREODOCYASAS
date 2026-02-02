export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--docya-dark-1)] via-[var(--docya-dark-2)] to-[var(--docya-dark-3)]">
      {children}
    </div>
  );
}
