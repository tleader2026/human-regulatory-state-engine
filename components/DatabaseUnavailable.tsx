export function DatabaseUnavailable({ message }: { message: string }) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <h2 className="font-semibold">Database setup required</h2>
      <p className="mt-2 text-sm leading-6">{message}</p>
      <p className="mt-3 text-sm leading-6">
        This app is currently configured as a local-first SQLite MVP. For hosted Vercel usage,
        configure a persistent database and run the Prisma schema/seed setup before using intake or admin workflows.
      </p>
    </section>
  );
}
