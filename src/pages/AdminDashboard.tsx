
import { useState } from 'react';
import { Upload, FileSpreadsheet, Download, Trash2, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface PriceData {
  id: string;
  produce: string;
  category: string;
  price: number;
  unit: string;
  market: string;
  lastUpdated: string;
}

const AdminDashboard = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([
    { id: '1', produce: 'Tomatoes', category: 'vegetables', price: 45, unit: 'kg', market: 'Central Market', lastUpdated: '2024-01-15' },
    { id: '2', produce: 'Maize', category: 'grains', price: 35, unit: 'kg', market: 'Wholesale Market', lastUpdated: '2024-01-15' },
    { id: '3', produce: 'Beans', category: 'grains', price: 80, unit: 'kg', market: 'Local Market', lastUpdated: '2024-01-14' },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PriceData>>({});
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    // Simulate file processing
    setTimeout(() => {
      const newData: PriceData[] = [
        { id: Date.now().toString(), produce: 'Cabbage', category: 'vegetables', price: 25, unit: 'kg', market: 'Import from Excel', lastUpdated: new Date().toISOString().split('T')[0] },
        { id: (Date.now() + 1).toString(), produce: 'Carrots', category: 'vegetables', price: 55, unit: 'kg', market: 'Import from Excel', lastUpdated: new Date().toISOString().split('T')[0] },
      ];
      
      setPriceData(prev => [...prev, ...newData]);
      toast({
        title: "File uploaded successfully",
        description: `Added ${newData.length} new price entries`,
      });
    }, 1000);

    // Reset file input
    event.target.value = '';
  };

  const startEditing = (item: PriceData) => {
    setEditingId(item.id);
    setEditingData(item);
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    setPriceData(prev => 
      prev.map(item => 
        item.id === editingId 
          ? { ...item, ...editingData, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    
    setEditingId(null);
    setEditingData({});
    toast({
      title: "Price updated",
      description: "Market price has been updated successfully",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const deleteItem = (id: string) => {
    setPriceData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Price deleted",
      description: "Market price entry has been removed",
    });
  };

  const exportData = () => {
    // Simulate export functionality
    toast({
      title: "Export started",
      description: "Price data is being exported to Excel file",
    });
  };

  return (
    <div className="min-h-screen bg-bazaar-bg">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage market prices and data imports</p>
        </div>

        {/* Upload Section */}
        <Card className="bazaar-card mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Price Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-300 mb-1">Upload Excel file</p>
                    <p className="text-sm text-gray-500">Supports .xlsx and .xls files</p>
                  </div>
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Download Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Data Table */}
        <Card className="bazaar-card">
          <CardHeader>
            <CardTitle className="text-white">Current Market Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Produce</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Unit</TableHead>
                    <TableHead className="text-gray-300">Market</TableHead>
                    <TableHead className="text-gray-300">Last Updated</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-white">
                        {editingId === item.id ? (
                          <Input
                            value={editingData.produce || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, produce: e.target.value }))}
                            className="bazaar-input h-8"
                          />
                        ) : (
                          item.produce
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {editingId === item.id ? (
                          <Input
                            value={editingData.category || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, category: e.target.value }))}
                            className="bazaar-input h-8"
                          />
                        ) : (
                          item.category
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.price || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="bazaar-input h-8"
                          />
                        ) : (
                          `$${item.price}`
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {editingId === item.id ? (
                          <Input
                            value={editingData.unit || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, unit: e.target.value }))}
                            className="bazaar-input h-8"
                          />
                        ) : (
                          item.unit
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {editingId === item.id ? (
                          <Input
                            value={editingData.market || ''}
                            onChange={(e) => setEditingData(prev => ({ ...prev, market: e.target.value }))}
                            className="bazaar-input h-8"
                          />
                        ) : (
                          item.market
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">{item.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <Button size="sm" onClick={saveEdit} className="h-8 px-2">
                                <Save className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2">
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEditing(item)} className="h-8 px-2">
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)} className="h-8 px-2">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
