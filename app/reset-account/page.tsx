"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetAccountPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleReset = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Vous devez être connecté pour réinitialiser votre compte." });
      return;
    }

    // Confirmation
    const confirmed = window.confirm(
      "⚠️ ATTENTION : Cette action va supprimer TOUTES vos données (XP, badges, progression, quiz, examens).\n\nÊtes-vous sûr de vouloir continuer ?"
    );

    if (!confirmed) {
      return;
    }

    setIsResetting(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const errors: string[] = [];

      // Supprimer les résultats des examens
      const { error: examError } = await supabase
        .from("exam_results")
        .delete()
        .eq("user_id", user.id);
      if (examError) {
        console.error("Erreur lors de la suppression des exam_results:", examError);
        errors.push(`exam_results: ${examError.message}`);
      }

      // Supprimer les résultats des quiz
      const { error: quizError } = await supabase
        .from("quiz_results")
        .delete()
        .eq("user_id", user.id);
      if (quizError) {
        console.error("Erreur lors de la suppression des quiz_results:", quizError);
        errors.push(`quiz_results: ${quizError.message}`);
      }

      // Supprimer les leçons complétées
      const { error: lessonError } = await supabase
        .from("lesson_completion")
        .delete()
        .eq("user_id", user.id);
      if (lessonError) {
        console.error("Erreur lors de la suppression des lesson_completion:", lessonError);
        errors.push(`lesson_completion: ${lessonError.message}`);
      }

      // Supprimer les badges
      const { error: badgesError } = await supabase
        .from("user_badges")
        .delete()
        .eq("user_id", user.id);
      if (badgesError) {
        console.error("Erreur lors de la suppression des user_badges:", badgesError);
        errors.push(`user_badges: ${badgesError.message}`);
      }

      // Supprimer la progression des cours
      const { error: progressError } = await supabase
        .from("course_progress")
        .delete()
        .eq("user_id", user.id);
      if (progressError) {
        console.error("Erreur lors de la suppression des course_progress:", progressError);
        errors.push(`course_progress: ${progressError.message}`);
      }

      // Réinitialiser le profil (XP = 0, niveau = 1)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ xp: 0, level: 1 })
        .eq("id", user.id);
      if (profileError) {
        console.error("Erreur lors de la mise à jour du profil:", profileError);
        errors.push(`profiles: ${profileError.message}`);
      }

      // Nettoyer le localStorage
      localStorage.clear();

      if (errors.length > 0) {
        setMessage({
          type: "error",
          text: `Certaines erreurs se sont produites : ${errors.join(", ")}. Vérifiez la console pour plus de détails.`,
        });
      } else {
        setMessage({
          type: "success",
          text: "Votre compte a été réinitialisé avec succès ! Vous allez être redirigé vers le dashboard.",
        });

        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du compte:", error);
      setMessage({
        type: "error",
        text: `Une erreur s'est produite lors de la réinitialisation : ${error instanceof Error ? error.message : "Erreur inconnue"}. Vérifiez la console pour plus de détails.`,
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-lg mx-auto mt-12">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Réinitialisation du compte</h1>
            <p className="text-gray-700 mb-6">Vous devez être connecté pour réinitialiser votre compte.</p>
            <button
              onClick={() => router.push("/auth")}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-900 transition-all"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Réinitialisation du compte</h1>
          <p className="text-gray-700 mb-6">
            Cette action va supprimer <strong>toutes</strong> vos données :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>XP et niveau (retour à 0 XP, niveau 1)</li>
            <li>Tous les badges débloqués</li>
            <li>La progression de tous les cours</li>
            <li>Les leçons complétées</li>
            <li>Les résultats des quiz</li>
            <li>Les résultats des examens</li>
            <li>Les données du localStorage</li>
          </ul>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="w-full bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? "Réinitialisation en cours..." : "⚠️ Réinitialiser mon compte"}
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full mt-4 bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

