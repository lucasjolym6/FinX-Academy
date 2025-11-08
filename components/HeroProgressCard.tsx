export default function HeroProgressCard() {
  const modules = [
    { name: "Module 1 – Fondamentaux", progress: 80 },
    { name: "Module 2 – Diagnostic financier", progress: 35 },
    { name: "Module 3 – Stratégie avancée", progress: 0 },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 w-full max-w-[380px] hover:-translate-y-1 hover:shadow-3xl transition-all duration-300">
      {/* Titre */}
      <h3 className="text-white text-xl font-bold mb-2">Ta progression</h3>
      <p className="text-gray-300 text-sm mb-6">Finance d&apos;entreprise – Module 1</p>

      {/* Progression par module */}
      <div className="space-y-4 mb-6">
        {modules.map((module, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-medium">{module.name}</span>
              <span className="text-gray-200 text-sm font-semibold">{module.progress}%</span>
            </div>
            <div className="bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F5B301] h-2 rounded-full transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Badge à débloquer */}
      <div className="mb-6">
        <p className="text-gray-300 text-xs mb-3">Prochain badge</p>
        <div className="bg-white/10 rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🔰</div>
            <div>
              <p className="text-white font-semibold text-sm">Analyste junior</p>
              <p className="text-gray-300 text-xs">Complète le Module 1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phrase motivante */}
      <div className="pt-4 border-t border-white/20">
        <p className="text-gray-200 text-sm text-center">
          Plus que 2 leçons pour monter de niveau 🚀
        </p>
      </div>
    </div>
  );
}

