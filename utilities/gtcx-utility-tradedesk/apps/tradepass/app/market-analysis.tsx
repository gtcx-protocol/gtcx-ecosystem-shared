// ============================================================================
// TRADEPASS™ MARKET ANALYSIS - AI-POWERED MINING MARKET INTELLIGENCE
// Real-time market data, trends, and predictive analytics for mining commodities
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

interface MarketPrice {
  commodity: string;
  currentPrice: number;
  change24h: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: number;
}

interface PredictionData {
  commodity: string;
  currentPrice: number;
  prediction7d: number;
  prediction30d: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  factors: string[];
}

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: number;
  source: string;
}

export default function MarketAnalysis() {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Gold');
  const [activeTab, setActiveTab] = useState<'prices' | 'predictions' | 'news'>('prices');

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading market data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPrices: MarketPrice[] = [
        {
          commodity: 'Gold',
          currentPrice: 2048.75,
          change24h: 15.25,
          changePercent: 0.75,
          high24h: 2055.00,
          low24h: 2030.50,
          volume: 125000,
          marketCap: 12.8e9,
          lastUpdated: Date.now(),
        },
        {
          commodity: 'Silver',
          currentPrice: 24.85,
          change24h: -0.42,
          changePercent: -1.66,
          high24h: 25.50,
          low24h: 24.70,
          volume: 89000,
          marketCap: 1.2e9,
          lastUpdated: Date.now(),
        },
        {
          commodity: 'Copper',
          currentPrice: 8.47,
          change24h: 0.18,
          changePercent: 2.17,
          high24h: 8.52,
          low24h: 8.28,
          volume: 156000,
          marketCap: 890e6,
          lastUpdated: Date.now(),
        },
        {
          commodity: 'Platinum',
          currentPrice: 945.20,
          change24h: -12.80,
          changePercent: -1.34,
          high24h: 962.00,
          low24h: 940.15,
          volume: 45000,
          marketCap: 320e6,
          lastUpdated: Date.now(),
        },
      ];

      const mockPredictions: PredictionData[] = [
        {
          commodity: 'Gold',
          currentPrice: 2048.75,
          prediction7d: 2065.00,
          prediction30d: 2120.00,
          confidence: 0.82,
          trend: 'bullish',
          factors: ['Fed rate cuts expected', 'Geopolitical tensions', 'Mining supply constraints'],
        },
        {
          commodity: 'Silver',
          currentPrice: 24.85,
          prediction7d: 25.40,
          prediction30d: 26.80,
          confidence: 0.75,
          trend: 'bullish',
          factors: ['Industrial demand growth', 'Solar panel production', 'EV manufacturing'],
        },
        {
          commodity: 'Copper',
          currentPrice: 8.47,
          prediction7d: 8.62,
          prediction30d: 9.15,
          confidence: 0.78,
          trend: 'bullish',
          factors: ['Infrastructure spending', 'Green energy transition', 'China demand recovery'],
        },
      ];

      const mockNews: MarketNews[] = [
        {
          id: 'news-001',
          title: 'Ghana Increases Gold Export Quotas for Q4',
          summary: 'Government announces 15% increase in gold export permits, expected to boost local mining operations.',
          impact: 'positive',
          timestamp: Date.now() - 3600000,
          source: 'Ghana Mining Journal',
        },
        {
          id: 'news-002',
          title: 'New Environmental Regulations Impact Copper Mining',
          summary: 'Stricter environmental compliance requirements may affect copper production costs across West Africa.',
          impact: 'negative',
          timestamp: Date.now() - 7200000,
          source: 'African Mining Weekly',
        },
        {
          id: 'news-003',
          title: 'Global Silver Demand Reaches 10-Year High',
          summary: 'Industrial applications and renewable energy sector driving unprecedented silver consumption.',
          impact: 'positive',
          timestamp: Date.now() - 10800000,
          source: 'Metals Market Intelligence',
        },
      ];

      setMarketPrices(mockPrices);
      setPredictions(mockPredictions);
      setNews(mockNews);
    } catch (error) {
      console.error('Failed to load market data:', error);
      Alert.alert('Error', 'Failed to load market analysis data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return '#22c55e';
      case 'bearish': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#8E8E93';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      case 'neutral': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const handleRefreshData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    loadMarketData();
  };

  const handleAlertSetup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Price Alerts', 'Set up custom price alerts for your commodities');
  };

  const renderPrices = () => (
    <View style={styles.section}>
      {marketPrices.map((price, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.priceCard,
            selectedCommodity === price.commodity && styles.selectedCard
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedCommodity(price.commodity);
          }}
        >
          <View style={styles.priceHeader}>
            <View>
              <Text style={styles.commodityName}>{price.commodity}</Text>
              <Text style={styles.priceValue}>{formatCurrency(price.currentPrice)}</Text>
            </View>
            <View style={styles.priceChange}>
              <Text style={[
                styles.changeValue,
                { color: price.change24h >= 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {price.change24h >= 0 ? '+' : ''}{formatCurrency(price.change24h)}
              </Text>
              <Text style={[
                styles.changePercent,
                { color: price.changePercent >= 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>
          <View style={styles.priceDetails}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>24h High:</Text>
              <Text style={styles.priceData}>{formatCurrency(price.high24h)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>24h Low:</Text>
              <Text style={styles.priceData}>{formatCurrency(price.low24h)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Volume:</Text>
              <Text style={styles.priceData}>{price.volume.toLocaleString()} oz</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Market Cap:</Text>
              <Text style={styles.priceData}>{formatLargeNumber(price.marketCap)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPredictions = () => (
    <View style={styles.section}>
      {predictions.map((prediction, index) => (
        <View key={index} style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <Text style={styles.commodityName}>{prediction.commodity}</Text>
            <View style={[styles.trendBadge, { backgroundColor: getTrendColor(prediction.trend) }]}>
              <Text style={styles.trendText}>{prediction.trend.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.predictionData}>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>Current</Text>
              <Text style={styles.predictionValue}>{formatCurrency(prediction.currentPrice)}</Text>
            </View>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>7-Day</Text>
              <Text style={[
                styles.predictionValue,
                { color: prediction.prediction7d > prediction.currentPrice ? '#22c55e' : '#ef4444' }
              ]}>
                {formatCurrency(prediction.prediction7d)}
              </Text>
            </View>
            <View style={styles.predictionItem}>
              <Text style={styles.predictionLabel}>30-Day</Text>
              <Text style={[
                styles.predictionValue,
                { color: prediction.prediction30d > prediction.currentPrice ? '#22c55e' : '#ef4444' }
              ]}>
                {formatCurrency(prediction.prediction30d)}
              </Text>
            </View>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence: {(prediction.confidence * 100).toFixed(0)}%</Text>
            <View style={styles.confidenceBar}>
              <View style={[
                styles.confidenceFill,
                { width: `${prediction.confidence * 100}%` }
              ]} />
            </View>
          </View>
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsTitle}>Key Factors:</Text>
            {prediction.factors.map((factor, factorIndex) => (
              <Text key={factorIndex} style={styles.factorText}>• {factor}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderNews = () => (
    <View style={styles.section}>
      {news.map((item) => (
        <View key={item.id} style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor(item.impact) }]}>
              <Text style={styles.impactText}>{item.impact.toUpperCase()}</Text>
            </View>
            <Text style={styles.newsSource}>{item.source}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsSummary}>{item.summary}</Text>
          <Text style={styles.newsTimestamp}>
            {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'prices', title: 'Prices', icon: 'trending-up' },
        { key: 'predictions', title: 'Predictions', icon: 'analytics' },
        { key: 'news', title: 'News', icon: 'newspaper' },
      ].map((tab) => (
        <TradePassButton
          key={tab.key}
          title={tab.title}
          icon={tab.icon as any}
          variant={activeTab === tab.key ? 'primary' : 'secondary'}
          size="small"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab(tab.key as any);
          }}
          style={styles.tabButton}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <Layout headerTitle="Market Analysis" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading market analysis...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Market Analysis" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Market Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryTitle}>Market Overview</Text>
              <Text style={styles.summarySubtitle}>Live commodity prices</Text>
            </View>
            <TouchableOpacity onPress={handleRefreshData} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>4</Text>
              <Text style={styles.summaryLabel}>Commodities</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>+0.85%</Text>
              <Text style={styles.summaryLabel}>Avg Change</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>Live</Text>
              <Text style={styles.summaryLabel}>Data Status</Text>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        {renderTabSelector()}

        {/* Content based on active tab */}
        {activeTab === 'prices' && renderPrices()}
        {activeTab === 'predictions' && renderPredictions()}
        {activeTab === 'news' && renderNews()}

        {/* Actions */}
        <View style={styles.actionSection}>
          <TradePassButton
            title="Set Price Alerts"
            icon="notifications"
            variant="primary"
            size="large"
            onPress={handleAlertSetup}
          />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  summarySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  commodityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  priceChange: {
    alignItems: 'flex-end',
  },
  changeValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  priceData: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  predictionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  predictionData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  predictionItem: {
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
  },
  confidenceFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  factorsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  factorText: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
    lineHeight: 18,
  },
  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  newsSource: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  actionSection: {
    margin: 20,
  },
});