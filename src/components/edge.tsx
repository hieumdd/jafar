import { cva } from 'class-variance-authority';
import { BaseEdge, getSmoothStepPath, type Edge as TEdge, type EdgeProps as TEdgeProps } from '@xyflow/react';

import { EdgeData } from '../lib/cms';
import { EdgeType } from '../lib/types';

const edgeStyle = cva('!stroke-[2px] ![stroke-linecap:round]', {
    variants: {
        type: {
            [EdgeType.Father]: '!stroke-male-primary',
            [EdgeType.Mother]: '!stroke-female-primary',
        },
    },
});

type EdgeProps = TEdgeProps<TEdge<EdgeData>> & { type: EdgeType };

export const Edge = ({ type, ...edgeProps }: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({ ...edgeProps, stepPosition: type === EdgeType.Father ? 1 : 0.1 });
    return <BaseEdge path={edgePath} className={edgeStyle({ type })}></BaseEdge>;
};
