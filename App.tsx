
import React, { useState, useCallback } from 'react';
import { Recipe } from './types';
import { generateRecipesFromImage } from './services/geminiService';
import FileUpload from './components/FileUpload';
import RecipeCard from './components/RecipeCard';
import Spinner from './components/Spinner';
import TrashIcon from './components/icons/TrashIcon';
import SparklesIcon from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToGenerativePart = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
    handleReset();
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setRecipes(null);

    try {
      const { base64, mimeType } = await fileToGenerativePart(imageFile);
      const generatedRecipes = await generateRecipesFromImage(base64, mimeType);
      setRecipes(generatedRecipes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRecipes(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleClearImage = () => {
    setImageFile(null);
    setImageBase64(null);
    handleReset();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Fridge-to-Fork <span className="text-indigo-500">AI</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Snap a photo of your ingredients. Get instant recipe ideas.
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          {!imageBase64 && <FileUpload onFileSelect={handleFileSelect} />}

          {imageBase64 && (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-slate-700">
                <img src={imageBase64} alt="Ingredients preview" className="w-full h-auto object-cover" />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                >
                  <SparklesIcon className="h-5 w-5"/>
                  <span>{isLoading ? 'Generating...' : 'Find Recipes'}</span>
                </button>
                 <button
                  onClick={handleClearImage}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </div>
            </div>
          )}

          <div className="mt-12">
            {isLoading && <Spinner />}
            
            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
                <p className="font-bold">Oops! Something went wrong.</p>
                <p>{error}</p>
              </div>
            )}

            {recipes && recipes.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Your Recipe Suggestions</h2>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                  {recipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
             {recipes && recipes.length === 0 && !isLoading &&(
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <p>No recipes could be generated from the image. Please try another one.</p>
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
