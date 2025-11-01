
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{recipe.recipeName}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{recipe.description}</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
