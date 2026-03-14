import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../constants/theme';

// --- Badge Component ---
interface BadgeProps {
    text: string;
    type?: 'primary' | 'success' | 'pending' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ text, type = 'primary' }) => {
    return (
        <View style={[
            styles.badge,
            type === 'primary' && styles.badge_primary,
            type === 'success' && styles.badge_success,
            type === 'pending' && styles.badge_pending
        ]}>
            <Text style={[
                styles.badgeText,
                type === 'primary' && styles.badgeText_primary,
                type === 'success' && styles.badgeText_success,
                type === 'pending' && styles.badgeText_pending
            ]}>{text}</Text>
        </View>
    );
};

// --- StatusIndicator Component ---
interface StatusProps {
    status: 'online' | 'offline' | 'pending';
}

export const StatusIndicator: React.FC<StatusProps> = ({ status }) => (
    <View style={styles.statusContainer}>
        <View style={[styles.statusDot, styles[`dot_${status}` as keyof typeof styles] as any]} />
        <Text style={styles.statusText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
    </View>
);

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 14, // Match .system-status-badge padding 6px 14px
        paddingVertical: 6,
        borderRadius: 20, // Match .system-status-badge
        alignSelf: 'flex-start',
        borderWidth: 1, // Web badge has border
    },
    badge_primary: {
        backgroundColor: 'rgba(99, 140, 255, 0.15)',
        borderColor: 'rgba(99, 140, 255, 0.25)',
    },
    badge_outline: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    badge_success: {
        backgroundColor: 'rgba(76, 209, 55, 0.15)',
        borderColor: 'rgba(76, 209, 55, 0.25)',
    },
    badge_pending: {
        backgroundColor: Theme.colors.statusPending,
        // Using accent as default fallback for pending border since statusPendingBorder isn't in Theme yet
        borderColor: Theme.colors.accent,
    },
    badgeText: {
        fontSize: 12, // Match .system-status-badge
        fontWeight: '600',
    },
    badgeText_primary: { color: Theme.colors.accent },
    badgeText_outline: { color: Theme.colors.textMuted },
    badgeText_success: { color: Theme.colors.success },
    badgeText_pending: { color: Theme.colors.statusPendingText },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    dot_online: { backgroundColor: Theme.colors.success },
    dot_offline: { backgroundColor: Theme.colors.muted },
    dot_pending: { backgroundColor: Theme.colors.statusPendingText },
    statusText: {
        color: Theme.colors.textMuted,
        fontSize: 13,
    }
});
