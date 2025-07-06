import React from 'react';
import { GraphCanvas, GraphCanvasRef, Node, Edge } from 'reagraph';
import { DigitalAsset } from '../types/dashboard';

interface VisualEcosystemProps {
  assets: DigitalAsset[];
  onNodeClick: (asset: DigitalAsset) => void;
}

export const VisualEcosystem = ({ assets, onNodeClick }: VisualEcosystemProps) => {
  const graphRef = React.useRef<GraphCanvasRef | null>(null);

  const nodes: Node[] = assets.map(asset => ({
    id: asset.id.toString(),
    label: asset.asset_name,
    // Add any other node properties you need
  }));

  // Example edges - you would build this logic based on your asset relationships
  const edges: Edge[] = []; 
  // Example: if assets have a 'parent_id', you could create edges:
  // assets.forEach(asset => {
  //   if (asset.parent_id) {
  //     edges.push({
  //       source: asset.parent_id.toString(),
  //       target: asset.id.toString(),
  //       id: `${asset.parent_id}-${asset.id}`,
  //     });
  //   }
  // });

  const handleNodeClick = (node: Node) => {
    const asset = assets.find(a => a.id.toString() === node.id);
    if (asset) {
      onNodeClick(asset);
    }
  };

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