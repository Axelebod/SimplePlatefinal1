import React from 'react';
import { Shield, Lock, Flag } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      text: 'RGPD Compliant',
      color: 'bg-neo-green',
    },
    {
      icon: Lock,
      text: 'Sécurisé SSL',
      color: 'bg-neo-blue',
    },
    {
      icon: Flag,
      text: '100% Français',
      color: 'bg-neo-yellow',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-600">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            <div className={`w-8 h-8 ${badge.color} border border-black dark:border-white rounded-md flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-black dark:text-white" />
            </div>
            <span>{badge.text}</span>
          </div>
        );
      })}
    </div>
  );
};

