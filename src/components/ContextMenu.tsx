
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: 'item' | 'separator';
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  disabled?: boolean;
}

export const ContextMenu = ({ items, children, disabled = false }: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setIsOpen(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} onContextMenu={handleContextMenu}>
      {children}
      {isOpen && createPortal(
        <Card
          ref={menuRef}
          className="fixed z-50 min-w-48 p-1 shadow-lg border"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {items.map((item, index) => (
            item.type === 'separator' ? (
              <Separator key={index} className="my-1" />
            ) : (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-8"
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Button>
            )
          ))}
        </Card>,
        document.body
      )}
    </div>
  );
};
