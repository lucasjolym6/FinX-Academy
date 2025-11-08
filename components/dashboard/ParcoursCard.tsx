'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type Parcours = {
  id: string;
  title: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  description: string;
  progress: number;
  icon: React.ReactNode;
  href?: string;
};

type ParcoursCardProps = {
  parcours: Parcours;
};

const levelColors: Record<Parcours['level'], string> = {
  Débutant: 'from-[#10B981]/20 to-transparent text-[#047857]',
  Intermédiaire: 'from-[#3B82F6]/20 to-transparent text-[#1D4ED8]',
  Avancé: 'from-[#F97316]/20 to-transparent text-[#C2410C]',
};

export function ParcoursCard({ parcours }: ParcoursCardProps) {
  const { title, level, description, progress, icon, href } = parcours;
  const gradient = levelColors[level] ?? 'from-[#3B82F6]/20 to-transparent text-[#1D4ED8]';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_100px_-65px_rgba(15,23,42,0.55)] transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#0B1728] shadow-[0_15px_40px_-30px_rgba(15,23,42,0.45)]">
            {icon}
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em]`}
          >
            {level}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#0B1728] sm:text-xl">{title}</h3>
          <p className="text-sm leading-relaxed text-[#475569]">{description}</p>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#64748B]">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00B4D8] via-[#3F76FF] to-[#F5B700]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Link
          href={href ?? '#'}
          aria-label={`Ouvrir le parcours ${title}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#0B1728] transition-all duration-300 hover:border-[#0B1728] hover:bg-[#0B1728]/5"
        >
          Voir le détail
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="text-base"
          >
            →
          </motion.span>
        </Link>
      </div>
    </motion.article>
  );
}

export default ParcoursCard;

