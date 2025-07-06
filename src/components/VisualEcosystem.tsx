import React, { useMemo, useCallback } from 'react';
import { GraphCanvas, GraphCanvasRef, Node, Edge } from 'reagraph';
import { DigitalAsset } from '../types/dashboard';

interface VisualEcosystemProps {
  assets: DigitalAsset[];
  onNodeClick: (asset: DigitalAsset) => void;
}

export const VisualEcosystem = ({ assets, onNodeClick }: VisualEcosystemProps) => {
  const graphRef = React.useRef<GraphCanvasRef | null>(null);

  // Memoize the nodes array to ensure it's only re-created when assets change.
  const nodes: Node[] = useMemo(() =>
    assets.map(asset => ({
      id: asset.id.toString(),
      label: asset.asset_name,
    })),
    [assets]
  );

  // Memoize the edges array for stability.
  const edges: Edge[] = useMemo(() => {
    const newEdges: Edge[] = [];
    // Example: if assets have a 'parent_id', you could create edges:
    // assets.forEach(asset => {
    //   if (asset.parent_id) {
    //     newEdges.push({
    //       source: asset.parent_id.toString(),
    //       target: asset.id.toString(),
    //       id: `${asset.parent_id}-${asset.id}`,
    //     });
    //   }
    // });
    return newEdges;
  }, [assets]);

  // Memoize the callback function to prevent re-creating it on every render.
  const handleNodeClick = useCallback((node: Node) => {
    const asset = assets.find(a => a.id.toString() === node.id);
    if (asset) {
      onNodeClick(asset);
    }
  }, [assets, onNodeClick]);

  return (
    <div style={{ height: '80vh', width: '100%', border: '1px solid #ccc' }}>
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};