import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, CreditCard, Plus, History, QrCode, Ticket, ArrowUpRight, ArrowDownLeft, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import QRCodeScanner from '@/components/QRCodeScanner';
import TicketPurchase from '@/components/TicketPurchase';

export default function WalletScreen() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showTicketPurchase, setShowTicketPurchase] = useState(false);
  const [balance, setBalance] = useState(12.50);

  const recentTransactions = [
    {
      id: '1',
      type: 'payment',
      description: 'Viaje: El Arenal → Pumapungo',
      amount: -0.35,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '2',
      type: 'recharge',
      description: 'Recarga de saldo',
      amount: 10.00,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '3',
      type: 'payment',
      description: 'Viaje: El Ejido → Feria Libre',
      amount: -0.35,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '4',
      type: 'purchase',
      description: 'Pase Diario',
      amount: -2.50,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed',
    },
  ];

  const activeTickets = [
    {
      id: '1',
      name: 'Pase Diario',
      validUntil: new Date(Date.now() + 8 * 60 * 60 * 1000),
      usesRemaining: 'Ilimitado',
      color: '#228B22',
    },
    {
      id: '2',
      name: 'Viaje Sencillo',
      validUntil: new Date(Date.now() + 90 * 60 * 1000),
      usesRemaining: '1 uso',
      color: '#8B0000',
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      title: 'Recargar',
      subtitle: 'Agregar saldo',
      action: () => Alert.alert('Recarga', 'Función de recarga próximamente'),
      color: '#228B22',
    },
    {
      icon: Ticket,
      title: 'Comprar Tickets',
      subtitle: 'Pases y viajes',
      action: () => setShowTicketPurchase(true),
      color: '#8B0000',
    },
    {
      icon: QrCode,
      title: 'Escanear QR',
      subtitle: 'Pagar con código',
      action: () => setShowQRScanner(true),
      color: '#FF8C00',
    },
    {
      icon: History,
      title: 'Historial',
      subtitle: 'Ver movimientos',
      action: () => Alert.alert('Historial', 'Ver historial completo'),
      color: '#9932CC',
    },
  ];

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `Hace ${minutes} min`;
    } else if (hours < 24) {
      return `Hace ${hours}h`;
    } else {
      return `Hace ${days}d`;
    }
  };

  const formatValidUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m restantes`;
    } else {
      return `${minutes}m restantes`;
    }
  };

  const handleQRScan = (data: string) => {
    setShowQRScanner(false);
    Alert.alert('QR Escaneado', `Código: ${data}`);
  };

  const handleTicketPurchase = (ticket: any, quantity: number) => {
    const total = ticket.price * quantity;
    if (balance >= total) {
      setBalance(prev => prev - total);
      Alert.alert('¡Compra exitosa!', `Has comprado ${quantity} ${ticket.name}(s)`);
    } else {
      Alert.alert('Saldo insuficiente', 'No tienes suficiente saldo para esta compra');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient
          colors={['#8B0000', '#A52A2A']}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Wallet size={32} color="#FFD700" />
            <Text style={styles.balanceTitle}>Mi Billetera</Text>
          </View>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <Text style={styles.balanceSubtitle}>Saldo disponible</Text>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceButton}>
              <Plus size={20} color="#8B0000" />
              <Text style={styles.balanceButtonText}>Recargar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.balanceButton}
              onPress={() => setShowQRScanner(true)}
            >
              <QrCode size={20} color="#8B0000" />
              <Text style={styles.balanceButtonText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Tickets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tickets Activos</Text>
          {activeTickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={[styles.ticketIcon, { backgroundColor: `${ticket.color}20` }]}>
                  <Ticket size={20} color={ticket.color} />
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketName}>{ticket.name}</Text>
                  <Text style={styles.ticketUses}>{ticket.usesRemaining}</Text>
                </View>
                <View style={styles.ticketStatus}>
                  <CheckCircle size={16} color="#28A745" />
                  <Text style={styles.ticketStatusText}>Activo</Text>
                </View>
              </View>
              <View style={styles.ticketFooter}>
                <Clock size={14} color="#666" />
                <Text style={styles.ticketValidity}>
                  {formatValidUntil(ticket.validUntil)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Movimientos Recientes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionIcon}>
                  {transaction.type === 'payment' ? (
                    <ArrowUpRight size={20} color="#DC3545" />
                  ) : transaction.type === 'recharge' ? (
                    <ArrowDownLeft size={20} color="#28A745" />
                  ) : (
                    <Ticket size={20} color="#8B0000" />
                  )}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {formatTime(transaction.timestamp)}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <QRCodeScanner
        visible={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
        title="Escanear para Pagar"
      />

      <TicketPurchase
        visible={showTicketPurchase}
        onClose={() => setShowTicketPurchase(false)}
        onPurchase={handleTicketPurchase}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  balanceCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
    justifyContent: 'center',
  },
  balanceButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 2,
  },
  ticketUses: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  ticketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#28A745',
    marginLeft: 4,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketValidity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  transactionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  positiveAmount: {
    color: '#28A745',
  },
  negativeAmount: {
    color: '#DC3545',
  },
});