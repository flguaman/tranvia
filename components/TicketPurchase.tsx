import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { CreditCard, Ticket, MapPin, Clock, X, Plus, Minus } from 'lucide-react-native';

interface TicketOption {
  id: string;
  name: string;
  price: number;
  description: string;
  validity: string;
  color: string;
}

interface TicketPurchaseProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (ticket: TicketOption, quantity: number) => void;
}

export default function TicketPurchase({ visible, onClose, onPurchase }: TicketPurchaseProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const ticketOptions: TicketOption[] = [
    {
      id: 'single',
      name: 'Viaje Sencillo',
      price: 0.35,
      description: 'Un viaje en cualquier ruta del tranvía',
      validity: 'Válido por 2 horas',
      color: '#8B0000',
    },
    {
      id: 'daily',
      name: 'Pase Diario',
      price: 2.50,
      description: 'Viajes ilimitados durante todo el día',
      validity: 'Válido hasta las 23:59',
      color: '#228B22',
    },
    {
      id: 'weekly',
      name: 'Pase Semanal',
      price: 15.00,
      description: 'Viajes ilimitados durante 7 días',
      validity: 'Válido por 7 días consecutivos',
      color: '#FF8C00',
    },
    {
      id: 'monthly',
      name: 'Pase Mensual',
      price: 50.00,
      description: 'Viajes ilimitados durante 30 días',
      validity: 'Válido por 30 días consecutivos',
      color: '#9932CC',
    },
    {
      id: 'student',
      name: 'Pase Estudiantil',
      price: 25.00,
      description: 'Pase mensual con descuento para estudiantes',
      validity: 'Válido por 30 días - Requiere ID estudiantil',
      color: '#17A2B8',
    },
  ];

  const handlePurchase = () => {
    const ticket = ticketOptions.find(t => t.id === selectedTicket);
    if (ticket) {
      Alert.alert(
        'Confirmar Compra',
        `¿Deseas comprar ${quantity} ${ticket.name}(s) por $${(ticket.price * quantity).toFixed(2)}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Comprar', 
            onPress: () => {
              onPurchase(ticket, quantity);
              onClose();
              Alert.alert('¡Compra Exitosa!', 'Tu ticket ha sido agregado a tu billetera digital.');
            }
          }
        ]
      );
    }
  };

  const selectedTicketData = ticketOptions.find(t => t.id === selectedTicket);
  const total = selectedTicketData ? selectedTicketData.price * quantity : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ticket size={24} color="#8B0000" />
            <Text style={styles.title}>Comprar Tickets</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#8B0000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Selecciona tu ticket</Text>
          
          {ticketOptions.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[
                styles.ticketCard,
                selectedTicket === ticket.id && styles.selectedTicketCard
              ]}
              onPress={() => setSelectedTicket(ticket.id)}
            >
              <View style={styles.ticketHeader}>
                <View style={[styles.ticketIcon, { backgroundColor: `${ticket.color}20` }]}>
                  <Ticket size={24} color={ticket.color} />
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketName}>{ticket.name}</Text>
                  <Text style={styles.ticketDescription}>{ticket.description}</Text>
                  <View style={styles.ticketDetails}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.ticketValidity}>{ticket.validity}</Text>
                  </View>
                </View>
                <View style={styles.ticketPrice}>
                  <Text style={styles.priceText}>${ticket.price.toFixed(2)}</Text>
                </View>
              </View>
              {selectedTicket === ticket.id && (
                <View style={styles.selectedIndicator}>
                  <View style={[styles.selectedDot, { backgroundColor: ticket.color }]} />
                </View>
              )}
            </TouchableOpacity>
          ))}

          {selectedTicket && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Cantidad</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={20} color={quantity <= 1 ? "#CCC" : "#8B0000"} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity >= 10 && styles.quantityButtonDisabled]}
                  onPress={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  <Plus size={20} color={quantity >= 10 ? "#CCC" : "#8B0000"} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedTicket && (
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Resumen de Compra</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ticket:</Text>
                  <Text style={styles.summaryValue}>{selectedTicketData?.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Cantidad:</Text>
                  <Text style={styles.summaryValue}>{quantity}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Precio unitario:</Text>
                  <Text style={styles.summaryValue}>${selectedTicketData?.price.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.paymentInfo}>
            <CreditCard size={20} color="#8B0000" />
            <Text style={styles.paymentText}>
              El pago se realizará con tu método de pago predeterminado
            </Text>
          </View>
        </ScrollView>

        {selectedTicket && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.purchaseButtonText}>
                Comprar por ${total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginTop: 24,
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    position: 'relative',
  },
  selectedTicketCard: {
    borderColor: '#8B0000',
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  ticketDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketValidity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  ticketPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B0000',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quantitySection: {
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F1F3F4',
  },
  quantityText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginHorizontal: 24,
  },
  summarySection: {
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#8B0000',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  paymentText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    borderRadius: 12,
    paddingVertical: 16,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});