import { cva } from 'class-variance-authority';
import { useState, useRef, useMemo } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';
import { type Node } from '@xyflow/react';

import { type NodeData } from '../lib/cms';

type SearchProps = {
    nodes: Node<NodeData>[];
    onSelect: (nodeId: string) => void;
};

const itemStyle = cva('w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0', {
    variants: {
        selected: {
            true: 'bg-male-light border-male-secondary',
            false: '',
        },
    },
});

const dotStyle = cva('w-3 h-3 rounded-full', {
    variants: {
        gender: {
            1: 'bg-male-primary',
            0: 'bg-female-primary',
        },
    },
});

const nameStyle = cva('font-medium', {
    variants: {
        deceased: {
            true: 'text-gray-500 line-through',
            false: 'text-gray-900',
        },
    },
});

const removeAccents = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

export const Search = ({ nodes, onSelect }: SearchProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredNodes = useMemo(() => {
        if (!searchTerm.trim()) {
            return [];
        }
        return nodes
            .filter((node) => {
                const normalizedName = removeAccents(node.data.name.toLowerCase());
                const normalizedSearch = removeAccents(searchTerm.toLowerCase());
                return normalizedName.includes(normalizedSearch);
            })
            .slice(0, 5);
    }, [nodes, searchTerm]);

    const handleNodeSelect = (node: Node<NodeData>) => {
        setSearchTerm('');
        setIsOpen(false);
        setSelectedIndex(-1);
        onSelect(node.id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filteredNodes.length === 0) {
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < filteredNodes.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredNodes.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && filteredNodes[selectedIndex]) {
                    handleNodeSelect(filteredNodes[selectedIndex]);
                } else if (selectedIndex === -1 && filteredNodes.length > 0) {
                    handleNodeSelect(filteredNodes[0]);
                }
                break;
            case 'Escape':
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const resetSelection = () => {
        setSelectedIndex(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(value.length > 0);
        resetSelection();
    };

    const clearSearch = () => {
        setSearchTerm('');
        setIsOpen(false);
        resetSelection();
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        if (searchTerm.length > 0) {
            setIsOpen(true);
        }
    };

    return (
        <div className="absolute top-4 left-4 z-10 w-80">
            <div className="relative">
                <div className="relative">
                    <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <LuX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isOpen && filteredNodes.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredNodes.map((node, index) => {
                            const selected = index === selectedIndex;
                            const gender = node.data.gender;
                            const deceased = node.data.isDeceased;
                            return (
                                <button key={node.id} onClick={() => handleNodeSelect(node)} className={itemStyle({ selected })}>
                                    <div className={dotStyle({ gender })} />
                                    <span className={nameStyle({ deceased })}>{node.data.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
