'use client';

import { motion } from 'framer-motion';

type DashboardHeaderProps = {
  userName: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
};

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#050C1F] via-[#091734] to-[#0E1030] px-8 py-10 shadow-[0_40px_120px_-80px_rgba(15,23,42,1)] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,183,0,0.18),transparent_65%)]" />
      <div className="relative space-y-2">
        <p className="text-sm uppercase tracking-[0.35em] text-white/60">Bienvenue</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {`Bienvenue, ${userName} 👋`}
        </h1>
        <p className="text-white/60">Prêt à continuer ton apprentissage ?</p>
      </div>
    </motion.header>
  );
}

export default DashboardHeader;

