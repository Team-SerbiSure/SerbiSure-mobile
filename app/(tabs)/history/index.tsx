import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../../components/CommonUI';
import { Badge } from '../../../components/StatusUI';
import { Theme } from '../../../constants/theme';

// Mock Data matching screenshot exactly
const MOCK_HISTORY = [
    { id: '1', title: 'Kitchen Pipe Repair', category: 'Plumbing', worker: 'Marcus J.', date: 'Feb 20, 2026', stars: 5, status: 'Completed' },
    { id: '2', title: 'Wooden Deck Repair', category: 'Carpentry', worker: 'You', date: 'Mar 01, 2026', stars: 5, status: 'Completed' },
    { id: '3', title: 'Living Room Rewiring', category: 'Electrical', worker: 'Mario Rossi', date: 'Feb 15, 2026', stars: 4, status: 'Completed' },
    { id: '4', title: 'Bathroom Deep Clean', category: 'Cleaning', worker: 'Maria Clara', date: 'Feb 10, 2026', stars: 5, status: 'Completed' },
    { id: '5', title: 'Fixture Installation', category: 'Electrical', worker: 'Juana Dela Cruz', date: 'Feb 5, 2026', stars: 0, status: 'Cancelled' },
];

export default function HistoryScreen() {
    const [activeTab, setActiveTab] = useState('All');
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Service History</Text>
                <Text style={styles.subtitle}>View your past bookings and completed services</Text>
            </View>

            <View style={styles.summaryStats}>
                <Card style={styles.statCard}>
                    <Text style={styles.statScore}>6</Text>
                    <Text style={styles.statLabel}>TOTAL BOOKINGS</Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statScore}>5</Text>
                    <Text style={styles.statLabel}>COMPLETED</Text>
                </Card>
            </View>

            <View style={styles.tabsWrapper}>
                <View style={styles.statusTabs}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setActiveTab('All')}
                        style={[styles.tabBtn, activeTab === 'All' && styles.tabBtnActive]}
                    >
                        <Text style={[styles.tabBtnText, activeTab === 'All' && styles.tabBtnTextActive]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setActiveTab('Completed')}
                        style={[styles.tabBtn, activeTab === 'Completed' && styles.tabBtnActive]}
                    >
                        <Text style={[styles.tabBtnText, activeTab === 'Completed' && styles.tabBtnTextActive]}>Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setActiveTab('Cancelled')}
                        style={[styles.tabBtn, activeTab === 'Cancelled' && styles.tabBtnActive]}
                    >
                        <Text style={[styles.tabBtnText, activeTab === 'Cancelled' && styles.tabBtnTextActive]}>Cancelled</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.list}>
                {MOCK_HISTORY.map(item => (
                    <Card key={item.id} style={styles.historyCard}>
                        <View style={styles.reqTop}>
                            <View style={styles.iconBox}>
                                <Text style={styles.iconSymbol}>🔧</Text>
                            </View>
                            <View style={styles.infoCol}>
                                <View style={styles.reqTitleRow}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <View style={styles.reqStatus}>
                                        <Badge type={(item.status === 'Completed' ? 'primary' : 'outline') as any} text={item.status} />
                                    </View>
                                </View>
                                <Text style={styles.itemCategory}>{item.category} • {item.worker}</Text>
                                <View style={styles.reqDetailsRow}>
                                    <Text style={styles.itemMeta}>📅 {item.date}</Text>
                                    {item.stars > 0 ? (
                                        <Text style={styles.ratingStars}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</Text>
                                    ) : (
                                        <Text style={styles.noRating}>No rating</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: Theme.colors.textMuted,
    },
    summaryStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 24,
    },
    statScore: {
        fontSize: 32,
        fontWeight: '700',
        color: Theme.colors.accent,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Theme.colors.textMuted,
        letterSpacing: 1,
    },
    tabsWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    statusTabs: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.inputBg,
        borderRadius: 12,
        padding: 4,
        gap: 4,
        width: '100%',
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBtnActive: {
        backgroundColor: Theme.colors.cardBg,
        borderWidth: 1,
        borderColor: Theme.colors.cardBorder,
    },
    tabBtnText: {
        color: Theme.colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    tabBtnTextActive: {
        color: Theme.colors.text,
    },
    list: {
        marginBottom: 40,
    },
    historyCard: {
        padding: 0,
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 16,
    },
    reqTop: {
        flexDirection: 'row',
        padding: 20,
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconSymbol: {
        fontSize: 20,
    },
    infoCol: {
        flex: 1,
    },
    reqTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
        gap: 8,
    },
    itemTitle: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
    },
    reqStatus: {
        flexShrink: 0,
    },
    itemCategory: {
        color: Theme.colors.textMuted,
        fontSize: 13,
        marginBottom: 8,
    },
    reqDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemMeta: {
        color: Theme.colors.textMuted,
        fontSize: 12,
    },
    ratingStars: {
        color: Theme.colors.accent,
        fontSize: 14,
        letterSpacing: 2,
    },
    noRating: {
        color: Theme.colors.textMuted,
        fontSize: 12,
    }
});
