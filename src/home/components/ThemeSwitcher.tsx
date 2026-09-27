import React, { useState, useEffect, useRef } from 'react';
import { usePamwill } from '../../state/store';
import { Palette, Check, Sun, Moon } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { websiteTheme, setWebsiteTheme } = usePamwill();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const themes = [
    {
      id: 'light' as const,
      name: 'Minimalist Light',
      subtitle: 'Quiet, editorial, luxury ivory',
      swatches: ['#FAFAF8', '#17181A', '#C6A567']
    },
    {
      id: 'dark' as const,
      name: 'Minimalist Dark',
      subtitle: 'Nocturne luxury, obsidian & gold',
      swatches: ['#100E0C', '#FAF8F5', '#C6A567']
    }
  ];

  return (
    <div className="theme-switcher-container" ref={containerRef} id="themeSwitcher">
      {/* Floating Toggle Button */}
      <button
        className="theme-toggle-btn"
        id="themeToggleBtn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle visual theme panel"
        title="Change Visual Theme (Light / Dark Mode)"
      >
        {websiteTheme === 'light' ? (
          <Sun size={24} color="#FFFFFF" />
        ) : (
          <Palette size={24} color="#FFFFFF" />
        )}
      </button>

      {/* Pop-up Panel */}
      <div className={`theme-panel ${isOpen ? 'active' : ''}`} id="themePanel">
        <div className="theme-panel-header">
          <h3>
            <Palette size={16} color="var(--cta)" />
            Choose Theme
          </h3>
          <p>Switch between Minimalist Light and Nocturne Dark modes</p>
        </div>

        <div className="theme-options">
          {themes.map((theme) => {
            const isActive = websiteTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-option ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setWebsiteTheme(theme.id);
                  setIsOpen(false);
                }}
              >
                <div className="theme-swatches">
                  {theme.swatches.map((color, idx) => (
                    <div
                      key={idx}
                      className="theme-swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="theme-option-label">
                  <strong>{theme.name}</strong>
                  <small>{theme.subtitle}</small>
                </div>

                <div className="theme-option-check">
                  {isActive && <Check size={13} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
