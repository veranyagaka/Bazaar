
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Clock, Phone, MessageCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MatchResultsProps {
  matches: any[];
  searchData: any;
  onBackToSearch: () => void;
}

const MatchResults = ({ matches, searchData, onBackToSearch }: MatchResultsProps) => {
  const { toast } = useToast();

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleContact = (buyerName: string, phone: string) => {
    toast({
      title: "Contact Information",
      description: `You can reach ${buyerName} at ${phone || 'Contact through platform'}`
    });
  };

  const handleConnect = (buyerId: string, buyerName: string) => {
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${buyerName}. They will be notified about your offer.`
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={onBackToSearch}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Market Matches for {searchData.cropType}</h1>
          <p className="text-muted-foreground">
            {matches.length} potential buyers found • {searchData.quantity} {searchData.unit} • {searchData.county}
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No matches found</h3>
            <p>Try adjusting your search criteria or check back later for new buyer requests.</p>
          </div>
          <Button onClick={onBackToSearch} variant="outline">
            Modify Search Criteria
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {match.profiles?.full_name || `Buyer #${match.buyer_id.slice(-6)}`}
                    </h3>
                    <Badge className={`${getMatchScoreColor(match.matchScore)} text-white`}>
                      {match.matchScore}% {getMatchScoreText(match.matchScore)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{match.county || 'County not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Posted {formatDate(match.created_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Quantity Needed: </span>
                      {match.quantity_needed} {match.unit}
                    </div>
                    <div>
                      <span className="font-medium">Max Price: </span>
                      {formatPrice(match.max_price_per_unit)}/{match.unit}
                    </div>
                  </div>

                  {match.delivery_date && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Delivery by: </span>
                      {formatDate(match.delivery_date)}
                    </div>
                  )}

                  {match.quality_requirements && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Quality Requirements: </span>
                      {match.quality_requirements}
                    </div>
                  )}

                  {match.preferred_location && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Preferred Location: </span>
                      {match.preferred_location}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleConnect(match.buyer_id, match.profiles?.full_name || 'Buyer')}
                    className="whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  
                  {match.profiles?.phone_number && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContact(match.profiles?.full_name || 'Buyer', match.profiles?.phone_number)}
                      className="whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex space-x-4">
                    <span>Match Score: {match.matchScore}%</span>
                    {match.avgMarketPrice && (
                      <span>Market Price: {formatPrice(match.avgMarketPrice)}/kg</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 p-6 bg-primary/5">
        <h3 className="font-semibold mb-2">Market Insights</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Average Match Score: </span>
            {matches.length > 0 ? Math.round(matches.reduce((sum, match) => sum + match.matchScore, 0) / matches.length) : 0}%
          </div>
          <div>
            <span className="font-medium">Best Price Offered: </span>
            {matches.length > 0 ? formatPrice(Math.max(...matches.map(m => m.max_price_per_unit))) : 'N/A'}
          </div>
          <div>
            <span className="font-medium">Total Demand: </span>
            {matches.reduce((sum, match) => sum + match.quantity_needed, 0)} {searchData.unit}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MatchResults;
