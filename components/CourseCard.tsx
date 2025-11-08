import Link from "next/link";

interface CourseCardProps {
  title: string;
  description: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  progress: number;
  icon: string;
  href?: string;
  onClick?: () => void;
}

export default function CourseCard({
  title,
  description,
  difficulty,
  progress,
  icon,
  href = "/parcours",
  onClick,
}: CourseCardProps) {
  const difficultyColors = {
    Débutant: "bg-green-100 text-green-700 border-green-200",
    Intermédiaire: "bg-blue-100 text-blue-700 border-blue-200",
    Avancé: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const CardContent = (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition-all border border-gray-200 h-full flex flex-col">
      {/* Icon */}
      <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
        <span className="text-4xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-2">
        {description}
      </p>

      {/* Difficulty Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progression</span>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto">
        <button
          onClick={onClick}
          className="w-full bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:scale-105 hover:shadow-md transition-all"
        >
          Voir le détail
        </button>
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{CardContent}</div>;
  }

  return <Link href={href}>{CardContent}</Link>;
}
