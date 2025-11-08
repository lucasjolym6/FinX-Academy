'use client';

import { motion } from 'framer-motion';

type ProgressCardProps = {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  weeklyXp: number;
  streakDays: number;
};

export function ProgressCard({ level, currentXp, nextLevelXp, weeklyXp, streakDays }: ProgressCardProps) {
  const progress = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -100px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#050C1F] via-[#0D1F3F] to-[#151338] p-8 text-white shadow-[0_35px_110px_-70px_rgba(15,23,42,1)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(63,118,255,0.28),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,183,0,0.22),transparent_62%)]" />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Progression actuelle</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Niveau {level}</h2>
          <p className="text-white/60">Encore {nextLevelXp - currentXp} XP pour atteindre le niveau {level + 1}.</p>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/20">
            Continuer à progresser 🚀
          </button>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative h-32 w-32">
            <div
              className="absolute inset-0 rounded-full border-8 border-white/10"
              aria-hidden
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#3F76FF ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
              }}
            />
            <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-[#050C1F] to-[#111537] flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-white/50">XP</span>
              <span className="text-2xl font-semibold">{currentXp}</span>
              <span className="text-[0.65rem] text-white/50">/{nextLevelXp}</span>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/60">Progression</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/60">XP cette semaine</span>
              <span className="font-semibold text-[#F5B700]">+{weeklyXp} XP</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-white/60">Série en cours</span>
              <span className="font-semibold">🔥 {streakDays} jours</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default ProgressCard;

