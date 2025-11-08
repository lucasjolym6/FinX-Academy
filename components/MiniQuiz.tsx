"use client";

import { useState } from "react";

interface Question {
  question: string;
  answer: string;
}

interface MiniQuizProps {
  questions: Question[];
}

export default function MiniQuiz({ questions }: MiniQuizProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const handleRevealAnswer = (index: number) => {
    const newRevealed = [...revealedAnswers];
    newRevealed[index] = true;
    setRevealedAnswers(newRevealed);
  };

  return (
    <div className="space-y-6">
      {questions.map((item, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A2540] text-white text-sm font-bold flex-shrink-0">
              {index + 1}
            </span>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h4>
              {revealedAnswers[index] ? (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                  <p className="text-green-800 font-semibold mb-2">Réponse :</p>
                  <p className="text-green-900">{item.answer}</p>
                </div>
              ) : (
                <button
                  onClick={() => handleRevealAnswer(index)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors text-sm"
                >
                  Voir la réponse
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

