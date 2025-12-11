import React, { useState } from 'react';
import { ShoeSole } from './components/ShoeSole';
import { Toolbox } from './components/Toolbox';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { RepairStep, ToolType, ShoeViewType } from './types';
import { RotateCcw, AlertCircle, Info, X } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<RepairStep>(RepairStep.DAMAGED);
  const [view, setView] = useState<ShoeViewType>(ShoeViewType.SIDE);
  const [selectedTool, setSelectedTool] = useState<ToolType>(ToolType.NONE);
  const [nailsSecured, setNailsSecured] = useState(0);
  const [message, setMessage] = useState("Bienvenido al taller. Gira el zapato para inspeccionar la suela.");
  const [showInfo, setShowInfo] = useState(false);

  // Logic to determine if user can pick up a tool
  const handleToolSelect = (tool: ToolType) => {
    // Cannot pick up tool if one is already in hand (though UI prevents this mostly)
    if (selectedTool !== ToolType.NONE) return;
    
    // Cannot pick up tool if view is wrong (must be inspecting sole to work)
    if (view === ShoeViewType.SIDE && step !== RepairStep.FINISHED) {
        setMessage("⚠️ Gira el zapato para ver la suela antes de coger herramientas.");
        return;
    }

    // Logic to enforce correct tool order
    let allowed = false;
    if (step === RepairStep.DAMAGED && tool === ToolType.PLIERS) allowed = true;
    else if (step === RepairStep.REMOVED && tool === ToolType.SANDPAPER) allowed = true;
    else if (step === RepairStep.PREPARED && tool === ToolType.GLUE) allowed = true;
    else if (step === RepairStep.GLUED && tool === ToolType.NEW_TAP) allowed = true;
    else if (step === RepairStep.PLACED && tool === ToolType.HAMMER) allowed = true;

    if (allowed) {
        setSelectedTool(tool);
        updateMessageForTool(tool);
    } else {
        setMessage("Esa no es la herramienta adecuada para este paso.");
    }
  };

  const handleReturnTool = () => {
      setSelectedTool(ToolType.NONE);
      // Determine next instruction
      switch(step) {
          case RepairStep.REMOVED: setMessage("Zona despejada. Coge la LIJA del panel."); break;
          case RepairStep.PREPARED: setMessage("Limpio. Coge el PEGAMENTO del panel."); break;
          case RepairStep.GLUED: setMessage("Pegajoso. Coge la TAPA NUEVA del panel."); break;
          case RepairStep.PLACED: setMessage("Colocada. Coge el MARTILLO del panel."); break;
          case RepairStep.FINISHED: setMessage("¡Trabajo terminado! Admira tu obra."); break;
          default: setMessage("Selecciona la herramienta siguiente.");
      }
  };

  const updateMessageForTool = (tool: ToolType) => {
    switch(tool) {
        case ToolType.PLIERS: setMessage("Tenazas en mano. Arranca la tapa vieja."); break;
        case ToolType.SANDPAPER: setMessage("Lija en mano. Frota el talón para limpiar."); break;
        case ToolType.GLUE: setMessage("Pegamento listo. Aplica las líneas blancas."); break;
        case ToolType.NEW_TAP: setMessage("Tapa nueva. Colócala con precisión."); break;
        case ToolType.HAMMER: setMessage("Martillo listo. Dale 5 golpes para fijarla."); break;
        default: break;
    }
  };

  const handleInteraction = () => {
    // If we have a tool, we use it, then ask to return it
    if (selectedTool === ToolType.NONE) return;

    if (step === RepairStep.DAMAGED && selectedTool === ToolType.PLIERS) {
        setStep(RepairStep.REMOVED);
        setMessage("¡Hecho! Ahora devuelve las TENAZAS a su sitio.");
    } 
    else if (step === RepairStep.REMOVED && selectedTool === ToolType.SANDPAPER) {
        setStep(RepairStep.PREPARED);
        setMessage("Superficie lista. Devuelve la LIJA al panel.");
    }
    else if (step === RepairStep.PREPARED && selectedTool === ToolType.GLUE) {
        setStep(RepairStep.GLUED);
        setMessage("Pegamento aplicado. Deja el bote en el panel.");
    }
    else if (step === RepairStep.GLUED && selectedTool === ToolType.NEW_TAP) {
        setStep(RepairStep.PLACED);
        setNailsSecured(0);
        setMessage("Tapa en posición. Ya no necesitas la pieza en mano (simulado).");
        setMessage("Tapa puesta. Devuelve la caja de tapas al panel.");
    }
    else if (step === RepairStep.PLACED && selectedTool === ToolType.HAMMER) {
        const newNails = nailsSecured + 1;
        setNailsSecured(newNails);
        if (newNails >= 5) {
            setStep(RepairStep.FINISHED);
            setMessage("¡Perfecto! Devuelve el MARTILLO para finalizar.");
        } else {
            setMessage(`Clavando... (${newNails}/5)`);
        }
    }
  };

  const resetSimulation = () => {
    setStep(RepairStep.DAMAGED);
    setSelectedTool(ToolType.NONE);
    setView(ShoeViewType.SIDE);
    setNailsSecured(0);
    setMessage("Bienvenido al taller. Gira el zapato para inspeccionar la suela.");
  };

  // Custom cursor when tool is selected
  const cursorStyle = selectedTool !== ToolType.NONE ? 'cursor-crosshair' : 'cursor-default';

  return (
    <div className={`min-h-screen flex flex-col items-center py-6 px-4 bg-slate-100 ${cursorStyle}`}>
      <header className="mb-8 text-center relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-center md:justify-center">
        <div className="flex flex-col items-center z-10">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-1 font-serif tracking-tight">
            Zapatero Pro <span className="text-amber-600">3D</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Taller de Reparación Interactivo</p>
        </div>
        
        {/* Info Button - High Visibility Version */}
        <button 
            onClick={() => setShowInfo(true)}
            className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border-2 border-white ring-2 ring-amber-100 animate-pulse hover:animate-none z-20"
            title="Importancia de la reparación"
        >
            <Info size={22} strokeWidth={2.5} />
            <span>¿Por qué reparar?</span>
        </button>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center">
        
        {/* Instruction Banner */}
        <div className={`
            px-6 py-4 rounded-lg shadow-lg mb-6 border-l-8 w-full max-w-3xl flex items-center gap-4 transition-colors duration-300
            ${selectedTool !== ToolType.NONE ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-400'}
        `}>
            {selectedTool !== ToolType.NONE ? (
                <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                    <AlertCircle size={24} />
                </div>
            ) : (
                <div className="bg-slate-100 p-2 rounded-full text-slate-700 font-bold">
                    {step + 1}
                </div>
            )}
            <span className="text-slate-800 font-medium text-lg md:text-xl">{message}</span>
        </div>

        {/* Toolbox Area */}
        <Toolbox 
            selectedTool={selectedTool} 
            onSelectTool={handleToolSelect} 
            onReturnTool={handleReturnTool}
            currentStep={step}
        />

        {/* Shoe Interaction Area */}
        <div className="mt-8 mb-12 transform transition-transform relative z-10">
            <ShoeSole 
                step={step} 
                selectedTool={selectedTool} 
                onInteraction={handleInteraction}
                nailsSecured={nailsSecured}
                view={view}
                onToggleView={() => {
                    if (view === ShoeViewType.SIDE) {
                        setView(ShoeViewType.BOTTOM);
                        setMessage("Vista inferior. Ahora selecciona la herramienta necesaria del panel.");
                    } else {
                        setView(ShoeViewType.SIDE);
                        setMessage("Vista lateral. Vuelve a girar para trabajar.");
                    }
                }}
            />
             {/* Shadow under shoe */}
             <div className="w-64 h-8 bg-black/20 rounded-[100%] filter blur-md mx-auto mt-4"></div>
        </div>

        {/* AI Feedback Section */}
        <GeminiAdvisor visible={step === RepairStep.FINISHED && selectedTool === ToolType.NONE} />

        {/* Reset Button */}
        {step === RepairStep.FINISHED && selectedTool === ToolType.NONE && (
             <button 
                onClick={resetSimulation}
                className="mt-8 flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-full hover:bg-slate-700 transition-colors shadow-lg"
             >
                <RotateCcw size={20} />
                Empezar nueva reparación
             </button>
        )}

      </main>

       {/* Info Modal */}
       {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-slate-800 font-serif">El Valor de la Reparación</h2>
                    <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-8 space-y-8">
                    <section>
                        <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                             🌱 Impacto Ambiental
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            La industria del calzado es responsable de una enorme huella de carbono. 
                            <strong>Reparar en lugar de tirar</strong> reduce los residuos en vertederos (donde los materiales sintéticos tardan siglos en degradarse) 
                            y evita el consumo de recursos (agua, energía, piel) necesarios para fabricar un par nuevo.
                        </p>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-bold text-amber-700 mb-3 flex items-center gap-2">
                             💰 Economía Circular vs. Lineal
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            Históricamente, los bienes se producían para durar. Hoy vivimos en una <strong>economía lineal</strong> (extraer, fabricar, usar, tirar). 
                            La reparación fomenta la <strong>economía circular</strong>, manteniendo el valor de los productos durante más tiempo. 
                            Además, apoyar a los zapateros locales fortalece el tejido económico de tu barrio frente a las grandes cadenas.
                        </p>
                    </section>

                    <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">
                            ¿Por qué dejamos de reparar?
                        </h3>
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex gap-3 items-start">
                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold mt-1 uppercase">Obsolescencia</span>
                                <span>
                                    Muchos productos actuales (Fast Fashion) están diseñados para fallar pronto o construidos de tal forma (pegados, no cosidos) que repararlos es imposible o más caro que comprar uno nuevo.
                                </span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold mt-1 uppercase">Cultura</span>
                                <span>
                                    Hemos perdido la costumbre de cuidar lo que tenemos. La gratificación instantánea de "estrenar" ha desplazado al orgullo de "conservar".
                                </span>
                            </li>
                        </ul>
                    </section>
                </div>
                <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-gray-100 text-center sticky bottom-0 z-10">
                    <button 
                        onClick={() => setShowInfo(false)}
                        className="bg-slate-800 text-white px-8 py-3 rounded-full hover:bg-slate-700 transition-colors font-medium shadow-lg"
                    >
                        Volver al Taller
                    </button>
                </div>
            </div>
        </div>
      )}

      <style>{`
        .cursor-crosshair { cursor: crosshair; }
        .cursor-default { cursor: default; }
      `}</style>
    </div>
  );
};

export default App;