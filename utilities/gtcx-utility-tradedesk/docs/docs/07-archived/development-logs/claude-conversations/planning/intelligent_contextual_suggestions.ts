// ============================================================================
// GEOTAG™ INTELLIGENT CONTEXTUAL SUGGESTION SYSTEM
// Proactive assistant that suggests relevant actions based on context
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
  Dimensions,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ============================================================================
// CONSTANTS AND TYPES
// ============================================================================

const GHANA_COLORS = {
  red: '#CE1126',
  gold: '#FCD116',
  green: '#006B3F',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

interface LocationContext {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  isKnownSite: boolean;
  siteType?: 'mining' | 'office' | 'residential' | 'commercial';
  goldPotential?: 'high' | 'medium' | 'low' | 'none';
  distanceFromLastLocation: number;
  timeAtLocation: number;
}

interface TimeContext {
  currentTime: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  workingHours: boolean;
  sessionDuration?: number;
}

interface BehaviorPattern {
  frequentLocations: LocationContext[];
  typicalWorkHours: { start: number; end: number };
  averageSessionLength: number;
  preferredActions: string[];
  recentActivity: ActivityRecord[];
  workflowCompletionRate: number;
}

interface ActivityRecord {
  timestamp: number;
  action: string;
  location: LocationContext;
  duration: number;
  completed: boolean;
}

interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon: string;
  color: string;
  estimatedTime: string;
  benefits: string[];
}

interface SmartSuggestion {
  id: string;
  trigger: {
    type: 'location' | 'time' | 'behavior' | 'hybrid';
    context: LocationContext | TimeContext | BehaviorPattern | any;
  };
  action: WorkflowSuggestion;
  confidence: number;
  reasoning: string;
  timestamp: number;
  userRole: 'miner' | 'inspector' | 'company' | 'trader';
  dismissed?: boolean;
  accepted?: boolean;
}

// ============================================================================
// GEOLOGICAL DATA INTEGRATION
// ============================================================================

class GeologicalAnalyzer {
  private static goldBearingRegions = [
    // Ashanti Region - High gold potential
    {
      name: 'Ashanti Gold Belt',
      bounds: {
        north: 7.5,
        south: 5.5,
        east: -0.5,
        west: -2.5,
      },
      goldPotential: 'high' as const,
      geologicalFormation: 'Birimian',
      primaryMinerals: ['gold', 'quartz', 'pyrite'],
    },
    // Western Region - High gold potential
    {
      name: 'Western Gold Fields',
      bounds: {
        north: 6.5,
        south: 4.5,
        east: -1.5,
        west: -3.5,
      },
      goldPotential: 'high' as const,
      geologicalFormation: 'Tarkwaian',
      primaryMinerals: ['gold', 'conglomerate', 'quartzite'],
    },
    // Eastern Region - Medium gold potential
    {
      name: 'Eastern Prospects',
      bounds: {
        north: 7.0,
        south: 5.0,
        east: 0.5,
        west: -1.0,
      },
      goldPotential: 'medium' as const,
      geologicalFormation: 'Dahomeyan',
      primaryMinerals: ['gold', 'schist', 'gneiss'],
    },
  ];

  static analyzeGoldPotential(latitude: number, longitude: number): {
    goldPotential: 'high' | 'medium' | 'low' | 'none';
    confidence: number;
    formation?: string;
    minerals?: string[];
  } {
    for (const region of this.goldBearingRegions) {
      const { bounds } = region;
      if (
        latitude <= bounds.north &&
        latitude >= bounds.south &&
        longitude <= bounds.east &&
        longitude >= bounds.west
      ) {
        return {
          goldPotential: region.goldPotential,
          confidence: region.goldPotential === 'high' ? 0.9 : 0.7,
          formation: region.geologicalFormation,
          minerals: region.primaryMinerals,
        };
      }
    }

    // Calculate proximity to known gold regions
    let minDistance = Infinity;
    let nearestRegion = null;

    for (const region of this.goldBearingRegions) {
      const centerLat = (region.bounds.north + region.bounds.south) / 2;
      const centerLon = (region.bounds.east + region.bounds.west) / 2;
      const distance = this.calculateDistance(latitude, longitude, centerLat, centerLon);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = region;
      }
    }

    if (minDistance < 50) { // Within 50km of gold region
      return {
        goldPotential: 'low',
        confidence: Math.max(0.3, 1 - (minDistance / 50)),
      };
    }

    return {
      goldPotential: 'none',
      confidence: 0.9,
    };
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// ============================================================================
// MACHINE LEARNING PATTERN RECOGNITION
// ============================================================================

class BehaviorAnalyzer {
  private static readonly LEARNING_THRESHOLD = 10; // Minimum activities to establish patterns
  private static readonly CONFIDENCE_DECAY = 0.1; // How much confidence decreases over time

  static async analyzeBehaviorPatterns(userRole: string): Promise<BehaviorPattern> {
    try {
      const activityHistory = await AsyncStorage.getItem(`activityHistory_${userRole}`);
      const activities: ActivityRecord[] = activityHistory ? JSON.parse(activityHistory) : [];

      if (activities.length < this.LEARNING_THRESHOLD) {
        return this.getDefaultPattern(userRole);
      }

      const frequentLocations = this.identifyFrequentLocations(activities);
      const typicalWorkHours = this.analyzeWorkHours(activities);
      const averageSessionLength = this.calculateAverageSessionLength(activities);
      const preferredActions = this.identifyPreferredActions(activities);
      const workflowCompletionRate = this.calculateCompletionRate(activities);

      return {
        frequentLocations,
        typicalWorkHours,
        averageSessionLength,
        preferredActions,
        recentActivity: activities.slice(-20), // Last 20 activities
        workflowCompletionRate,
      };
    } catch (error) {
      console.error('Behavior analysis error:', error);
      return this.getDefaultPattern(userRole);
    }
  }

  private static getDefaultPattern(userRole: string): BehaviorPattern {
    const defaults = {
      miner: {
        typicalWorkHours: { start: 7, end: 17 },
        averageSessionLength: 6 * 60 * 60 * 1000, // 6 hours
        preferredActions: ['workSiteTagging', 'goldLotRegistration'],
      },
      inspector: {
        typicalWorkHours: { start: 8, end: 16 },
        averageSessionLength: 3 * 60 * 60 * 1000, // 3 hours
        preferredActions: ['routineInspection', 'violationInvestigation'],
      },
      company: {
        typicalWorkHours: { start: 8, end: 18 },
        averageSessionLength: 4 * 60 * 60 * 1000, // 4 hours
        preferredActions: ['operationsDashboard', 'employeeVerification'],
      },
      trader: {
        typicalWorkHours: { start: 9, end: 17 },
        averageSessionLength: 2 * 60 * 60 * 1000, // 2 hours
        preferredActions: ['certificateScanner', 'supplyChainTrace'],
      },
    };

    const defaultConfig = defaults[userRole as keyof typeof defaults] || defaults.miner;

    return {
      frequentLocations: [],
      typicalWorkHours: defaultConfig.typicalWorkHours,
      averageSessionLength: defaultConfig.averageSessionLength,
      preferredActions: defaultConfig.preferredActions,
      recentActivity: [],
      workflowCompletionRate: 0.7,
    };
  }

  private static identifyFrequentLocations(activities: ActivityRecord[]): LocationContext[] {
    const locationClusters = new Map<string, LocationContext[]>();
    const CLUSTER_RADIUS = 100; // 100 meters

    activities.forEach(activity => {
      const location = activity.location;
      let foundCluster = false;

      for (const [key, cluster] of locationClusters) {
        const [lat, lon] = key.split(',').map(Number);
        const distance = GeologicalAnalyzer['calculateDistance'](
          location.latitude, location.longitude, lat, lon
        ) * 1000; // Convert to meters

        if (distance <= CLUSTER_RADIUS) {
          cluster.push(location);
          foundCluster = true;
          break;
        }
      }

      if (!foundCluster) {
        const key = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;
        locationClusters.set(key, [location]);
      }
    });

    // Return clusters with more than 3 visits, sorted by frequency
    return Array.from(locationClusters.entries())
      .filter(([_, cluster]) => cluster.length >= 3)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10) // Top 10 frequent locations
      .map(([key, cluster]) => {
        const [lat, lon] = key.split(',').map(Number);
        return {
          latitude: lat,
          longitude: lon,
          accuracy: 5,
          timestamp: Date.now(),
          isKnownSite: true,
          distanceFromLastLocation: 0,
          timeAtLocation: cluster.reduce((sum, loc) => sum + loc.timeAtLocation, 0),
        };
      });
  }

  private static analyzeWorkHours(activities: ActivityRecord[]): { start: number; end: number } {
    const workHours = activities
      .filter(activity => activity.completed)
      .map(activity => new Date(activity.timestamp).getHours());

    if (workHours.length === 0) {
      return { start: 8, end: 17 };
    }

    const sortedHours = workHours.sort((a, b) => a - b);
    const start = sortedHours[Math.floor(sortedHours.length * 0.1)]; // 10th percentile
    const end = sortedHours[Math.floor(sortedHours.length * 0.9)]; // 90th percentile

    return { start, end };
  }

  private static calculateAverageSessionLength(activities: ActivityRecord[]): number {
    const completedSessions = activities.filter(activity => activity.completed);
    if (completedSessions.length === 0) return 2 * 60 * 60 * 1000; // 2 hours default

    const totalDuration = completedSessions.reduce((sum, activity) => sum + activity.duration, 0);
    return totalDuration / completedSessions.length;
  }

  private static identifyPreferredActions(activities: ActivityRecord[]): string[] {
    const actionCounts = new Map<string, number>();

    activities.forEach(activity => {
      const count = actionCounts.get(activity.action) || 0;
      actionCounts.set(activity.action, count + 1);
    });

    return Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, _]) => action);
  }

  private static calculateCompletionRate(activities: ActivityRecord[]): number {
    if (activities.length === 0) return 0.7;

    const completedCount = activities.filter(activity => activity.completed).length;
    return completedCount / activities.length;
  }
}

// ============================================================================
// SUGGESTION ENGINE
// ============================================================================

class SuggestionEngine {
  private static suggestionTemplates: Record<string, WorkflowSuggestion[]> = {
    miner: [
      {
        id: 'goldLotRegistration',
        title: 'Register Gold Discovery',
        description: 'Create verifiable origin proof for new gold find',
        action: 'goldLotRegistration',
        priority: 'high',
        icon: 'star',
        color: GHANA_COLORS.gold,
        estimatedTime: '8-10 minutes',
        benefits: ['Legal compliance', 'Origin verification', 'Market value'],
      },
      {
        id: 'workSiteTagging',
        title: 'Tag Work Site',
        description: 'Log daily work location for compliance',
        action: 'workSiteTagging',
        priority: 'medium',
        icon: 'location',
        color: GHANA_COLORS.green,
        estimatedTime: '2-3 minutes',
        benefits: ['Compliance tracking', 'Work history', 'GPS verification'],
      },
      {
        id: 'safetyBreak',
        title: 'Take Safety Break',
        description: 'Time for a safety break and hydration',
        action: 'safetyBreak',
        priority: 'urgent',
        icon: 'medical',
        color: GHANA_COLORS.red,
        estimatedTime: '15-20 minutes',
        benefits: ['Worker safety', 'Productivity', 'Legal compliance'],
      },
    ],
    inspector: [
      {
        id: 'routineInspection',
        title: 'Start Site Inspection',
        description: 'Begin comprehensive compliance inspection',
        action: 'routineInspection',
        priority: 'high',
        icon: 'clipboard',
        color: '#1E3A8A',
        estimatedTime: '2-3 hours',
        benefits: ['Compliance verification', 'Evidence collection', 'Official report'],
      },
      {
        id: 'consolidatedReport',
        title: 'Generate Consolidated Report',
        description: 'Create summary report for multiple site visits',
        action: 'consolidatedReport',
        priority: 'medium',
        icon: 'documents',
        color: '#059669',
        estimatedTime: '30-45 minutes',
        benefits: ['Time efficiency', 'Comprehensive overview', 'Management reporting'],
      },
    ],
    company: [
      {
        id: 'operationsDashboard',
        title: 'Review Operations',
        description: 'Check multi-site operational status',
        action: 'operationsDashboard',
        priority: 'medium',
        icon: 'analytics',
        color: GHANA_COLORS.green,
        estimatedTime: '15-20 minutes',
        benefits: ['Operational oversight', 'Performance tracking', 'Resource optimization'],
      },
    ],
    trader: [
      {
        id: 'certificateScanner',
        title: 'Verify Gold Origin',
        description: 'Scan certificate to verify gold lot authenticity',
        action: 'certificateScanner',
        priority: 'high',
        icon: 'qr-code',
        color: GHANA_COLORS.gold,
        estimatedTime: '1-2 minutes',
        benefits: ['Origin verification', 'Risk mitigation', 'Compliance assurance'],
      },
    ],
  };

  static async generateSuggestions(
    locationContext: LocationContext,
    timeContext: TimeContext,
    behaviorPattern: BehaviorPattern,
    userRole: string
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Location-based suggestions
    suggestions.push(...this.analyzeLocationContext(locationContext, userRole));

    // Time-based suggestions
    suggestions.push(...this.analyzeTimeContext(timeContext, behaviorPattern, userRole));

    // Behavior-based suggestions
    suggestions.push(...this.analyzeBehaviorContext(behaviorPattern, locationContext, userRole));

    // Hybrid suggestions combining multiple contexts
    suggestions.push(...this.generateHybridSuggestions(locationContext, timeContext, behaviorPattern, userRole));

    // Filter and rank suggestions
    return this.rankAndFilterSuggestions(suggestions);
  }

  private static analyzeLocationContext(location: LocationContext, userRole: string): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const templates = this.suggestionTemplates[userRole] || [];

    // New location with gold potential
    if (!location.isKnownSite && location.goldPotential === 'high') {
      const goldRegistration = templates.find(t => t.id === 'goldLotRegistration');
      if (goldRegistration) {
        suggestions.push({
          id: `gold-potential-${Date.now()}`,
          trigger: { type: 'location', context: location },
          action: goldRegistration,
          confidence: 0.9,
          reasoning: `You're at a new location with high gold potential (${location.goldPotential}). This area has favorable geological conditions for gold deposits.`,
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    // Arrived at known mining site
    if (location.isKnownSite && location.siteType === 'mining') {
      const workSiteTagging = templates.find(t => t.id === 'workSiteTagging');
      if (workSiteTagging) {
        suggestions.push({
          id: `known-site-${Date.now()}`,
          trigger: { type: 'location', context: location },
          action: workSiteTagging,
          confidence: 0.8,
          reasoning: 'You\'ve arrived at a familiar mining site. Logging your work location helps maintain compliance records.',
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    // Extended time at location
    if (location.timeAtLocation > 30 * 60 * 1000) { // 30 minutes
      const inspection = templates.find(t => t.id === 'routineInspection');
      if (inspection && userRole === 'inspector') {
        suggestions.push({
          id: `extended-time-${Date.now()}`,
          trigger: { type: 'location', context: location },
          action: inspection,
          confidence: 0.7,
          reasoning: 'You\'ve been at this location for an extended time. Consider starting a formal site inspection.',
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    return suggestions;
  }

  private static analyzeTimeContext(
    timeContext: TimeContext,
    behaviorPattern: BehaviorPattern,
    userRole: string
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const templates = this.suggestionTemplates[userRole] || [];

    // Long work session - suggest safety break
    if (timeContext.sessionDuration && timeContext.sessionDuration > 4 * 60 * 60 * 1000) { // 4 hours
      const safetyBreak = templates.find(t => t.id === 'safetyBreak');
      if (safetyBreak) {
        suggestions.push({
          id: `safety-break-${Date.now()}`,
          trigger: { type: 'time', context: timeContext },
          action: safetyBreak,
          confidence: 0.95,
          reasoning: `Work session running for ${Math.round(timeContext.sessionDuration / (60 * 60 * 1000))} hours. Time for a safety break to maintain productivity and health.`,
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    // End of typical work day
    const currentHour = new Date(timeContext.currentTime).getHours();
    if (currentHour >= behaviorPattern.typicalWorkHours.end - 1) {
      if (userRole === 'inspector') {
        const consolidatedReport = templates.find(t => t.id === 'consolidatedReport');
        if (consolidatedReport) {
          suggestions.push({
            id: `end-day-report-${Date.now()}`,
            trigger: { type: 'time', context: timeContext },
            action: consolidatedReport,
            confidence: 0.8,
            reasoning: 'End of work day approaching. Generate a consolidated report for today\'s inspections.',
            timestamp: Date.now(),
            userRole: userRole as any,
          });
        }
      }
    }

    return suggestions;
  }

  private static analyzeBehaviorContext(
    behaviorPattern: BehaviorPattern,
    locationContext: LocationContext,
    userRole: string
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const templates = this.suggestionTemplates[userRole] || [];

    // User frequently performs certain actions - suggest preferred action
    if (behaviorPattern.preferredActions.length > 0) {
      const preferredAction = behaviorPattern.preferredActions[0];
      const template = templates.find(t => t.id === preferredAction);
      
      if (template && Math.random() < 0.3) { // 30% chance to suggest preferred action
        suggestions.push({
          id: `preferred-action-${Date.now()}`,
          trigger: { type: 'behavior', context: behaviorPattern },
          action: template,
          confidence: 0.6,
          reasoning: `Based on your activity history, you frequently use ${template.title}. Would you like to start this workflow?`,
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    // Low completion rate - suggest simpler workflows
    if (behaviorPattern.workflowCompletionRate < 0.5) {
      const simpleActions = templates.filter(t => t.priority !== 'high');
      if (simpleActions.length > 0) {
        const simpleAction = simpleActions[0];
        suggestions.push({
          id: `simple-workflow-${Date.now()}`,
          trigger: { type: 'behavior', context: behaviorPattern },
          action: simpleAction,
          confidence: 0.7,
          reasoning: 'Here\'s a quick task to help you stay productive. This workflow is designed to be completed quickly.',
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    return suggestions;
  }

  private static generateHybridSuggestions(
    locationContext: LocationContext,
    timeContext: TimeContext,
    behaviorPattern: BehaviorPattern,
    userRole: string
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];
    const templates = this.suggestionTemplates[userRole] || [];

    // Inspector at multiple sites during work hours
    if (userRole === 'inspector' && 
        timeContext.workingHours && 
        behaviorPattern.recentActivity.length >= 3) {
      
      const recentSites = new Set(
        behaviorPattern.recentActivity
          .slice(-3)
          .map(activity => `${activity.location.latitude.toFixed(3)},${activity.location.longitude.toFixed(3)}`)
      );

      if (recentSites.size >= 2) {
        const consolidatedReport = templates.find(t => t.id === 'consolidatedReport');
        if (consolidatedReport) {
          suggestions.push({
            id: `multi-site-report-${Date.now()}`,
            trigger: { type: 'hybrid', context: { locationContext, timeContext, behaviorPattern } },
            action: consolidatedReport,
            confidence: 0.85,
            reasoning: `Inspector mode: You've visited ${recentSites.size} different sites today. Consider generating a consolidated inspection report.`,
            timestamp: Date.now(),
            userRole: userRole as any,
          });
        }
      }
    }

    // Miner at high gold potential site during work hours
    if (userRole === 'miner' && 
        locationContext.goldPotential === 'high' && 
        timeContext.workingHours) {
      
      const goldRegistration = templates.find(t => t.id === 'goldLotRegistration');
      if (goldRegistration) {
        suggestions.push({
          id: `optimal-discovery-${Date.now()}`,
          trigger: { type: 'hybrid', context: { locationContext, timeContext } },
          action: goldRegistration,
          confidence: 0.9,
          reasoning: 'Perfect timing! You\'re at a high gold potential location during optimal work hours. Great time to register any discoveries.',
          timestamp: Date.now(),
          userRole: userRole as any,
        });
      }
    }

    return suggestions;
  }

  private static rankAndFilterSuggestions(suggestions: SmartSuggestion[]): SmartSuggestion[] {
    // Remove duplicates based on action ID
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.action.id === suggestion.action.id)
    );

    // Sort by confidence and priority
    const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    return uniqueSuggestions
      .sort((a, b) => {
        const aScore = a.confidence * priorityWeights[a.action.priority];
        const bScore = b.confidence * priorityWeights[b.action.priority];
        return bScore - aScore;
      })
      .slice(0, 3); // Maximum 3 suggestions at a time
  }
}

// ============================================================================
// SUGGESTION CARD COMPONENT
// ============================================================================

interface SuggestionCardProps {
  suggestion: SmartSuggestion;
  onAccept: (suggestion: SmartSuggestion) => void;
  onDismiss: (suggestion: SmartSuggestion) => void;
  onClose: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onAccept,
  onDismiss,
  onClose,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePanGesture = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state === State.ACTIVE) {
      translateX.setValue(translationX);
    } else if (state === State.END) {
      if (Math.abs(translationX) > width * 0.3) {
        // Swipe threshold reached
        const direction = translationX > 0 ? 1 : -1;
        
        Animated.timing(translateX, {
          toValue: direction * width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          if (direction > 0) {
            onAccept(suggestion);
          } else {
            onDismiss(suggestion);
          }
        });
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleAccept = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: width,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAccept(suggestion);
    });
  };

  const handleDismiss = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(suggestion);
    });
  };

  const getPriorityColor = () => {
    switch (suggestion.action.priority) {
      case 'urgent': return GHANA_COLORS.red;
      case 'high': return GHANA_COLORS.gold;
      case 'medium': return GHANA_COLORS.green;
      case 'low': return GHANA_COLORS.gray;
      default: return GHANA_COLORS.green;
    }
  };

  return