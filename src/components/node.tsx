import { cva } from 'class-variance-authority';
import { LuUser } from 'react-icons/lu';
import { TbGrave2 } from 'react-icons/tb';
import { Handle, Position, type Node as TNode, type NodeProps as TNodeProps } from '@xyflow/react';

import { type NodeData } from '../lib/cms';
import { NodeType } from '../lib/types';

const nodeStyle = cva('px-4 py-3 rounded-lg border-2 min-w-[120px] transition-all duration-200 cursor-pointer hover:shadow-md', {
    variants: {
        type: {
            [NodeType.Male]: 'bg-blue-50 border-blue-200',
            [NodeType.Female]: 'bg-pink-50 border-pink-200',
        },
        deceased: {
            true: 'opacity-80 border-dashed',
            false: '',
        },
        selected: {
            true: 'shadow-md',
            false: '',
        },
    },
    compoundVariants: [
        { type: NodeType.Male, selected: true, class: 'bg-blue-500 border-blue-300' },
        { type: NodeType.Female, selected: true, class: 'bg-pink-500 border-pink-300' },
    ],
});

const iconStyle = cva('w-5 h-5', {
    variants: {
        type: {
            [NodeType.Male]: 'text-blue-900',
            [NodeType.Female]: 'text-pink-900',
        },
        deceased: {
            true: 'opacity-80',
            false: '',
        },
        selected: {
            true: '',
            false: '',
        },
    },
    compoundVariants: [
        { type: [NodeType.Male], selected: true, class: 'text-white' },
        { type: [NodeType.Female], selected: true, class: 'text-white' },
    ],
});

const nameStyle = cva('font-medium text-sm', {
    variants: {
        type: {
            [NodeType.Male]: 'text-blue-900',
            [NodeType.Female]: 'text-pink-900',
        },
        deceased: {
            true: 'opacity-80',
            false: '',
        },
        selected: {
            true: '',
            false: '',
        },
    },
    compoundVariants: [
        { type: [NodeType.Male], selected: true, class: 'text-white' },
        { type: [NodeType.Female], selected: true, class: 'text-white' },
    ],
});

const sourceHandleStyle = cva('invisible', {
    variants: {
        type: {
            sourceFather: ' !left-[30%]',
            sourceMother: '!left-[70%]',
            target: '',
        },
    },
});

type NodeProps = TNodeProps<TNode<NodeData>> & { type: NodeType };

export const Node = ({ data, selected, type }: NodeProps) => {
    const deceased = data.isDeceased;
    return (
        <div className={nodeStyle({ type, deceased, selected })}>
            <Handle
                id="father"
                className={sourceHandleStyle({ type: 'sourceFather' })}
                type="source"
                position={Position.Top}
                isConnectable={false}
            />
            <Handle
                id="mother"
                className={sourceHandleStyle({ type: 'sourceMother' })}
                type="source"
                position={Position.Top}
                isConnectable={false}
            />
            <div className="flex items-center gap-2">
                {!deceased && <LuUser className={iconStyle({ type, deceased, selected })} />}
                {deceased && <TbGrave2 className={iconStyle({ type, deceased, selected })} />}
                <div className="flex flex-col">
                    <span className={nameStyle({ type, deceased, selected })}>{data.name}</span>
                </div>
            </div>
            <Handle className={sourceHandleStyle({ type: 'target' })} type="target" position={Position.Bottom} isConnectable={false} />
        </div>
    );
};
