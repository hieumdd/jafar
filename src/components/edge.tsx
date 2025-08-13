import { cva } from 'class-variance-authority';
import { BaseEdge, getSmoothStepPath, type Edge as TEdge, type EdgeProps } from '@xyflow/react';

import { EdgeData } from '../lib/cms';

const edgeStyle = cva('![stroke-linecap:round] !stroke-[2px]', {
    variants: {
        gender: {
            1: '!stroke-blue-500',
            0: '!stroke-pink-500',
        },
        connected: {
            true: '![stroke-dasharray:8,4]',
            false: '',
        },
    },
});

export const Edge = (props: EdgeProps<TEdge<EdgeData>>) => {
    const { data, ...edgeProps } = props;
    const [edgePath] = getSmoothStepPath({ ...edgeProps, stepPosition: data!.gender == 1 ? 0.5 : 0.1 });
    return (
        <BaseEdge path={edgePath} className={edgeStyle({ gender: data!.gender, connected: data?.connected })}>
            {data?.connected && (
                <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="0.4s" repeatCount="indefinite" calcMode="linear" />
            )}
        </BaseEdge>
    );
};
