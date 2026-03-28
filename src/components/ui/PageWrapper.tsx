export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {children}
    </div>
  );
}