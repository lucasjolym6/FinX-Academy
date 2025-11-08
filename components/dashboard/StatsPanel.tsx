'use client';

import { motion } from 'framer-motion';

type StatItem = {
  label: string;
  value: string;
  trend?: string;
};

type StatsPanelProps = {
  headline: string;
  stats: StatItem[];
};

export function StatsPanel({ headline, stats }: StatsPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_35px_110px_-70px_rgba(15,23,42,0.55)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0B1728]">{headline}</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Temps réel</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white via-[#F9FAFF] to-white p-4"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#64748B]">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0B1728]">{stat.value}</p>
            {stat.trend && <p className="text-xs text-[#3B82F6]">{stat.trend}</p>}
          </div>
        ))}
      </div>
    </motion.aside>
  );
}

export default StatsPanel;

