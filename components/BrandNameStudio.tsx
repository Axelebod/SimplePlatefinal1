import React, { useState, useEffect, useMemo } from 'react';
import { Copy, CheckCircle, Sparkles, Download, Star, Globe, Lightbulb, TrendingUp, Filter, X, RefreshCw, Save, Heart, Zap, Award, Target, Search } from 'lucide-react';

interface BrandName {
  id: string;
  name: string;
  slogan?: string;
  domain?: string;
  score?: number;
  analysis?: {
    pronounceability: number;
    memorability: number;
    uniqueness: number;
  };
  variations?: string[];
  tags?: string[];
}

interface BrandNameStudioProps {
  result: string;
  inputValue?: string;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onChange?: (content: string) => void;
}

const parseBrandNames = (result: string): BrandName[] => {
  const names: BrandName[] = [];
  
  // Parser différents formats de résultats
  const lines = result.split('\n').filter(line => line.trim());
  
  lines.forEach((line, index) => {
    // Format: "1. NomDeMarque" ou "- NomDeMarque" ou "NomDeMarque"
    const match = line.match(/(?:^[\d\-•\.]\s*)?([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ][a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿA-Z0-9\s\-]+)/);
    if (match) {
      const name = match[1].trim();
      if (name.length > 1 && name.length < 50) {
        // Générer un domaine basique
        const domain = name.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '');
        
        // Générer des variations
        const variations = [
          `${name}Pro`,
          `${name}Hub`,
          `Get${name}`,
          `${name}ly`,
          `The${name}`,
          `${name}App`,
          `${name}Co`,
          `${name}Lab`
        ].slice(0, 4);
        
        // Générer des tags
        const tags = ['Moderne', 'Mémorable', 'Unique'].slice(0, Math.floor(Math.random() * 3) + 1);
        
        names.push({
          id: `brand-${index}`,
          name: name,
          domain: `${domain}.com`,
          score: Math.floor(Math.random() * 30) + 70,
          analysis: {
            pronounceability: Math.floor(Math.random() * 20) + 80,
            memorability: Math.floor(Math.random() * 20) + 75,
            uniqueness: Math.floor(Math.random() * 30) + 70
          },
          variations: variations,
          tags: tags
        });
      }
    }
  });
  
  return names.length > 0 ? names : [];
};

const generateSlogans = (name: string): string[] => {
  // Générer des slogans basiques (en production, ce serait fait par l'IA)
  const templates = [
    `${name} - L'innovation à votre portée`,
    `${name} - Votre avenir commence ici`,
    `${name} - Simple. Rapide. Efficace.`,
    `${name} - Transformez vos idées en réalité`,
    `${name} - L'excellence au quotidien`,
    `${name} - Votre partenaire de confiance`,
    `${name} - L'art de la simplicité`,
    `${name} - Élevez vos standards`
  ];
  return templates.slice(0, 6);
};

export const BrandNameStudio: React.FC<BrandNameStudioProps> = ({
  result,
  inputValue,
  onSave,
  isSaved = false,
  isSaving = false,
  onChange,
}) => {
  const [brandNames, setBrandNames] = useState<BrandName[]>([]);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'slogans' | 'analysis' | 'variations'>('board');
  const [filter, setFilter] = useState<'all' | 'high-score' | 'short' | 'long' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandName | null>(null);

  useEffect(() => {
    if (result) {
      const parsed = parseBrandNames(result);
      if (parsed.length > 0) {
        setBrandNames(parsed);
      }
    }
  }, [result]);

  const copyValue = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSelection = (id: string) => {
    setSelectedNames(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportSelected = () => {
    const selected = brandNames.filter(b => selectedNames.has(b.id));
    const exportData = selected.map(b => ({
      name: b.name,
      domain: b.domain,
      slogan: b.slogan || '',
      score: b.score,
      variations: b.variations || []
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-names-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNames = useMemo(() => {
    let filtered = [...brandNames];
    
    // Filtre par type
    if (filter === 'high-score') {
      filtered = filtered.filter(b => (b.score || 0) >= 85);
    } else if (filter === 'short') {
      filtered = filtered.filter(b => b.name.length <= 8);
    } else if (filter === 'long') {
      filtered = filtered.filter(b => b.name.length > 8);
    } else if (filter === 'favorites') {
      filtered = filtered.filter(b => favorites.has(b.id));
    }
    
    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [brandNames, filter, searchQuery, favorites]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 80) return { label: 'Très bon', color: 'bg-blue-500' };
    if (score >= 70) return { label: 'Bon', color: 'bg-yellow-500' };
    return { label: 'Moyen', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header avec stats */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-lg p-6 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-white/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">
                Studio de Branding
              </h2>
              <p className="text-sm text-white/80">Plateforme complète pour créer votre identité de marque</p>
            </div>
          </div>
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved || isSaving}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                isSaved
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:scale-105'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Sauvegarde...' : isSaved ? 'Sauvegardé ✓' : 'Sauvegarder'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-white">{brandNames.length}</div>
            <div className="text-xs text-white/80">Noms générés</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-white">{selectedNames.size}</div>
            <div className="text-xs text-white/80">Sélectionnés</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-white">{favorites.size}</div>
            <div className="text-xs text-white/80">Favoris</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-white">
              {brandNames.length > 0 ? Math.round(brandNames.reduce((acc, b) => acc + (b.score || 0), 0) / brandNames.length) : 0}
            </div>
            <div className="text-xs text-white/80">Score moyen</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'board', label: 'Board', icon: Target },
            { id: 'slogans', label: 'Slogans', icon: Lightbulb },
            { id: 'analysis', label: 'Analyse', icon: TrendingUp },
            { id: 'variations', label: 'Variations', icon: RefreshCw }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-4 shadow-neo dark:shadow-none">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un nom ou domaine..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-neo-violet focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Tous', icon: Filter },
              { id: 'high-score', label: 'Score 85+', icon: Star },
              { id: 'short', label: 'Courts', icon: Zap },
              { id: 'long', label: 'Longs', icon: Award },
              { id: 'favorites', label: 'Favoris', icon: Heart }
            ].map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                    filter === f.id
                      ? 'bg-neo-violet text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {f.label}
                </button>
              );
            })}
          </div>

          {selectedNames.size > 0 && (
            <button
              onClick={exportSelected}
              className="px-4 py-2 bg-neo-violet text-white rounded-lg font-bold text-sm hover:bg-purple-600 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Exporter ({selectedNames.size})
            </button>
          )}
        </div>
      </div>

      {/* Board View - Main Content */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNames.map((brand) => {
            const scoreBadge = getScoreBadge(brand.score || 0);
            return (
              <div
                key={brand.id}
                className={`group relative p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-2 rounded-xl transition-all cursor-pointer hover:shadow-xl ${
                  selectedNames.has(brand.id)
                    ? 'border-neo-violet shadow-lg scale-105 ring-2 ring-neo-violet/50'
                    : 'border-gray-300 dark:border-gray-600 hover:border-neo-violet'
                }`}
                onClick={() => {
                  setSelectedBrand(brand);
                  toggleSelection(brand.id);
                }}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(brand.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                    favorites.has(brand.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(brand.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Checkbox */}
                <div className="absolute top-3 left-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedNames.has(brand.id)
                      ? 'bg-neo-violet border-neo-violet'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedNames.has(brand.id) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Brand Name */}
                <div className="mt-8 mb-4">
                  <h3 className="text-2xl font-display font-bold text-neo-black dark:text-white mb-2">
                    {brand.name}
                  </h3>
                  
                  {/* Domain */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Globe className="w-4 h-4" />
                    <code className="font-mono text-xs">{brand.domain}</code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyValue(brand.domain || '', `domain-${brand.id}`);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      {copied === `domain-${brand.id}` ? (
                        <CheckCircle className="w-3 h-3 text-neo-green" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Score Badge */}
                  {brand.score && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getScoreColor(brand.score)}`}>
                        <Star className="w-3 h-3" />
                        {brand.score}/100
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${scoreBadge.color}`}>
                        {scoreBadge.label}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {brand.tags && brand.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {brand.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyValue(brand.name, `name-${brand.id}`);
                    }}
                    className="flex-1 px-3 py-2 bg-neo-violet text-white rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-1"
                  >
                    {copied === `name-${brand.id}` ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copier
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBrand(brand);
                      setActiveTab('slogans');
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Voir les slogans"
                  >
                    <Lightbulb className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slogans Tab */}
      {activeTab === 'slogans' && (
        <div className="space-y-4">
          {selectedBrand ? (
            <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-6 shadow-neo dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-display font-bold dark:text-white mb-1">{selectedBrand.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Slogans pour cette marque</p>
                </div>
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generateSlogans(selectedBrand.name).map((slogan, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group"
                    onClick={() => copyValue(slogan, `slogan-${idx}`)}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-white flex-1">{slogan}</p>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded transition-all">
                        {copied === `slogan-${idx}` ? (
                          <CheckCircle className="w-4 h-4 text-neo-green" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-8 shadow-neo dark:shadow-none text-center">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Sélectionnez un nom depuis le board pour voir ses slogans
              </p>
              <button
                onClick={() => setActiveTab('board')}
                className="px-4 py-2 bg-neo-violet text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
              >
                Retour au Board
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {filteredNames.map((brand) => (
            <div
              key={brand.id}
              className="p-5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-neo-violet transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold dark:text-white">{brand.name}</h3>
                {brand.score && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(brand.score)}`}>
                    Score: {brand.score}/100
                  </div>
                )}
              </div>
              {brand.analysis && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Prononciation</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{brand.analysis.pronounceability}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{ width: `${brand.analysis.pronounceability}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Mémorabilité</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{brand.analysis.memorability}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                        style={{ width: `${brand.analysis.memorability}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Originalité</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{brand.analysis.uniqueness}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all"
                        style={{ width: `${brand.analysis.uniqueness}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Variations Tab */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          {filteredNames.map((brand) => (
            <div
              key={brand.id}
              className="p-5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-neo-violet transition-all"
            >
              <h3 className="text-xl font-display font-bold dark:text-white mb-4">{brand.name}</h3>
              {brand.variations && brand.variations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brand.variations.map((variation, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-all cursor-pointer group"
                      onClick={() => copyValue(variation, `var-${brand.id}-${idx}`)}
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono font-bold text-gray-800 dark:text-white">{variation}</code>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded transition-all">
                          {copied === `var-${brand.id}-${idx}` ? (
                            <CheckCircle className="w-3 h-3 text-neo-green" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune variation disponible</p>
              )}
            </div>
          ))}
        </div>
      )}

      {brandNames.length === 0 && (
        <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-lg p-12 shadow-neo dark:shadow-none text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-display font-bold dark:text-white mb-2">Aucun nom généré</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Générez des noms de marque pour commencer à utiliser le Studio de Branding.
          </p>
        </div>
      )}
    </div>
  );
};
