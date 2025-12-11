import React, { useState } from 'react';
    import { RepairStep, ToolType, ShoeViewType } from '../types';
    import { Rotate3D } from 'lucide-react';
    
    interface ShoeSoleProps {
      step: RepairStep;
      selectedTool: ToolType;
      onInteraction: () => void;
      nailsSecured: number;
      view: ShoeViewType;
      onToggleView: () => void;
    }
    
    export const ShoeSole: React.FC<ShoeSoleProps> = ({ 
      step, 
      selectedTool, 
      onInteraction, 
      nailsSecured,
      view,
      onToggleView
    }) => {
      const [hammerAnimation, setHammerAnimation] = useState(false);
      const [isDetaching, setIsDetaching] = useState(false);
      const [isSanding, setIsSanding] = useState(false);
    
      const handleClick = () => {
        if (view === ShoeViewType.SIDE) {
            onToggleView();
            return;
        }

        // Logic to validate interaction based on tool and current step
        let isValidInteraction = false;
    
        // 1. PLIERS INTERACTION (Animation: Detach)
        if (step === RepairStep.DAMAGED && selectedTool === ToolType.PLIERS) {
            setIsDetaching(true);
            setTimeout(() => {
                onInteraction();
                setIsDetaching(false);
            }, 600); // Wait for CSS animation
            return;
        }

        // 2. SANDPAPER INTERACTION (Animation: Vibrate/Shake)
        if (step === RepairStep.REMOVED && selectedTool === ToolType.SANDPAPER) {
            setIsSanding(true);
            setTimeout(() => {
                onInteraction();
                setIsSanding(false);
            }, 800); 
            return;
        }

        if (step === RepairStep.PREPARED && selectedTool === ToolType.GLUE) isValidInteraction = true;
        if (step === RepairStep.GLUED && selectedTool === ToolType.NEW_TAP) isValidInteraction = true;
        
        if (step === RepairStep.PLACED && selectedTool === ToolType.HAMMER) {
            setHammerAnimation(true);
            setTimeout(() => setHammerAnimation(false), 300);
            isValidInteraction = true;
        }
    
        if (isValidInteraction) {
          onInteraction();
        }
      };
    
      // Visual constants
      const upperColor = '#a0522d'; // Sienna / Brown Leather
      const soleColor = '#4a4a4a'; // Grey (Distinct from black heel)
      const heelBaseColor = '#111111'; // Pure Black Heel Block
      const wornTapColor = '#2d2d2d'; // Dark Grey for old tap
      const newTapColor = '#000000'; // Fresh black rubber
    
      return (
        <div className="relative perspective-1000 w-80 h-96 flex items-center justify-center">
             {/* Rotation Control */}
            <button 
                onClick={onToggleView}
                className="absolute top-0 right-0 z-20 bg-white/90 p-2 rounded-full shadow-lg hover:bg-amber-100 transition-colors text-amber-900 border border-amber-200"
                title="Girar zapato"
            >
                <Rotate3D size={24} />
            </button>

            <div 
                className={`relative w-64 h-full transition-transform duration-700 transform-style-3d cursor-pointer ${view === ShoeViewType.SIDE ? 'rotate-y-180' : ''}`}
                onClick={handleClick}
            >
                {/* BOTTOM VIEW (Front Face) */}
                <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl filter">
                        <defs>
                        <filter id="soleTexture">
                            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
                            <feBlend in="SourceGraphic" mode="multiply" />
                        </filter>
                        </defs>
            
                        {/* Shoe Upper Outline (Visible from bottom) */}
                        <path
                        d="M60,380 C30,380 10,300 10,200 C10,120 20,50 60,10 C140,10 190,80 190,200 C190,300 170,380 140,380 L60,380 Z"
                        fill={upperColor} 
                        stroke="#3e2723"
                        strokeWidth="2"
                        />

                        {/* Main Sole Shape (Grey - Distinct from heel) */}
                        <path
                        d="M62,378 C32,378 12,298 12,198 C12,118 22,48 62,12 C142,12 188,82 188,202 C188,302 168,378 138,378 L62,378 Z"
                        fill={soleColor}
                        filter="url(#soleTexture)"
                        stroke="#333"
                        strokeWidth="1"
                        />
            
                        {/* Sole Stitching details */}
                        <path
                        d="M65,370 C40,370 20,300 20,200 C20,125 30,60 65,25 C135,25 180,85 180,200 C180,300 160,370 135,370"
                        fill="none"
                        stroke="#666"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        />
            
                        {/* Heel Area (Base) - Black */}
                        <g className={isSanding ? 'animate-vibrate-sand' : ''}>
                             <rect x="60" y="280" width="80" height="90" rx="10" ry="10" fill={heelBaseColor} />
                             {/* Heel grain texture */}
                             <path d="M65,290 L135,290 M65,310 L135,310 M65,330 L135,330 M65,350 L135,350" stroke="#222" strokeWidth="1" />
                        </g>
            
                        {/* GLUE LAYER - White Lines */}
                        {step === RepairStep.GLUED && (
                            <g>
                                <path 
                                    d="M65,290 Q85,295 100,290 T135,290 M65,310 Q85,315 100,310 T135,310 M65,330 Q85,335 100,330 T135,330 M65,350 Q85,355 100,350 T135,350" 
                                    stroke="white" 
                                    strokeWidth="2" 
                                    fill="none" 
                                    opacity="0.7" 
                                    className="animate-pulse"
                                />
                                <rect x="62" y="282" width="76" height="86" rx="8" ry="8" fill="white" opacity="0.1" />
                            </g>
                        )}
            
                        {/* OLD TAP (With detach animation) */}
                        {step === RepairStep.DAMAGED && (
                        <g className={`transition-opacity duration-300 ${selectedTool === ToolType.PLIERS ? 'hover:opacity-80' : ''} ${isDetaching ? 'animate-detach-tap' : ''}`}>
                            <rect x="60" y="280" width="80" height="90" rx="10" ry="10" fill={wornTapColor} stroke="#000" />
                            {/* Wear and tear marks */}
                            <path d="M65,360 L85,365 L70,345" fill="#111" opacity="0.8" />
                            <path d="M120,350 L135,365" stroke="#000" strokeWidth="2" opacity="0.6" />
                            <circle cx="110" cy="300" r="3" fill="#000" opacity="0.6" />
                            <circle cx="70" cy="290" r="2" fill="#555" /> {/* Old nail head */}
                            <circle cx="130" cy="360" r="2" fill="#555" /> {/* Old nail head */}
                        </g>
                        )}
            
                        {/* NEW TAP */}
                        {(step === RepairStep.PLACED || step === RepairStep.FINISHED) && (
                        <g>
                            <rect x="60" y="280" width="80" height="90" rx="10" ry="10" fill={newTapColor} stroke="#333" strokeWidth="1" />
                            <pattern id="grip" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                                <path d="M0,6 L6,0" stroke="#222" strokeWidth="1" />
                            </pattern>
                            <rect x="62" y="282" width="76" height="86" rx="8" ry="8" fill="url(#grip)" opacity="0.4" />
            
                            {/* Nails */}
                            {nailsSecured > 0 && <circle cx="70" cy="290" r="2.5" fill="#bbb" />}
                            {nailsSecured > 1 && <circle cx="130" cy="290" r="2.5" fill="#bbb" />}
                            {nailsSecured > 2 && <circle cx="70" cy="360" r="2.5" fill="#bbb" />}
                            {nailsSecured > 3 && <circle cx="130" cy="360" r="2.5" fill="#bbb" />}
                            {nailsSecured > 4 && <circle cx="100" cy="325" r="2.5" fill="#bbb" />}
                        </g>
                        )}
            
                        {/* Interaction Highlight Ring */}
                        {selectedTool !== ToolType.NONE && (
                            <circle cx="100" cy="325" r="55" stroke="#eab308" strokeWidth="3" strokeDasharray="6 4" fill="transparent" className="animate-spin-slow opacity-60" />
                        )}
                    </svg>
                    
                    {/* Visual feedback tool followers */}
                    {hammerAnimation && (
                        <div className="absolute top-2/3 left-1/2 -ml-8 -mt-16 text-4xl pointer-events-none animate-hammer-hit">
                            🔨
                        </div>
                    )}
                     {isSanding && (
                        <div className="absolute top-2/3 left-1/2 -ml-8 -mt-16 text-4xl pointer-events-none animate-vibrate-sand opacity-80">
                            💨
                        </div>
                    )}
                </div>

                 {/* SIDE VIEW (Back Face) - Brown Shoe */}
                 <div 
                    className="absolute inset-0" 
                    style={{ 
                        transform: 'rotateY(180deg)', 
                        backfaceVisibility: 'hidden' 
                    }}
                >
                    <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <linearGradient id="leatherGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#b46440"/>
                                <stop offset="100%" stopColor="#8a4020"/>
                            </linearGradient>
                             <linearGradient id="heelGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#222"/>
                                <stop offset="100%" stopColor="#444"/>
                            </linearGradient>
                        </defs>

                        {/* Main Shoe Body */}
                        <path 
                            d="M20,200 Q20,160 50,140 Q80,120 150,100 L200,80 Q260,80 300,100 Q360,120 380,190 L380,210 Q380,230 360,230 L20,230 Z" 
                            fill="url(#leatherGradient)"
                            stroke="#5d2906"
                            strokeWidth="2"
                        />

                        {/* Vamp / Laces Section */}
                        <path 
                            d="M130,110 Q160,100 220,90 L240,160 Q200,180 140,160 Z" 
                            fill="#8b4513"
                            stroke="#5d2906"
                            strokeWidth="1.5"
                        />

                        {/* Laces */}
                        <g stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round">
                            <line x1="160" y1="110" x2="180" y2="108" />
                            <line x1="165" y1="120" x2="185" y2="118" />
                            <line x1="170" y1="130" x2="190" y2="128" />
                            <line x1="175" y1="140" x2="195" y2="138" />
                        </g>

                        {/* Sole Unit (Grey) */}
                        <path 
                            d="M15,225 L365,225 L360,240 Q200,245 20,240 Z" 
                            fill={soleColor} 
                            stroke="#000"
                        />

                        {/* Heel Block (Black) */}
                        <rect x="270" y="240" width="80" height="35" fill="url(#heelGradient)" stroke="#000" />
                        
                        {/* Tap Side View */}
                        {step === RepairStep.DAMAGED && (
                            <rect x="270" y="275" width="80" height="8" fill={wornTapColor} stroke="#222" strokeWidth="1" />
                        )}
                         {step === RepairStep.GLUED && (
                             <rect x="270" y="275" width="80" height="3" fill="white" />
                        )}
                        {(step === RepairStep.PLACED || step === RepairStep.FINISHED) && (
                            <rect x="270" y="275" width="80" height="10" fill={newTapColor} stroke="#222" strokeWidth="1" />
                        )}

                        {/* Top opening collar */}
                        <path d="M220,90 Q260,90 290,105" fill="none" stroke="#5d2906" strokeWidth="3" />
                        
                        {/* Stitching details */}
                        <path d="M50,140 Q100,140 140,160" fill="none" stroke="#d7ccc8" strokeWidth="1" strokeDasharray="3 2" opacity="0.7"/>

                    </svg>
                </div>
            </div>
        </div>
      );
    };