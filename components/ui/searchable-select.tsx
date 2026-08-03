'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
    value: string;
    label: string;
}

export interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    onSearchChange?: (query: string) => void;
    loading?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Pilih salah satu...',
    searchPlaceholder = 'Cari...',
    emptyMessage = 'Tidak ditemukan data yang cocok.',
    disabled = false,
    className,
    onSearchChange,
    loading = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Find the currently selected option
    const selectedOption = useMemo(() => {
        return options.find((opt) => opt.value === value);
    }, [options, value]);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        // If server-side search is enabled, the parent handles filtering
        if (onSearchChange) return options;
        if (!searchQuery.trim()) return options;
        const query = searchQuery.toLowerCase();
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(query)
        );
    }, [options, searchQuery, onSearchChange]);

    // Debounce server-side search query
    useEffect(() => {
        if (!isOpen || !onSearchChange) return;
        const handler = setTimeout(() => {
            onSearchChange(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, isOpen, onSearchChange]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setSearchQuery('');
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (disabled) return;
        if (isOpen) {
            setSearchQuery('');
        }
        setIsOpen(!isOpen);
    };

    const handleSelectOption = (optValue: string) => {
        onChange(optValue);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={cn('relative w-full', className)}
        >
            {/* Trigger Button */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={cn(
                    'w-full h-10 border text-[13px] text-ink bg-white rounded-sm px-3.5 flex items-center justify-between transition-all outline-none cursor-pointer',
                    isOpen
                        ? 'border-iris-500 ring-3 ring-[rgba(26,86,219,0.1)]'
                        : 'border-border hover:border-gray-400',
                    disabled && 'bg-surface text-muted cursor-not-allowed opacity-60'
                )}
            >
                <span className={cn('truncate', !selectedOption && 'text-hint')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        'text-muted transition-transform duration-200 shrink-0 ml-2',
                        isOpen && 'rotate-180 text-iris-500'
                    )}
                />
            </button>

            {/* Dropdown Menu Overlay */}
            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 bg-white border border-border rounded-sm shadow-xl flex flex-col overflow-hidden animate-in fade-in duration-100 slide-in-from-top-1">
                    {/* Search Field */}
                    <div className="relative border-b border-border flex items-center shrink-0">
                        <Search
                            size={14}
                            className="absolute left-3 text-muted pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-9 pr-8 text-[12px] bg-transparent outline-none text-ink placeholder:text-hint"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 text-muted hover:text-ink cursor-pointer p-0.5"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto py-1 max-h-48 scrollbar-thin">
                        {loading ? (
                            <div className="px-3.5 py-4 text-[12px] text-muted text-center flex items-center justify-center gap-2">
                                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-iris-500 border-t-transparent"></span>
                                Memuat data...
                            </div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelectOption(opt.value)}
                                        className={cn(
                                            'w-full text-left px-3.5 py-2 text-[12.5px] cursor-pointer transition-colors duration-150 truncate block',
                                            isSelected
                                                ? 'bg-iris-50/70 text-iris-700 font-semibold'
                                                : 'text-ink hover:bg-surface2'
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3.5 py-4 text-[12px] text-muted text-center italic">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
