import React from 'react';
import { FormattingOptions } from '../types';

interface FormattingPanelProps {
  formatting: FormattingOptions;
  onFormattingChange: (formatting: FormattingOptions) => void;
}

const FONT_OPTIONS = [
  'Arial',
  'Calibri',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Courier New',
  'Impact',
  'Trebuchet MS',
  'Tahoma',
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left', icon: '←' },
  { value: 'center', label: 'Center', icon: '↔' },
  { value: 'right', label: 'Right', icon: '→' },
  { value: 'justify', label: 'Justify', icon: '⇔' },
] as const;

export const FormattingPanel: React.FC<FormattingPanelProps> = ({
  formatting,
  onFormattingChange,
}) => {
  const updateFormatting = (updates: Partial<FormattingOptions>) => {
    onFormattingChange({ ...formatting, ...updates });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Character Formatting Options
      </h3>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={formatting.fontFamily || 'Arial'}
          onChange={(e) => updateFormatting({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {formatting.fontSize || 12}pt
        </label>
        <input
          type="range"
          min="8"
          max="72"
          value={formatting.fontSize || 12}
          onChange={(e) =>
            updateFormatting({ fontSize: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8pt</span>
          <span>72pt</span>
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={formatting.color || '#000000'}
            onChange={(e) => updateFormatting({ color: e.target.value })}
            className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={formatting.color || '#000000'}
            onChange={(e) => updateFormatting({ color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Styles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Styles
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formatting.bold || false}
              onChange={(e) => updateFormatting({ bold: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-bold text-sm text-gray-700">Bold</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formatting.italic || false}
              onChange={(e) => updateFormatting({ italic: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="italic text-sm text-gray-700">Italic</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formatting.underline || false}
              onChange={(e) => updateFormatting({ underline: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="underline text-sm text-gray-700">Underline</span>
          </label>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <div className="grid grid-cols-4 gap-2">
          {ALIGNMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFormatting({ textAlignment: option.value })}
              className={`px-4 py-2 border rounded-md transition-colors ${
                formatting.textAlignment === option.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">{option.icon}</span>
                <span className="text-xs mt-1">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Character Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Character Spacing: {formatting.characterSpacing || 0}pt
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={formatting.characterSpacing || 0}
          onChange={(e) =>
            updateFormatting({ characterSpacing: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0pt</span>
          <span>10pt</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Line Spacing: {formatting.lineSpacing || 1.0}x
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={formatting.lineSpacing || 1.0}
          onChange={(e) =>
            updateFormatting({ lineSpacing: parseFloat(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5x</span>
          <span>3x</span>
        </div>
      </div>

      {/* Paragraph Spacing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Space Before (pt)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formatting.paragraphSpacing?.before || 0}
            onChange={(e) =>
              updateFormatting({
                paragraphSpacing: {
                  ...formatting.paragraphSpacing,
                  before: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Space After (pt)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formatting.paragraphSpacing?.after || 0}
            onChange={(e) =>
              updateFormatting({
                paragraphSpacing: {
                  ...formatting.paragraphSpacing,
                  after: parseInt(e.target.value) || 0,
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Text Scaling */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Scaling: {((formatting.scaling || 1.0) * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="50"
          max="200"
          step="1"
          value={((formatting.scaling || 1.0) * 100)}
          onChange={(e) =>
            updateFormatting({ scaling: parseInt(e.target.value) / 100 })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>50%</span>
          <span>200%</span>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFormattingChange({
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000',
            bold: false,
            italic: false,
            underline: false,
            characterSpacing: 0,
            textAlignment: 'left',
            lineSpacing: 1.0,
            paragraphSpacing: { before: 0, after: 0 },
            scaling: 1.0,
          })
        }
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
};


