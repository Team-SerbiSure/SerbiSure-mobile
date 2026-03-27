import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/CommonUI';
import AppModal from '../../components/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingsContext';
import { useRequests } from '../../contexts/RequestsContext';
import { useApplications } from '../../contexts/ApplicationsContext';
import { REVIEWS } from '../../data/reviews';

// Mock Data
const MOCK_STATS = [
  { id: '1', label: 'Profile Views', value: '124' },
  { id: '2', label: 'Rating', value: '4.9', suffix: '' },
  { id: '3', label: 'Jobs Done', value: '34' },
  { id: '4', label: 'Response', value: '98%' },
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bookings } = useBookings();
  const { requests } = useRequests();
  const { applications } = useApplications();
  const [isOnline, setIsOnline] = useState(true);
  const [modal, setModal] = useState<{ visible: boolean; title: string; message: string }>({ visible: false, title: '', message: '' });
  const insets = useSafeAreaInsets();

  const openModal = (title: string, message: string) => setModal({ visible: true, title, message });
  const closeModal = () => setModal(prev => ({ ...prev, visible: false }));

  const workerName = user?.name || 'Worker';
  const openRequests = requests.filter(r => r.status === 'Open');
  const appliedRequestIds = applications.filter(a => a.workerName === workerName).map(a => a.requestId);
  const incomingCount = openRequests.filter(r => !appliedRequestIds.includes(r.id)).length;
  const hasMatch = workerName ? bookings.some(b => b.workerName === workerName) : false;
  const assignedBookings = hasMatch ? bookings.filter(b => b.workerName === workerName) : bookings;
  const activeJobsCount = assignedBookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = assignedBookings.filter(b => b.status === 'Completed').length;

  if (user?.role === 'homeowner') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}>
      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />

      {/* ===== HEADER BAR ===== */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.headerTitle}>SerbiSure</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.statusPill, isOnline ? styles.statusOnline : styles.statusOffline]}
            activeOpacity={0.7}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={[styles.statusPillText, isOnline ? styles.textOnline : styles.textOffline]}>
              {isOnline ? 'Available' : 'Offline'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notifBtn}
            activeOpacity={0.7}
            onPress={() => openModal('Notifications', 'No new notifications at this time.')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== GREETING SECTION ===== */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingLabel}>WORKER PORTAL</Text>
        <Text style={styles.greetingName}>Hello, {user?.name?.split(' ')[0] || 'Linda'}!</Text>
        <Text style={styles.greetingSubtitle}>Here's what's happening today.</Text>
      </View>

      {/* ===== STATS ROW (Horizontal Scroll) ===== */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsScrollContent}>
        {MOCK_STATS.map(stat => (
          <View key={stat.id} style={styles.statCard}>
            <View style={styles.statValRow}>
              <Text style={styles.statVal}>{stat.value}</Text>
              {stat.suffix ? <Text style={styles.statSuffix}>{stat.suffix}</Text> : null}
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ===== WORKFLOW OVERVIEW ===== */}
      <View style={styles.sectionArea}>
        <Text style={styles.sectionTitle}>Workflow Overview</Text>
        
        <View style={styles.gridContainer}>
          {/* Incoming */}
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>INCOMING</Text>
            <Text style={[styles.gridValue, { color: '#F6AD55' }]}>{incomingCount}</Text>
            <Text style={styles.gridHint}>New requests</Text>
            <Button title="View Requests" size="sm" type="primary" onPress={() => router.push('/(tabs)/bookings')} style={styles.gridBtn} textStyle={styles.gridBtnText} />
          </View>

          {/* Active Jobs */}
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>ACTIVE JOBS</Text>
            <Text style={[styles.gridValue, { color: '#4cd137' }]}>{activeJobsCount}</Text>
            <Text style={styles.gridHint}>In progress</Text>
            <Button title="Manage Jobs" size="sm" type="primary" onPress={() => router.push('/(tabs)/bookings')} style={styles.gridBtn} textStyle={styles.gridBtnText} />
          </View>

          {/* Applications */}
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>APPLICATIONS</Text>
            <Text style={[styles.gridValue, { color: colors.text }]}>{appliedRequestIds.length}</Text>
            <Text style={styles.gridHint}>Awaiting reply</Text>
            <Button title="Review" size="sm" type="secondary" onPress={() => router.push('/(tabs)/applications')} style={[styles.gridBtn, styles.gridBtnOutline]} textStyle={styles.gridBtnOutlineText} />
          </View>

          {/* Completed */}
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>COMPLETED</Text>
            <Text style={[styles.gridValue, { color: colors.text }]}>{completedCount}</Text>
            <Text style={styles.gridHint}>Full history</Text>
            <Button title="View History" size="sm" type="secondary" onPress={() => router.push('/(tabs)/history')} style={[styles.gridBtn, styles.gridBtnOutline]} textStyle={styles.gridBtnOutlineText} />
          </View>
        </View>
      </View>

      {/* ===== RECENT REVIEWS ===== */}
      <View style={styles.sectionArea}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)/reviews')}>
            <Text style={styles.viewLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {(REVIEWS || []).slice(0, 2).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <View style={styles.starsRow}>
                {Array(5).fill(0).map((_, i) => (
                  <Text key={i} style={styles.reviewStar}>★</Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewBody}>{review.body}</Text>
            <Text style={styles.reviewTime}>{review.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: typeof import('../../constants/theme').DarkColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg1,
  },
  
  // Header Bar
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBgSolid, // #1A1A2E
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  
  // Status Pill
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusOnline: {
    backgroundColor: 'rgba(76, 209, 55, 0.15)',
    borderColor: 'rgba(76, 209, 55, 0.25)',
  },
  statusOffline: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: colors.cardBorder,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotOnline: {
    backgroundColor: colors.success,
  },
  dotOffline: {
    backgroundColor: colors.textMuted,
  },
  statusPillText: {
    fontSize: 12,
    fontFamily: 'DMSans_600SemiBold',
    fontWeight: '700',
  },
  textOnline: {
    color: colors.success,
  },
  textOffline: {
    color: colors.textMuted,
  },

  // Greeting Area
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  greetingLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  greetingName: {
    color: colors.text,
    fontSize: 32,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },

  // Stats Scroll
  statsScroll: {
    marginBottom: 32,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 120,
    backgroundColor: colors.cardBgSolid, // #1A1A2E
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  statVal: {
    color: colors.text,
    fontSize: 24,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
  },
  statSuffix: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  statLabel: {
    color: '#656580', // the slightly darker purple-gray text from mockup
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },

  // Sections
  sectionArea: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
    marginBottom: 16,
  },
  viewLink: {
    color: colors.accent,
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
  },

  // 2x2 Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '47.5%',
    backgroundColor: colors.cardBgSolid, // #1A1A2E
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'flex-start',
  },
  gridLabel: {
    color: '#656580', // Matches the statLabel color from mockup
    fontSize: 11,
    fontFamily: 'DMSans_600SemiBold',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  gridValue: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk_700Bold',
    fontWeight: '700',
    marginBottom: 4,
  },
  gridHint: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    marginBottom: 16,
  },
  gridBtn: {
    width: '100%',
    borderRadius: 10,
    minHeight: 36,
    paddingVertical: 8,
  },
  gridBtnText: {
    fontSize: 12,
    fontFamily: 'DMSans_600SemiBold',
  },
  gridBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  gridBtnOutlineText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'DMSans_600SemiBold',
  },

  // Review Cards
  reviewCard: {
    backgroundColor: colors.cardBgSolid,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewName: {
    color: colors.text,
    fontSize: 15,
    fontFamily: 'DMSans_600SemiBold',
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewStar: {
    color: '#F6AD55', // gold star
    fontSize: 14,
  },
  reviewBody: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewTime: {
    color: '#656580',
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
});
