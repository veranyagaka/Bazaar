
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface MatchFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

const MatchFilters = ({ onFilterChange, currentFilters }: MatchFiltersProps) => {
  const handleFilterUpdate = (key: string, value: any) => {
    onFilterChange({
      ...currentFilters,
      [key]: value
    });
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Filter Results</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="minMatchScore">Minimum Match Score: {currentFilters.minMatchScore || 30}%</Label>
          <Slider
            id="minMatchScore"
            min={0}
            max={100}
            step={5}
            value={[currentFilters.minMatchScore || 30]}
            onValueChange={(value) => handleFilterUpdate('minMatchScore', value[0])}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="maxDistance">Maximum Distance (km)</Label>
          <Select 
            value={currentFilters.maxDistance || 'any'} 
            onValueChange={(value) => handleFilterUpdate('maxDistance', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any distance</SelectItem>
              <SelectItem value="10">Within 10 km</SelectItem>
              <SelectItem value="25">Within 25 km</SelectItem>
              <SelectItem value="50">Within 50 km</SelectItem>
              <SelectItem value="100">Within 100 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priceRange">Price Range (KES/kg)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              placeholder="Min price"
              type="number"
              value={currentFilters.minPrice || ''}
              onChange={(e) => handleFilterUpdate('minPrice', parseFloat(e.target.value) || 0)}
            />
            <Input
              placeholder="Max price"
              type="number"
              value={currentFilters.maxPrice || ''}
              onChange={(e) => handleFilterUpdate('maxPrice', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sortBy">Sort by</Label>
          <Select 
            value={currentFilters.sortBy || 'matchScore'} 
            onValueChange={(value) => handleFilterUpdate('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="price">Price (Highest)</SelectItem>
              <SelectItem value="quantity">Quantity Needed</SelectItem>
              <SelectItem value="date">Date Posted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onFilterChange({})}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  );
};

export default MatchFilters;
