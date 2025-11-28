import React from 'react';
import { ShoppingCart, Star, Truck, Shield, Check } from 'lucide-react';
import { ParsedProductSheet } from './ProductSheetExporter';

interface ProductPreviewProps {
  sheet: ParsedProductSheet;
  onTextChange?: (field: string, value: string) => void;
  editable?: boolean;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ 
  sheet, 
  onTextChange, 
  editable = false 
}) => {
  const [localTitle, setLocalTitle] = React.useState(sheet.title);
  const [localShortDesc, setLocalShortDesc] = React.useState(sheet.shortDescription);
  const [localLongDesc, setLocalLongDesc] = React.useState(sheet.longDescription);
  const [localBullets, setLocalBullets] = React.useState(sheet.bulletPoints);

  React.useEffect(() => {
    setLocalTitle(sheet.title);
    setLocalShortDesc(sheet.shortDescription);
    setLocalLongDesc(sheet.longDescription);
    setLocalBullets(sheet.bulletPoints);
  }, [sheet]);

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    onTextChange?.('title', value);
  };

  const handleShortDescChange = (value: string) => {
    setLocalShortDesc(value);
    onTextChange?.('shortDescription', value);
  };

  const handleLongDescChange = (value: string) => {
    setLocalLongDesc(value);
    onTextChange?.('longDescription', value);
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...localBullets];
    newBullets[index] = value;
    setLocalBullets(newBullets);
    onTextChange?.('bulletPoints', JSON.stringify(newBullets));
  };

  // Extraire le prix numérique si possible
  const extractPrice = (priceStr: string): string => {
    const match = priceStr.match(/[\d,]+\.?\d*/);
    return match ? match[0].replace(',', '.') : '49.99';
  };

  const price = sheet.price ? extractPrice(sheet.price) : '49.99';
  const originalPrice = (parseFloat(price) * 1.3).toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-lg overflow-hidden shadow-neo dark:shadow-[4px_4px_0px_0px_#fff]">
      {/* Header avec image placeholder */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 h-64 flex items-center justify-center border-b-2 border-black dark:border-white">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">Image du produit</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Titre */}
        <div>
          {editable ? (
            <input
              type="text"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-2xl font-display font-bold dark:text-white bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 focus:border-neo-violet focus:outline-none"
              placeholder="Titre du produit"
            />
          ) : (
            <h1 className="text-2xl font-display font-bold dark:text-white leading-tight">
              {localTitle || 'Titre du produit'}
            </h1>
          )}
        </div>

        {/* Prix et Avis */}
        <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neo-violet dark:text-neo-blue">
                {price}€
              </span>
              <span className="text-lg text-gray-500 line-through">
                {originalPrice}€
              </span>
              <span className="px-2 py-1 bg-neo-red text-white text-xs font-bold rounded">
                -23%
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-neo-yellow text-neo-yellow" />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (127 avis)
              </span>
            </div>
          </div>
        </div>

        {/* Description courte */}
        <div>
          {editable ? (
            <textarea
              value={localShortDesc}
              onChange={(e) => handleShortDescChange(e.target.value)}
              className="w-full text-gray-700 dark:text-gray-300 bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 focus:border-neo-violet focus:outline-none resize-none"
              rows={2}
              placeholder="Description courte du produit"
            />
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {localShortDesc || 'Description courte du produit'}
            </p>
          )}
        </div>

        {/* Bullet Points */}
        {localBullets.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-sm mb-3 dark:text-white uppercase tracking-wide">
              Points clés
            </h3>
            <ul className="space-y-2">
              {localBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-neo-green flex-shrink-0 mt-0.5" />
                  {editable ? (
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(index, e.target.value)}
                      className="flex-1 text-gray-700 dark:text-gray-300 bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 focus:border-neo-violet focus:outline-none text-sm"
                      placeholder={`Point clé ${index + 1}`}
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300 text-sm flex-1">
                      {bullet}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description longue */}
        {localLongDesc && (
          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-white">Description détaillée</h3>
            {editable ? (
              <textarea
                value={localLongDesc}
                onChange={(e) => handleLongDescChange(e.target.value)}
                className="w-full text-gray-700 dark:text-gray-300 bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-3 focus:border-neo-violet focus:outline-none resize-none"
                rows={6}
                placeholder="Description détaillée du produit"
              />
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {localLongDesc}
              </div>
            )}
          </div>
        )}

        {/* Garanties */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-neo-blue" />
            <span className="text-xs font-bold dark:text-white">Livraison gratuite</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neo-green" />
            <span className="text-xs font-bold dark:text-white">Garantie 30j</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-neo-violet" />
            <span className="text-xs font-bold dark:text-white">Retour gratuit</span>
          </div>
        </div>

        {/* Bouton d'achat */}
        <button className="w-full py-4 bg-neo-violet dark:bg-neo-blue text-white dark:text-black font-bold text-lg rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] transition-all flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

