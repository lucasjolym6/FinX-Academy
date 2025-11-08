"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getJobsByCareerPath, type Job } from "@/data/jobs";
import Link from "next/link";

export default function FinanceMarchePage() {
  const router = useRouter();
  const jobs = getJobsByCareerPath("market-finance");

  return (
    <main className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/entretien-ia" 
            className="text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-2xl mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Finance de marché
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sélectionnez le métier pour lequel vous souhaitez vous préparer
          </p>
        </motion.div>

        {/* Liste des métiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/entretien-ia/simulation?career=market-finance&job=${job.id}`}
                className="block h-full"
              >
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 flex-1">
                    {job.description}
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Exemple de question :</p>
                    <p className="text-sm text-primary italic">
                      &quot;{job.exampleQuestions[0]}&quot;
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-primary font-semibold">
                    <span>Choisir ce métier</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

