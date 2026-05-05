export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="app-shell flex min-h-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tightest">{title}</h1>
          {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
