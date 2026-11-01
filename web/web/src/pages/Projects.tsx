export default function Projects() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-white">My Projects</h1>
      <div className="mt-8 rounded-xl border border-dashed border-zinc-700 p-10">
        <p className="font-medium text-white">No saved projects</p>
        <p className="mt-2 text-sm text-zinc-400">
          Saving projects needs a database and file storage, which arrive in Phase 8. Until then, nothing is stored
          here, and this page will stay empty rather than show sample data.
        </p>
      </div>
    </div>
  );
}
