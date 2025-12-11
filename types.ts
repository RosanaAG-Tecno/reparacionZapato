import React from 'react';

export enum ToolType {
  NONE = 'NONE',
  PLIERS = 'PLIERS', // Tenazas para quitar
  SANDPAPER = 'SANDPAPER', // Lija para limpiar
  GLUE = 'GLUE', // Pegamento
  NEW_TAP = 'NEW_TAP', // Tapa nueva
  HAMMER = 'HAMMER', // Martillo
}

export enum RepairStep {
  DAMAGED = 0,
  REMOVED = 1,
  PREPARED = 2,
  GLUED = 3,
  PLACED = 4,
  FINISHED = 5,
}

export enum ShoeViewType {
  SIDE = 'SIDE',
  BOTTOM = 'BOTTOM'
}

export interface ShoeState {
  step: RepairStep;
  nailsSecured: number; // 0 to 4
}

export interface Tool {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ReactNode;
}