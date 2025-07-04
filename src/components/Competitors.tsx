import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, MapPin, Star, TrendingUp } from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface CompetitorsProps {
  data: DashboardData;
}

export const Competitors = ({ data }: CompetitorsProps) => {
  const competitors = [
    {
      name: 'Metro Health Center',
      distance: '0.8 miles',
      rating: 4.2,
      reviews: 324,
      specialties: ['General Practice', 'Pediatrics'],
      strengths: ['Extended Hours', 'Online Booking'],
      marketShare: 35
    },
    {
      name: 'Valley Medical Group',
      distance: '1.2 miles',
      rating: 4.5,
      reviews: 567,
      specialties: ['Cardiology', 'Internal Medicine'],
      strengths: ['Specialist Care', 'Modern Equipment'],
      marketShare: 42
    },
    {
      name: 'Community Health Hub',
      distance: '1.8 miles',
      rating: 3.9,
      reviews: 198,
      specialties: ['Family Medicine', 'Urgent Care'],
      strengths: ['Low Cost', 'Walk-ins Welcome'],
      marketShare: 23
    }
  ];

  // Updated market insights with new labels
  const marketInsights = [
    { metric: 'Market Position', value: '#2 in Local Area', trend: 'stable' },
    { metric: 'Review Velocity', value: '+12% YoY', trend: 'up' },
    { metric: 'Service Rating', value: '4.3/5.0', trend: 'up' },
    { metric: 'Domain Authority', value: '42', trend: 'up' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Competitor Analysis</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketInsights.map((insight) => (
          <Card key={insight.metric}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{insight.metric}</p>
                  <p className="text-lg font-semibold">{insight.value}</p>
                </div>
                {insight.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Local Competitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={competitor.name} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{competitor.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {competitor.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {competitor.rating} ({competitor.reviews} reviews)
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {competitor.marketShare}% market share
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.strengths.map((strength) => (
                        <Badge key={strength} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};