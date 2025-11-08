import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white py-12 md:py-16 px-4 md:px-6 mt-20 border-t border-[#12335f]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6 hover:opacity-80 transition-opacity">
              <Logo className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Apprenez la finance de manière gamifiée et motivante. Développez vos compétences avec des parcours structurés et des simulations d&apos;entretien.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-base mb-6 text-white">Navigation</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#F5B301] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/parcours" className="hover:text-[#F5B301] transition-colors">
                  Parcours
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#F5B301] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/entretien-ia" className="hover:text-[#F5B301] transition-colors">
                  Entretien IA
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-[#F5B301] transition-colors">
                  Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-bold text-base mb-6 text-white">Ressources</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  Guide de démarrage
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-6 text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F5B301] transition-colors">
                  Contactez-nous
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#12335f] mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 FinX Academy. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

