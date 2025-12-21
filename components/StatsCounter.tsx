import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap } from 'lucide-react';
import { getSiteStats } from '../services/statsService';

interface StatsCounterProps {
  className?: string;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    generations: 0,
    users: 0,
    tools: 50, // Nombre réel d'outils
  });
  const [loading, setLoading] = useState(true);

  // Charger les vraies statistiques depuis Supabase
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const realStats = await getSiteStats();
        
        // Animation au chargement
        const animate = (target: number, setter: (val: number) => void, duration: number = 2000) => {
          const start = 0;
          const increment = target / (duration / 16);
          let current = start;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setter(target);
              clearInterval(timer);
            } else {
              setter(Math.floor(current));
            }
          }, 16);
        };

        animate(realStats.generations, (val) => setStats(prev => ({ ...prev, generations: val })));
        setStats(prev => ({ ...prev, tools: realStats.tools }));
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Rafraîchir les stats toutes les 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg p-4 shadow-neo-sm dark:shadow-[2px_2px_0px_0px_#fff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-green border-2 border-black dark:border-white rounded-md flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-2xl font-bold dark:text-white">{formatNumber(stats.generations)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Générations</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-lg p-4 shadow-neo-sm dark:shadow-[2px_2px_0px_0px_#fff]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-yellow border-2 border-black dark:border-white rounded-md flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-2xl font-bold dark:text-white">{stats.tools}+</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Outils Disponibles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

