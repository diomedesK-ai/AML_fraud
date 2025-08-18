"use client";

import React from 'react';

const EXPERIENCES = [
  { key: 'wealth', label: 'Wealth Advisory', icon: '◉' },
];

type ExperienceSelectorProps = {
  selected: string;
  onSelect: (key: string) => void;
};

export default function ExperienceSelector({ selected, onSelect }: ExperienceSelectorProps) {
  return (
    <div className="flex gap-3 py-2">
      {EXPERIENCES.map((exp) => (
        <button
          key={exp.key}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition border focus:outline-none ${
            selected === exp.key
              ? 'border-slate-400 bg-slate-100 text-slate-800'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
          }`}
          onClick={() => onSelect(exp.key)}
        >
          <span className="text-lg">{exp.icon}</span>
          <span>{exp.label}</span>
        </button>
      ))}
    </div>
  );
} 