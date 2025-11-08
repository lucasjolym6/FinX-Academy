'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Bot, Gamepad2, Users } from 'lucide-react';

const features: Array<{
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  cta: string;
}> = [
  {
    title: 'Parcours corporate immersifs',
    subtitle: 'Modules & Cas réels',
    description:
      "Accède à des modules structurés, des cas concrets et des dashboards dynamiques pour maîtriser la finance d'entreprise.",
    icon: Briefcase,
    cta: 'Explorer les parcours',
  },
  {
    title: 'IA Coaching personnalisé',
    subtitle: 'Analyse & Feedback IA',
    description:
      "Analyse tes réponses orales avec notre IA, identifie tes forces et reçois des recommandations ciblées instantanément.",
    icon: Bot,
    cta: "Découvrir l'entraînement IA",
  },
  {
    title: 'Progression gamifiée',
    subtitle: 'XP, Badges & Streaks',
    description:
      'Débloque XP, badges et streaks pour rester motivé et suivre ta montée en puissance sur chaque compétence clé.',
    icon: Gamepad2,
    cta: 'Activer la progression',
  },
  {
    title: 'Communauté & Mentoring',
    subtitle: 'Mentorat premium',
    description:
      'Rejoins une communauté sélective de financiers, échange avec des mentors et accède à des sessions live exclusives.',
    icon: Users,
    cta: 'Rejoindre la communauté',
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2 + index * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function FeaturesSection() {
  return (
    <section
      id="why-finx"
      className="relative isolate overflow-hidden py-28 px-6"
    >
      <div className="absolute inset-0 -z-10 bg-white" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -100px' }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center rounded-full border border-[#0B1728]/10 bg-[#0B1728]/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#0B1728]/70"
          >
            Finance augmentée par l&apos;IA
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl sm:text-[2.75rem] font-semibold text-[#0B1728]"
          >
            Une plateforme qui fusionne expertise corporate, IA et motivation.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-4 text-lg text-[#334155]"
          >
            Chaque brique de FinX Academy est pensée pour accélérer ta maîtrise, te coacher avec l’IA et te connecter aux meilleurs mentors.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map(({ title, subtitle, description, icon: Icon, cta }, index) => (
            <motion.article
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -100px' }}
              variants={containerVariants}
              custom={index}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white p-8 shadow-[0_25px_90px_-60px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-2 hover:border-[#90A4FF]/40 hover:shadow-[0_35px_110px_-55px_rgba(144,164,255,0.55)]"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#F5F7FF] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute -top-24 right-[-10%] h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.18),transparent_60%)] blur-[60px]" />
              <div className="absolute -bottom-28 left-[-15%] h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,183,0,0.15),transparent_60%)] blur-[70px]" />

              <div className="relative flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#0B1728] shadow-[0_15px_40px_-30px_rgba(2,6,23,0.8)]">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4B5A6B]">
                    {subtitle}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-[#0B1728] sm:text-2xl">
                    {title}
                  </h3>
                </div>
              </div>

              <p className="relative mt-6 text-base leading-relaxed text-[#4B5A6B]">
                {description}
              </p>

              <div className="relative mt-10 flex items-center justify-between">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-5 py-2 text-sm font-semibold text-[#0B1728] transition-colors duration-300 hover:border-[#0B1728] hover:bg-[#0B1728]/5"
                >
                  {cta}
                  <span className="text-lg">→</span>
                </Link>
                <div className="flex gap-1">
                  <span className="h-1 w-6 rounded-full bg-[#CBD5F5]" />
                  <span className="h-1 w-6 rounded-full bg-[#CBD5F5]/70" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

