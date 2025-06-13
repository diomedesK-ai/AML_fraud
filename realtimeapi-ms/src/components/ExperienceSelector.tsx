"use client";

import React from 'react';

const EXPERIENCES = [
  { key: 'city', label: 'City', icon: '🏙️' },
  { key: 'flight', label: 'Flight', icon: '✈️' },
  { key: 'night', label: 'Night', icon: '🌃' },
  { key: 'mountain', label: 'Mountain', icon: '🏔️' },
];

type ExperienceSelectorProps = {
  selected: string;
  onSelect: (key: string) => void;
};

export default function ExperienceSelector({ selected, onSelect }: ExperienceSelectorProps) {
  return (
    <div className="flex gap-4 py-2">
      {EXPERIENCES.map((exp) => (
        <button
          key={exp.key}
          className={`flex flex-col items-center px-4 py-2 rounded-lg shadow transition border-2 focus:outline-none ${
            selected === exp.key
              ? 'border-blue-500 bg-blue-100 text-blue-700'
              : 'border-transparent bg-white/70 hover:bg-blue-50'
          }`}
          onClick={() => onSelect(exp.key)}
        >
          <span className="text-2xl mb-1">{exp.icon}</span>
          <span className="text-xs font-medium">{exp.label}</span>
        </button>
      ))}
    </div>
  );
} 