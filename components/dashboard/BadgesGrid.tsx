'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

type Badge = {
  id: string;
  title: string;
  description: string;
  obtainedAt?: string;
  unlocked: boolean;
};

type BadgesGridProps = {
  recentBadges: Badge[];
  upcomingBadges: Badge[];
};

export function BadgesGrid({ recentBadges, upcomingBadges }: BadgesGridProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0B1728]">Badges récents</h3>
          <span className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Collection</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {recentBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px' }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl border border-[#E2E8F0] bg-white/80 p-4 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.35)]"
            >
              <div className="absolute inset-0 rounded-2xl border border-[#F5B700]/30 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5B700] via-[#FFD166] to-[#FFF3B0] text-[#0B1728] shadow-[0_18px_40px_-24px_rgba(245,183,0,0.7)]"
                  >
                    ✨
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1728]">{badge.title}</p>
                    <p className="text-xs text-[#64748B]">{badge.description}</p>
                  </div>
                </div>
                {badge.obtainedAt && (
                  <p className="mt-4 text-xs text-[#64748B]">Débloqué le {badge.obtainedAt}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_90px_-65px_rgba(15,23,42,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0B1728]">Objectifs à atteindre</h3>
          <span className="text-xs uppercase tracking-[0.3em] text-[#64748B]">À débloquer</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {upcomingBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px' }}
              transition={{ duration: 0.45 }}
              className="relative rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFF] p-4"
            >
              <div className="absolute inset-0 rounded-2xl border border-[#CBD5E1]/50 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              <div className="relative flex items-start gap-3">
                <span
                  className={clsx(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CBD5E1] text-[#94A3B8] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.2)]',
                    !badge.unlocked && 'bg-[#E2E8F0]/40'
                  )}
                >
                  {badge.unlocked ? '🏆' : '🔒'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0B1728]">{badge.title}</p>
                  <p className="text-xs text-[#64748B]">{badge.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BadgesGrid;

