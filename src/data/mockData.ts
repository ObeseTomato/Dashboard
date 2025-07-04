import { DashboardData } from '../types/dashboard';

export const mockDashboardData: DashboardData = {
  clinic: {
    name: 'Dr. Sala & Associates',
    logo: '/logo.png',
    specialties: ['Clinical Psychology', 'Therapy', 'Counseling'],
    location: 'Miami, FL'
  },
  lastUpdated: 'Dec 3, 2024 at 2:30 PM',
  dataQuality: 92,
  assets: [
    {
      id: 'gmb-main',
      name: 'Google Business Profile',
      type: 'gmb',
      status: 'active',
      priority: 'high',
      lastUpdated: '2 hours ago',
      metrics: { views: 2847, clicks: 342, calls: 28 },
      url: 'https://g.page/dr-sala-associates'
    },
    {
      id: 'website-main',
      name: 'Main Website',
      type: 'website',
      status: 'active',
      priority: 'high',
      lastUpdated: '1 day ago',
      metrics: { sessions: 1234, users: 987, pageviews: 3456 },
      url: 'https://drsalaassociates.com'
    },
    {
      id: 'facebook-page',
      name: 'Facebook Business Page',
      type: 'social_media',
      status: 'warning',
      priority: 'medium',
      lastUpdated: '3 days ago',
      metrics: { followers: 2145, engagement: 156 },
      url: 'https://facebook.com/drsalaassociates'
    },
    {
      id: 'instagram-profile',
      name: 'Instagram Profile',
      type: 'social_media',
      status: 'critical',
      priority: 'high',
      lastUpdated: '1 week ago',
      metrics: { followers: 892, posts: 45 },
      url: 'https://instagram.com/drsalaassociates'
    },
    {
      id: 'psychology-today',
      name: 'Psychology Today Profile',
      type: 'directory',
      status: 'active',
      priority: 'high',
      lastUpdated: '2 days ago',
      url: 'https://psychologytoday.com/dr-sala'
    },
    {
      id: 'google-ads',
      name: 'Google Ads Campaign',
      type: 'advertising',
      status: 'active',
      priority: 'medium',
      lastUpdated: '6 hours ago',
      metrics: { impressions: 15420, clicks: 234, cost: 567.89 }
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Update Instagram bio with new services',
      description: 'Add teletherapy and EMDR therapy to bio and highlights',
      type: 'content_creation',
      priority: 'high',
      dueDate: '2024-12-05',
      completed: false,
      aiGenerated: false
    },
    {
      id: 'task-2',
      title: 'Respond to Google Reviews',
      description: 'Reply to 3 recent patient reviews professionally',
      type: 'engagement',
      priority: 'high',
      dueDate: '2024-12-04',
      completed: false,
      aiGenerated: true
    },
    {
      id: 'task-3',
      title: 'Create holiday therapy tips blog post',
      description: 'Write about managing anxiety during holidays',
      type: 'content_creation',
      priority: 'medium',
      dueDate: '2024-12-10',
      completed: false,
      aiGenerated: true
    },
    {
      id: 'task-4',
      title: 'Update website contact form',
      description: 'Add insurance verification questions',
      type: 'optimization',
      priority: 'medium',
      dueDate: '2024-12-08',
      completed: true,
      aiGenerated: false
    }
  ],
  analytics: {
    gmb: {
      views: [450, 520, 380, 640, 580, 720, 690],
      clicks: [45, 52, 38, 64, 58, 72, 69],
      calls: [5, 8, 4, 9, 7, 12, 8],
      dates: ['Nov 27', 'Nov 28', 'Nov 29', 'Nov 30', 'Dec 1', 'Dec 2', 'Dec 3']
    },
    website: {
      users: [180, 210, 165, 245, 220, 280, 250],
      sessions: [220, 260, 195, 290, 270, 340, 310],
      pageviews: [580, 680, 510, 750, 720, 890, 820],
      dates: ['Nov 27', 'Nov 28', 'Nov 29', 'Nov 30', 'Dec 1', 'Dec 2', 'Dec 3']
    },
    reviews: {
      total: 127,
      average: 4.8,
      recent: [
        {
          id: 'review-1',
          author: 'Sarah M.',
          rating: 5,
          text: 'Dr. Sala is incredibly compassionate and professional. The therapy sessions have been life-changing.',
          date: '2024-12-01',
          platform: 'Google',
          replied: false
        },
        {
          id: 'review-2',
          author: 'Michael R.',
          rating: 5,
          text: 'Great experience with the team. Very understanding and helpful throughout my treatment.',
          date: '2024-11-28',
          platform: 'Google',
          replied: true
        },
        {
          id: 'review-3',
          author: 'Jennifer L.',
          rating: 4,
          text: 'Professional service and comfortable environment. Would recommend to others.',
          date: '2024-11-25',
          platform: 'Psychology Today',
          replied: false
        }
      ]
    }
  },
  competitors: [
    {
      id: 'comp-1',
      name: 'Miami Therapy Center',
      rating: 4.6,
      reviewCount: 89,
      category: 'Mental Health',
      distance: '2.1 miles',
      lastPostDate: '2024-11-30'
    },
    {
      id: 'comp-2',
      name: 'Wellness Psychology Group',
      rating: 4.4,
      reviewCount: 156,
      category: 'Psychology',
      distance: '3.5 miles',
      lastPostDate: '2024-12-01'
    },
    {
      id: 'comp-3',
      name: 'South Florida Counseling',
      rating: 4.7,
      reviewCount: 203,
      category: 'Counseling',
      distance: '4.2 miles',
      lastPostDate: '2024-11-29'
    }
  ]
};