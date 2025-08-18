"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const result: JSX.Element[] = [];
    let inList = false;
    let listItems: JSX.Element[] = [];
    let inTable = false;
    let tableRows: JSX.Element[] = [];
    let tableHeaders: string[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        result.push(
          <ul key={`list-${result.length}`} className="list-disc list-inside ml-4 mb-4 space-y-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (inTable && tableRows.length > 0) {
        result.push(
          <div key={`table-${result.length}`} className="mb-4 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              {tableHeaders.length > 0 && (
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                        {header.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableRows}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        tableHeaders = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();

      // Handle table rows
      if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
        if (!inTable) {
          flushList();
          inTable = true;
        }
        
        const cells = trimmedLine.split('|').slice(1, -1); // Remove empty first/last elements
        
        // Check if this is a header separator row (contains only dashes and pipes)
        if (trimmedLine.match(/^\|[\s\-\|]+\|$/)) {
          return; // Skip separator rows
        }
        
        // If this is the first row, treat as headers
        if (tableRows.length === 0 && !trimmedLine.includes('---')) {
          tableHeaders = cells;
          return;
        }
        
        tableRows.push(
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
            {cells.map((cell, cellIdx) => (
              <td key={cellIdx} className="px-4 py-2 text-xs text-gray-700">
                {formatInlineText(cell.trim())}
              </td>
            ))}
          </tr>
        );
        return;
      } else if (inTable) {
        flushTable();
      }

      // Handle headers
      if (trimmedLine.startsWith('### ')) {
        flushList();
        result.push(
          <h3 key={idx} className="text-sm font-semibold text-gray-800 mt-4 mb-2 border-b border-gray-200 pb-1">
            {formatInlineText(trimmedLine.substring(4))}
          </h3>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        result.push(
          <h2 key={idx} className="text-base font-bold text-gray-900 mt-6 mb-3 border-b-2 border-gray-300 pb-2">
            {formatInlineText(trimmedLine.substring(3))}
          </h2>
        );
      } else if (trimmedLine.startsWith('# ')) {
        flushList();
        result.push(
          <h1 key={idx} className="text-lg font-bold text-gray-900 mt-6 mb-4 border-b-2 border-gray-400 pb-2">
            {formatInlineText(trimmedLine.substring(2))}
          </h1>
        );
      }
      // Handle numbered lists
      else if (trimmedLine.match(/^\d+\.\s/)) {
        if (inList) {
          flushList();
        }
        if (!inList) {
          inList = true;
        }
        const text = trimmedLine.replace(/^\d+\.\s/, '');
        listItems.push(
          <li key={idx} className="text-xs text-gray-700 mb-1">
            {formatInlineText(text)}
          </li>
        );
      }
      // Handle bullet points
      else if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        const text = trimmedLine.replace(/^[•\-\*]\s/, '');
        listItems.push(
          <li key={idx} className="text-xs text-gray-700 mb-1">
            {formatInlineText(text)}
          </li>
        );
      }
      // Handle blockquotes
      else if (trimmedLine.startsWith('> ')) {
        flushList();
        result.push(
          <blockquote key={idx} className="border-l-4 border-blue-200 pl-4 py-2 mb-3 bg-blue-50 italic text-xs text-gray-600">
            {formatInlineText(trimmedLine.substring(2))}
          </blockquote>
        );
      }
      // Handle horizontal rules
      else if (trimmedLine === '---' || trimmedLine === '***') {
        flushList();
        result.push(<hr key={idx} className="my-4 border-gray-200" />);
      }
      // Handle regular paragraphs
      else if (trimmedLine) {
        flushList();
        result.push(
          <p key={idx} className="text-xs text-gray-700 mb-3 leading-relaxed">
            {formatInlineText(trimmedLine)}
          </p>
        );
      }
      // Handle empty lines
      else {
        flushList();
      }
    });

    // Flush any remaining lists or tables
    flushList();
    flushTable();

    return result;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    if (!text) return text;

    // Handle bold text (**text**)
    let result: React.ReactNode = text;
    
    // Process bold text
    result = text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      
      // Process italic text within non-bold parts
      return part.split(/(\*[^*]+\*)/g).map((subPart, subIdx) => {
        if (subPart.startsWith('*') && subPart.endsWith('*') && !subPart.startsWith('**')) {
          return <em key={`${idx}-${subIdx}`} className="italic">{subPart.slice(1, -1)}</em>;
        }
        
        // Process code within non-italic parts
        return subPart.split(/(`[^`]+`)/g).map((codePart, codeIdx) => {
          if (codePart.startsWith('`') && codePart.endsWith('`')) {
            return <code key={`${idx}-${subIdx}-${codeIdx}`} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{codePart.slice(1, -1)}</code>;
          }
          return codePart;
        });
      });
    });

    return result;
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {renderContent(content)}
    </div>
  );
}
