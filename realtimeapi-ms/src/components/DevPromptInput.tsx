"use client";

import React from 'react';

type DevPromptInputProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function DevPromptInput({ value, onChange }: DevPromptInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-1 text-gray-700">Custom Prompt</label>
      <textarea
        className="w-full min-h-[60px] rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/80 resize-none"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your custom prompt here..."
      />
    </div>
  );
} 