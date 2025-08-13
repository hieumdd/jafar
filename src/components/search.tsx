import { cva } from 'class-variance-authority';
import { useState, useRef, useMemo } from 'react';
import { LuSearch, LuX, LuUser } from 'react-icons/lu';
import { TbGrave2 } from 'react-icons/tb';
import { type Node } from '@xyflow/react';

import { type NodeData } from '../lib/cms';

type SearchProps = {
    nodes: Node<NodeData>[];
    onSelect: (nodeId: string) => void;
};

const itemStyle = cva('flex w-full items-center gap-3 border-gray-100 px-4 py-3 text-left hover:bg-gray-50', {
    variants: {
        selected: {
            true: 'bg-slate-100 border-slate-200',
            false: '',
        },
    },
});

const iconStyle = cva('w-4 h-4', {
    variants: {
        gender: {
            1: 'text-male-primary',
            0: 'text-female-primary',
        },
        deceased: {
            true: 'opacity-80',
            false: '',
        },
    },
});

const nameStyle = cva('font-medium', {
    variants: {
        deceased: {
            true: 'text-neutral-primary',
            false: 'text-neutral-dark',
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
        <div className="absolute z-10 top-4 left-4 w-80">
            <div className="relative">
                <div className="relative">
                    <LuSearch className="absolute w-4 h-4 transform -translate-y-1/2 text-neutral-primary top-1/2 left-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        className="w-full py-2 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute transform -translate-y-1/2 text-neutral-primary top-1/2 right-3 hover:text-neutral-dark"
                        >
                            <LuX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isOpen && filteredNodes.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-60">
                        {filteredNodes.map((node, index) => {
                            const selected = index === selectedIndex;
                            const gender = node.data.gender;
                            const deceased = node.data.isDeceased;
                            return (
                                <button key={node.id} onClick={() => handleNodeSelect(node)} className={itemStyle({ selected })}>
                                    {!deceased && <LuUser className={iconStyle({ gender, deceased })} />}
                                    {deceased && <TbGrave2 className={iconStyle({ gender, deceased })} />}
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
