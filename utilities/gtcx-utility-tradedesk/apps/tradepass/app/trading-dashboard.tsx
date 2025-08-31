// ============================================================================
// TRADEPASS™ TRADING DASHBOARD - REAL-TIME MINING TRADE INTERFACE
// Professional trading interface for verified mining operations
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TradePassButton } from '../src/components/ui/TradePassButton';
import { Layout } from '../src/components/Layout';

interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  commodity: 'gold' | 'silver' | 'copper' | 'diamond';
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

interface MarketData {
  commodity: string;
  currentPrice: number;
  change24h: number;
  volume24h: number;
  lastUpdated: number;
}

export default function TradingDashboard() {
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'market' | 'history'>('orders');

  useEffect(() => {
    loadTradingData();
  }, []);

  const loadTradingData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading real trading data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock market data
      const mockMarketData: MarketData[] = [
        {
          commodity: 'Gold',
          currentPrice: 2045.50,
          change24h: 1.2,
          volume24h: 125000,
          lastUpdated: Date.now(),
        },
        {
          commodity: 'Silver',
          currentPrice: 24.85,
          change24h: -0.8,
          volume24h: 89000,
          lastUpdated: Date.now(),
        },
        {
          commodity: 'Copper',
          currentPrice: 8.45,
          change24h: 2.1,
          volume24h: 156000,
          lastUpdated: Date.now(),
        },
      ];

      // Mock orders
      const mockOrders: TradeOrder[] = [
        {
          id: 'order-001',
          type: 'sell',
          commodity: 'gold',
          quantity: 15.5,
          pricePerUnit: 2040.00,
          totalValue: 31620.00,
          status: 'pending',
          timestamp: Date.now() - 3600000,
          location: { latitude: 5.6037, longitude: -0.1870, accuracy: 3.2 }
        },
        {
          id: 'order-002',
          type: 'buy',
          commodity: 'silver',
          quantity: 50.0,
          pricePerUnit: 24.80,
          totalValue: 1240.00,
          status: 'completed',
          timestamp: Date.now() - 7200000,
          location: { latitude: 5.6037, longitude: -0.1870, accuracy: 2.8 }
        },
      ];

      setMarketData(mockMarketData);
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load trading data:', error);
      Alert.alert('Error', 'Failed to load trading dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'New Trade',
      'Choose trade type:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Order', onPress: () => Alert.alert('Buy Order', 'Buy order creation coming soon') },
        { text: 'Sell Order', onPress: () => Alert.alert('Sell Order', 'Sell order creation coming soon') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#8E8E93';
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const renderMarketData = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Market Overview</Text>
      {marketData.map((market, index) => (
        <View key={index} style={styles.marketCard}>
          <View style={styles.marketRow}>
            <Text style={styles.commodityName}>{market.commodity}</Text>
            <Text style={styles.commodityPrice}>{formatCurrency(market.currentPrice)}</Text>
          </View>
          <View style={styles.marketRow}>
            <Text style={[styles.changeText, { color: market.change24h >= 0 ? '#22c55e' : '#ef4444' }]}>
              {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(1)}%
            </Text>
            <Text style={styles.volumeText}>Vol: {market.volume24h.toLocaleString()}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrders = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Active Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="analytics-outline" size={48} color="#8E8E93" />
          <Text style={styles.emptyStateTitle}>No Active Orders</Text>
          <Text style={styles.emptyStateText}>Create your first trade to get started</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={[styles.orderType, { backgroundColor: order.type === 'buy' ? '#34C759' : '#FF3B30' }]}>
                <Text style={styles.orderTypeText}>{order.type.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.commodityText}>{order.commodity.toUpperCase()}</Text>
              <Text style={styles.quantityText}>{order.quantity} oz</Text>
              <Text style={styles.priceText}>{formatCurrency(order.totalValue)}</Text>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.timestampText}>
                {new Date(order.timestamp).toLocaleDateString()} • 
                Accuracy: ±{order.location.accuracy.toFixed(1)}m
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'orders', title: 'Orders', icon: 'list' },
        { key: 'market', title: 'Market', icon: 'trending-up' },
        { key: 'history', title: 'History', icon: 'time' },
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
      <Layout headerTitle="Trading Dashboard" showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading market data...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout headerTitle="Trading Dashboard" showBackButton={true}>
      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatCurrency(32860)}</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98.5%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        {renderTabSelector()}

        {/* Content based on active tab */}
        {activeTab === 'market' && renderMarketData()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'history' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trade History</Text>
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#8E8E93" />
              <Text style={styles.emptyStateTitle}>Trade History</Text>
              <Text style={styles.emptyStateText}>Your completed trades will appear here</Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TradePassButton
            title="Create New Trade"
            icon="add-circle"
            variant="primary"
            size="large"
            onPress={handleNewTrade}
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
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 0.35,
  },
  marketCard: {
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
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commodityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  commodityPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  volumeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commodityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 8,
  },
  timestampText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionSection: {
    margin: 20,
  },
});