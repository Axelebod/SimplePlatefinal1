import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw } from 'lucide-react';

interface DecisionWheelProps {
  choices: string[];
}

export const DecisionWheel: React.FC<DecisionWheelProps> = ({ choices }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxChoices = 20;
  const displayChoices = choices.slice(0, maxChoices);
  const numChoices = displayChoices.length;
  const anglePerChoice = numChoices > 0 ? 360 / numChoices : 0;

  useEffect(() => {
    if (!canvasRef.current || numChoices === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400;
    const center = size / 2;
    const radius = size / 2 - 10;

    canvas.width = size;
    canvas.height = size;

    // Couleurs pour la roue
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#330867',
      '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f', '#ff9a9e',
      '#a1c4fd', '#c2e9fb', '#ffecd2', '#fcb69f', '#ff9a9e'
    ];

    // Dessiner la roue
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotation * Math.PI) / 180);

    displayChoices.forEach((choice, index) => {
      const startAngle = (index * anglePerChoice - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * anglePerChoice - 90) * (Math.PI / 180);

      // Dessiner le segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessiner le texte
      ctx.save();
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(choice.length > 15 ? choice.substring(0, 15) + '...' : choice, radius / 2, 0);
      ctx.restore();
    });

    ctx.restore();

    // Dessiner le centre
    ctx.beginPath();
    ctx.arc(center, center, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#2d3561';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Dessiner le pointeur
    ctx.beginPath();
    ctx.moveTo(center, 10);
    ctx.lineTo(center - 15, 40);
    ctx.lineTo(center + 15, 40);
    ctx.closePath();
    ctx.fillStyle = '#2d3561';
    ctx.fill();
  }, [displayChoices, rotation, numChoices, anglePerChoice]);

  const spinWheel = () => {
    if (isSpinning || numChoices === 0) return;

    setIsSpinning(true);
    setSelectedChoice(null);

    // Rotation aléatoire (au moins 3 tours complets + angle aléatoire)
    const spins = 3 + Math.random() * 2; // 3 à 5 tours
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomAngle;

    setRotation(totalRotation);

    // Calculer le choix sélectionné après l'animation
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const adjustedAngle = (normalizedRotation + 90) % 360; // Ajuster pour le pointeur en haut
      const selectedIndex = Math.floor(adjustedAngle / anglePerChoice) % numChoices;
      setSelectedChoice(displayChoices[selectedIndex]);
      setIsSpinning(false);
    }, 3000); // Durée de l'animation (3 secondes)
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            width: '400px',
            height: '400px'
          }}
        />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-neo-violet"></div>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || numChoices === 0}
        className={`
          px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all
          ${isSpinning
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
            : 'bg-neo-violet text-white hover:bg-purple-500 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]'
          }
        `}
      >
        {isSpinning ? (
          <>
            <RotateCw className="w-5 h-5 animate-spin" />
            La roue tourne...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Faire tourner la roue
          </>
        )}
      </button>

      {selectedChoice && (
        <div className="mt-6 p-6 bg-neo-green border-2 border-black dark:border-white rounded-lg shadow-neo dark:shadow-[4px_4px_0px_0px_#fff] animate-in zoom-in-95 duration-500">
          <h3 className="text-2xl font-display font-bold text-center mb-2 dark:text-white">
            🎯 Résultat
          </h3>
          <p className="text-3xl font-bold text-center dark:text-white">
            {selectedChoice}
          </p>
        </div>
      )}

      {numChoices > maxChoices && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          ⚠️ Seuls les {maxChoices} premiers choix sont affichés sur la roue
        </p>
      )}
    </div>
  );
};

