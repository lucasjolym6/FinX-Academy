import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-primary mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Désolé, la page que vous recherchez n&apos;existe pas.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover-scale hover:shadow-md transition-all"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

