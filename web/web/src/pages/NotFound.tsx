import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-zinc-400">That page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-fuchsia-300 hover:text-white">
        Back to home
      </Link>
    </div>
  );
}
