import { cva } from 'class-variance-authority';
import { BaseEdge, getSmoothStepPath, type Edge as TEdge, type EdgeProps } from '@xyflow/react';

import { EdgeData } from '../lib/cms';

const edgeStyle = cva('!stroke-[2px] ![stroke-linecap:round]', {
    variants: {
        gender: {
            1: '!stroke-male-primary',
            0: '!stroke-female-primary',
        },
    },
});

export const Edge = (props: EdgeProps<TEdge<EdgeData>>) => {
    const { data, ...edgeProps } = props;
    const [edgePath] = getSmoothStepPath({ ...edgeProps, stepPosition: data!.gender === 1 ? 1 : 0.1 });
    return <BaseEdge path={edgePath} className={edgeStyle({ gender: data!.gender })}></BaseEdge>;
};
