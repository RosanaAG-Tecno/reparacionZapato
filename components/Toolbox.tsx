import React from 'react';
import { Tool, ToolType, RepairStep } from '../types';
import { Hammer, Eraser, Square } from 'lucide-react';

interface ToolboxProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onReturnTool: () => void;
  currentStep: RepairStep;
}

export const Toolbox: React.FC<ToolboxProps> = ({ selectedTool, onSelectTool, onReturnTool, currentStep }) => {
  
  // Defines which tool is needed for which step
  const requiredToolForStep = (step: RepairStep): ToolType => {
      switch(step) {
          case RepairStep.DAMAGED: return ToolType.PLIERS;
          case RepairStep.REMOVED: return ToolType.SANDPAPER;
          case RepairStep.PREPARED: return ToolType.GLUE;
          case RepairStep.GLUED: return ToolType.NEW_TAP;
          case RepairStep.PLACED: return ToolType.HAMMER;
          default: return ToolType.NONE;
      }
  };

  const PliersIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Handles */}
      <path d="M16 21l-3-7a2 2 0 0 0-4 0l-3 7" />
      {/* Pivot */}
      <circle cx="12" cy="10" r="2" fill="currentColor" className="opacity-50" />
      {/* Jaws */}
      <path d="M10.5 8.5L6 3h3l1.5 3" />
      <path d="M13.5 8.5L18 3h-3l-1.5 3" />
    </svg>
  );

  const tools: Tool[] = [
    { 
        id: ToolType.PLIERS, 
        name: "Tenazas", 
        description: "Quitar tapa vieja", 
        icon: <PliersIcon className="w-8 h-8 text-gray-400" /> 
    },
    { 
        id: ToolType.SANDPAPER, 
        name: "Lija", 
        description: "Limpiar restos", 
        icon: <Eraser className="w-8 h-8 text-amber-200" /> 
    },
    { 
        id: ToolType.GLUE, 
        name: "Pegamento", 
        description: "Aplicar contacto", 
        icon: <div className="text-3xl font-bold">💧</div> 
    },
    { 
        id: ToolType.NEW_TAP, 
        name: "Tapa Nueva", 
        description: "Colocar repuesto", 
        icon: <Square className="w-8 h-8 fill-black text-gray-800" /> 
    },
    { 
        id: ToolType.HAMMER, 
        name: "Martillo", 
        description: "Fijar clavos", 
        icon: <Hammer className="w-8 h-8 text-gray-300" /> 
    },
  ];

  const requiredTool = requiredToolForStep(currentStep);

  return (
    <div className="w-full max-w-5xl mx-auto mt-2">
        {/* WALL PANEL (Pegboard) */}
        <div className="bg-slate-800 p-4 rounded-t-xl shadow-inner border-b-4 border-slate-900 relative overflow-hidden">
            {/* Pegboard texture */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 relative z-10 text-center border-b border-slate-700 pb-2">
                Panel de Herramientas
            </h3>
            
            <div className="flex justify-center items-center gap-6 relative z-10 min-h-[100px]">
                {tools.map((tool) => {
                    const isSelected = selectedTool === tool.id;
                    const isRequired = requiredTool === tool.id && selectedTool === ToolType.NONE;
                    
                    return (
                        <div key={tool.id} className="flex flex-col items-center group">
                            <button
                                onClick={() => {
                                    if (isSelected) onReturnTool();
                                    else if (selectedTool === ToolType.NONE) onSelectTool(tool.id);
                                }}
                                title={tool.name}
                                className={`
                                    relative flex items-center justify-center w-20 h-20 rounded-lg transition-all duration-300 border-2
                                    ${isSelected 
                                        ? 'border-dashed border-slate-600 bg-slate-800/50 opacity-50 cursor-pointer' // Empty slot
                                        : 'bg-slate-700 hover:bg-slate-600 shadow-lg cursor-pointer transform hover:scale-105' // Tool in place
                                    }
                                    ${isRequired ? 'ring-2 ring-yellow-400 border-yellow-400 animate-pulse' : 'border-slate-600'}
                                    ${(!isRequired && selectedTool === ToolType.NONE && currentStep !== RepairStep.FINISHED) ? 'opacity-50 grayscale' : ''}
                                `}
                            >
                                {/* The Tool Icon or Ghost */}
                                <div className={`${isSelected ? 'opacity-20' : 'opacity-100'} drop-shadow-md`}>
                                    {tool.icon}
                                </div>

                                {/* Label tooltip */}
                                <span className="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {tool.name}
                                </span>
                            </button>
                            {/* Hook visual */}
                            <div className="w-2 h-4 bg-gray-500 -mt-24 rounded-full mx-auto z-0"></div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* WORKBENCH SURFACE */}
        <div className="bg-amber-900 h-8 w-[98%] mx-auto rounded-b-md shadow-2xl opacity-90"></div>
        <div className="text-center mt-2 text-amber-900/40 text-sm font-serif italic">Mesa de trabajo</div>
    </div>
  );
};