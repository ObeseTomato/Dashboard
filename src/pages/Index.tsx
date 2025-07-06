import { useState } from 'react';
import { AssetLog } from '../components/AssetLog';
import { VisualEcosystem } from '../components/VisualEcosystem';
import { AssetDetailDialog } from '../components/AssetDetailDialog';
import { DigitalAsset } from '../types/dashboard';
import { useDigitalAssets } from '../hooks/useSupabaseAPI'; // Assuming useDigitalAssets is here

export const Index = () => {
  const [activeTab, setActiveTab] = useState('log');
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const { data: assets, isLoading } = useDigitalAssets();

  const handleAssetClick = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
  };

  const handleDialogClose = () => {
    setSelectedAsset(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'log' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          Asset Log
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'visual' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          Visual Ecosystem
        </button>
      </div>

      {activeTab === 'log' && (
        <AssetLog
          assets={assets || []}
          onAssetClick={handleAssetClick}
        />
      )}

      {activeTab === 'visual' && (
        <VisualEcosystem
          assets={assets || []}
          onNodeClick={handleAssetClick}
        />
      )}

      <AssetDetailDialog
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default Index;