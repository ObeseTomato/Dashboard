import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DigitalAsset } from '../types/dashboard';

interface AssetDetailDialogProps {
  asset: DigitalAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

// Utility functions for safely rendering data
const renderSafeValue = (value: any): string => {
  if (value === null || typeof value === 'undefined') return "N/A";
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const safeGet = (obj: any, path: string, defaultValue: any = null) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
};

const safeArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [];
};

export const AssetDetailDialog = ({ asset, isOpen, onClose }: AssetDetailDialogProps) => {
  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{asset.asset_name || 'Asset Details'}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          {asset.key_metrics_json ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Business Information */}
              {safeGet(asset.key_metrics_json, 'businessInformation') && (
                <Card className="md:col-span-1">
                  <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
                  <CardContent>
                    <p><strong>Name:</strong> {renderSafeValue(safeGet(asset.key_metrics_json, 'businessInformation.businessName'))}</p>
                    <p><strong>Address:</strong> {renderSafeValue(safeGet(asset.key_metrics_json, 'businessInformation.address'))}</p>
                    <p><strong>Website:</strong> {renderSafeValue(safeGet(asset.key_metrics_json, 'businessInformation.websiteUrl'))}</p>
                    <p><strong>Phone:</strong> {renderSafeValue(safeGet(asset.key_metrics_json, 'businessInformation.phone'))}</p>
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              {safeGet(asset.key_metrics_json, 'services') && (
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Services</CardTitle></CardHeader>
                  <CardContent>
                    <ul>
                      {safeArray(safeGet(asset.key_metrics_json, 'services')).map((service: any, index: number) => (
                        <li key={index}><strong>{renderSafeValue(service.displayName)}</strong>: ${renderSafeValue(service.price)}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {/* Q&A */}
              {safeGet(asset.key_metrics_json, 'qa') && (
                  <Card className="md:col-span-3">
                      <CardHeader><CardTitle>Questions & Answers</CardTitle></CardHeader>
                      <CardContent>
                          {safeArray(safeGet(asset.key_metrics_json, 'qa')).map((item: any, index: number) => (
                              <div key={index} className="mb-4">
                                  <p><strong>Q:</strong> {renderSafeValue(item.question)}</p>
                                  <p><strong>A:</strong> {renderSafeValue(item.answer)}</p>
                              </div>
                          ))}
                      </CardContent>
                  </Card>
              )}
            </div>
          ) : (
            <p>No detailed metrics available for this asset.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};