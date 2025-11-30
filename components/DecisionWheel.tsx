import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCw, Sparkles } from 'lucide-react';

interface DecisionWheelProps {
  choices: string[];
}

export const DecisionWheel: React.FC<DecisionWheelProps> = ({ choices }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const maxChoices = 20;
  const displayChoices = choices.slice(0, maxChoices);
  const numChoices = displayChoices.length;
  const anglePerChoice = numChoices > 0 ? 360 / numChoices : 0;

  const adjustBrightness = useCallback((color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }, []);

  // Fonction pour dessiner la roue
  const drawWheel = useCallback((ctx: CanvasRenderingContext2D, currentRotation: number) => {
    const size = 400; // Taille réduite pour être bien ronde
    const center = size / 2;
    const radius = size / 2 - 25; // Plus d'espace pour les bordures
    const innerRadius = 45;

    // Couleurs neo-brutalist du site
    const colors = [
      '#86efac', // neo-green
      '#a855f7', // neo-violet
      '#fbbf24', // neo-yellow
      '#3b82f6', // neo-blue
      '#ef4444', // neo-red
      '#10b981', // green
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#14b8a6', // teal
      '#6366f1', // indigo
      '#f97316', // orange
      '#84cc16', // lime
      '#22c55e', // emerald
      '#0ea5e9', // sky
      '#a855f7', // violet
      '#eab308', // yellow
      '#06b6d4', // cyan
      '#ec4899'  // pink
    ];

    ctx.clearRect(0, 0, size, size);
    
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((currentRotation * Math.PI) / 180);

    displayChoices.forEach((choice, index) => {
      const startAngle = (index * anglePerChoice - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * anglePerChoice - 90) * (Math.PI / 180);
      const midAngle = (startAngle + endAngle) / 2;

      const gradient = ctx.createLinearGradient(
        Math.cos(midAngle) * radius,
        Math.sin(midAngle) * radius,
        Math.cos(midAngle) * innerRadius,
        Math.sin(midAngle) * innerRadius
      );
      const baseColor = colors[index % colors.length];
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, adjustBrightness(baseColor, -20));

      ctx.beginPath();
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.arc(0, 0, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Bordure épaisse neo-brutalist
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.rotate(midAngle);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Inter, sans-serif';
      const textX = (radius + innerRadius) / 2;
      const text = choice.length > 15 ? choice.substring(0, 15) + '...' : choice;
      // Ombre du texte pour contraste
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(text, textX, 0);
      
      ctx.restore();
    });

    ctx.restore();
    ctx.restore();

    const centerGradient = ctx.createRadialGradient(center, center, 0, center, center, innerRadius);
    centerGradient.addColorStop(0, '#fff');
    centerGradient.addColorStop(1, '#f0f0f0');
    
    // Cercle central avec style neo-brutalist
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Icône au centre avec style bold
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎯', center, center);
  }, [displayChoices, numChoices, anglePerChoice, adjustBrightness]);

  // Initialisation du canvas
  useEffect(() => {
    if (!canvasRef.current || numChoices === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400; // Taille réduite pour correspondre à drawWheel
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    drawWheel(ctx, rotation);
  }, [displayChoices, numChoices, drawWheel, rotation]);

  // Redessiner quand la rotation change (hors animation)
  useEffect(() => {
    if (isSpinning) return; // Ne pas redessiner pendant l'animation
    if (!canvasRef.current || numChoices === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawWheel(ctx, rotation);
  }, [rotation, isSpinning, drawWheel, numChoices]);

  const spinWheel = useCallback(() => {
    if (isSpinning || numChoices === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsSpinning(true);

    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const startRotation = rotation;
    const totalRotation = startRotation + spins * 360 + randomAngle;

    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (totalRotation - startRotation) * easeOut;
      
      // Redessiner directement dans l'animation
      drawWheel(ctx, currentRotation);
      setRotation(currentRotation);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, numChoices, rotation, anglePerChoice, displayChoices, drawWheel]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 md:p-8 bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg shadow-neo dark:shadow-[4px_4px_0px_0px_#fff]">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-display font-bold dark:text-white mb-2">
          🎰 Roue de la Décision
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {numChoices} choix disponible{numChoices > 1 ? 's' : ''}
        </p>
      </div>

      <div className="relative">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            style={{
              width: '400px',
              height: '400px',
              maxWidth: '100%',
              borderRadius: '50%',
              border: '4px solid #000',
              filter: isSpinning ? 'blur(0.5px)' : 'none',
              transition: isSpinning ? 'filter 0.3s' : 'none'
            }}
            className="shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]"
          />
          
          {/* Pointeur fixe en haut - style neo-brutalist */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-10">
            <div className="relative">
              <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-neo-black dark:border-t-white drop-shadow-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-10 h-10 bg-neo-black dark:bg-white rounded-full border-4 border-white dark:border-black shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"></div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || numChoices === 0}
        className={`
          px-10 py-5 rounded-md font-bold text-xl flex items-center gap-3 transition-all transform border-2 border-black dark:border-white
          ${isSpinning
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed scale-95'
            : 'bg-neo-black dark:bg-white text-white dark:text-black shadow-[6px_6px_0px_0px_#86efac] dark:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#86efac] dark:hover:shadow-[3px_3px_0px_0px_#000] active:scale-95'
          }
        `}
      >
        {isSpinning ? (
          <>
            <RotateCw className="w-6 h-6 animate-spin" />
            <span>La roue tourne...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            <span>Faire tourner la roue</span>
          </>
        )}
      </button>


      <div className="mt-6 w-full max-w-2xl">
        <h3 className="text-lg font-bold dark:text-white mb-3 text-center">
          Vos choix :
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {displayChoices.map((choice, index) => (
            <div
              key={index}
              className="p-3 rounded-lg text-sm font-medium text-center border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {choice}
            </div>
          ))}
        </div>
      </div>

      {numChoices > maxChoices && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center font-medium">
            ⚠️ Seuls les {maxChoices} premiers choix sont affichés sur la roue
          </p>
        </div>
      )}
    </div>
  );
};
