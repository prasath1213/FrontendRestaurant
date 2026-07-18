import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="text-6xl font-bold text-ink-900">404</h1>
            <p className="mt-3 text-lg text-ink-600">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link
                to="/"
                className="btn-outline mt-6 inline-flex items-center gap-2"
            >
                Go back home
            </Link>
        </div>
    );
}