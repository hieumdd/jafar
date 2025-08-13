import { GetStaticProps } from 'next';
import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    type Node as TNode,
    type Edge as TEdge,
    type OnBeforeDelete,
    type OnSelectionChangeFunc,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';

import { getCMS, type CMS, type NodeData, type EdgeData } from '../lib/cms';
import { NodeType } from '../lib/types';
import { Node } from '../components/node';
import { Edge } from '../components/edge';
import { Search } from '../components/search';
import { Info } from '../components/info';

type HomeProps = { cms: CMS };

const nodeTypes = {
    [NodeType.Male]: Node,
    [NodeType.Female]: Node,
};

const edgeTypes = {
    edge: Edge,
};

const Home = ({ cms }: HomeProps) => {
    const initialNodes = cms.nodes.map((node) => ({
        type: node.gender === 1 ? NodeType.Male : NodeType.Female,
        id: node.id,
        data: { label: node.name, ...node },
        position: { x: 0, y: 0 },
    }));

    const initialEdges = cms.edges.map((edge) => ({
        type: 'edge',
        id: edge.id,
        source: edge.sourceId,
        target: edge.targetId,
        data: edge,
        sourceHandle: edge.gender === 1 ? 'father' : 'mother',
    }));
    const [nodes, setNodes, onNodesChange] = useNodesState<TNode<NodeData>>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<TEdge<EdgeData>>(initialEdges);
    const { fitView } = useReactFlow();

    const selectedNode = nodes.find((node) => node.selected)?.data || null;

    const onBeforeDelete = useCallback<OnBeforeDelete<TNode<NodeData>, TEdge<EdgeData>>>(async () => false, []);

    const onSelectionChange = useCallback<OnSelectionChangeFunc>(
        ({ nodes: selectedNodes }) => {
            if (selectedNodes.length > 0) {
                const node = selectedNodes[0] as TNode<NodeData>;
                fitView({ nodes: [node], duration: 800, padding: 0.3 });
                setEdges((eds) => eds.map((edge) => ({ ...edge, animated: edge.source === node.id || edge.target === node.id })));
            } else {
                setEdges((eds) => eds.map((edge) => ({ ...edge, animated: false })));
            }
        },
        [fitView, setEdges],
    );

    const handleSelectNodeFromSearch = (nodeId: string) => {
        setNodes((nds) => nds.map((node) => ({ ...node, selected: node.id === nodeId })));
    };

    const handleViewAll = () => {
        fitView({ duration: 800, padding: 0.1 });
    };

    useEffect(() => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
        g.setGraph({ rankdir: 'BT', nodesep: 200, ranksep: 100 });
        nodes.forEach((node) =>
            g.setNode(node.id, {
                ...node,
                width: node.measured?.width ?? 0,
                height: node.measured?.height ?? 0,
            }),
        );
        edges.forEach((edge) => {
            g.setEdge(edge.source, edge.target);
        });
        Dagre.layout(g);
        const layoutedNodes = nodes.map((node) => {
            const position = g.node(node.id);
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;
            return { ...node, position: { x, y } };
        }) as TNode<NodeData>[];
        setNodes([...layoutedNodes]);
        setEdges([...edges]);
        handleViewAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="relative w-full h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onPaneClick={handleViewAll}
                onBeforeDelete={onBeforeDelete}
                onSelectionChange={onSelectionChange}
                nodesDraggable={false}
                connectOnClick={false}
            >
                <Controls showInteractive={false} />
                <Background />
                <Panel position="top-left">
                    <Search nodes={nodes} onSelect={handleSelectNodeFromSearch} />
                </Panel>
                <MiniMap nodeClassName={(node) => (node.type === NodeType.Male ? '!fill-male-light' : '!fill-female-light')} />
            </ReactFlow>
            <Info data={selectedNode} onClose={handleViewAll} />
        </main>
    );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
    const cms = await getCMS();
    return { props: { cms } };
};
