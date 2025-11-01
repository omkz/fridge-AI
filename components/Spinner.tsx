
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"
      ></div>
      <p className="text-slate-600 dark:text-slate-300 font-semibold">AI is thinking...</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm">Crafting delicious recipes for you!</p>
    </div>
  );
};

export default Spinner;
