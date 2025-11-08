"use client";

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface RadarChartProps {
  scores: {
    pertinenceTechnique: number;
    clarte: number;
    confianceOrale: number;
    vocabulaireProfessionnel: number;
  };
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = [
    {
      category: "Pertinence technique",
      value: scores.pertinenceTechnique,
      fullMark: 100,
    },
    {
      category: "Clarté & structure",
      value: scores.clarte,
      fullMark: 100,
    },
    {
      category: "Confiance orale",
      value: scores.confianceOrale,
      fullMark: 100,
    },
    {
      category: "Vocabulaire pro.",
      value: scores.vocabulaireProfessionnel,
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="category" 
          tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]}
          tick={{ fill: "#6b7280", fontSize: 11 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#0A2540"
          fill="#0A2540"
          fillOpacity={0.6}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}

