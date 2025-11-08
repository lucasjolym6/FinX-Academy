interface LessonContentProps {
  title: string;
  content: string;
  keyPoints?: string[];
}

export default function LessonContent({ title, content, keyPoints }: LessonContentProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary mb-6">{title}</h2>

      {/* Contenu pédagogique */}
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      </div>

      {/* À retenir */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="bg-accent/10 border-l-4 border-accent rounded-r-lg p-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <span className="mr-2">💡</span>
            À retenir
          </h3>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-accent mr-2 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
