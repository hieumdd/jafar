import { cva } from 'class-variance-authority';
import { BaseEdge, getSmoothStepPath, type Edge as TEdge, type EdgeProps } from '@xyflow/react';

import { EdgeData } from '../lib/cms';

const edgeStyle = cva('!stroke-[2px]', {
    variants: {
        gender: {
            1: '!stroke-blue-500',
            0: '!stroke-pink-500',
        },
    },
});

export const Edge = (props: EdgeProps<TEdge<EdgeData>>) => {
    const { data, ...edgeProps } = props;
    const [edgePath] = getSmoothStepPath(edgeProps);

    return <BaseEdge path={edgePath} className={edgeStyle({ gender: data!.gender })} />;
};
