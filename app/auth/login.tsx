import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card, Input } from '../../components/CommonUI';
import AppModal from '../../components/Modal';
import { auth, db } from '../../constants/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoginScreen() {
    const { colors } = useTheme();
    const { setManualAuthActive } = useAuth();
    const styles = createStyles(colors);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Homeowner');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    const openModal = (title: string, message: string) => {
        setModal({ visible: true, title, message });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, visible: false }));
    };

    const handleLogin = async () => {
        if (!email || !password) {
            openModal('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        setManualAuthActive(true); // Prevent _layout.tsx from auto-redirecting
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const isWorkerSelection = role === 'Service Worker';
            const expectedRole = isWorkerSelection ? 'worker' : 'homeowner';

            // Fetch Firestore profile and validate role
            const docRef = doc(db, 'users', userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // No profile found — block access natively and then sign out safely
                openModal('Account Error', 'No account profile found. Please register first.');
                await auth.signOut();
                setLoading(false);
                setManualAuthActive(false);
                return;
            }

            const actualRole: string = docSnap.data().role;

            if (actualRole !== expectedRole) {
                // Role mismatch — block access natively and then sign out safely
                const registeredAs = actualRole === 'worker' ? 'Service Worker' : 'Homeowner';
                const selectedAs = isWorkerSelection ? 'Service Worker' : 'Homeowner';
                
                openModal(
                    'Wrong Role Selected',
                    `You selected "${selectedAs}" but this account is registered as a "${registeredAs}". Please choose the correct role and try again.`
                );
                await auth.signOut();
                setLoading(false);
                setManualAuthActive(false);
                return;
            }

            // Validation passed! Allow router to navigate explicitly
            setManualAuthActive(false);
            router.replace('/(tabs)');
        } catch (error: any) {
            openModal('Login Failed', error.message);
            setManualAuthActive(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <AppModal
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                onClose={closeModal}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>SerbiSure</Text>
                    <Text style={styles.subtitle}>Mobile</Text>
                </View>

                <Card style={styles.card}>
                    <Text style={styles.formTitle}>Login</Text>
                    <Text style={styles.formSubtitle}>Access your account</Text>

                    <Input
                        label="Email"
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <View style={styles.pickerRow}>
                        <Text style={styles.label}>Login As</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={role}
                                onValueChange={(itemValue) => setRole(itemValue)}
                                style={styles.picker}
                                dropdownIconColor={colors.text}
                            >
                                <Picker.Item label="Homeowner" value="Homeowner" color={colors.accent} />
                                <Picker.Item label="Service Worker" value="Service Worker" color={colors.accent} />
                            </Picker>
                        </View>
                    </View>

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title={loading ? "Signing in..." : "Log In"}
                        onPress={handleLogin}
                        disabled={loading}
                        style={styles.loginBtn}
                    />

                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <Button
                        title="Create New Account"
                        type="outline"
                        onPress={() => router.push('/auth/register')}
                        disabled={loading}
                    />
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const createStyles = (colors: typeof import('../../constants/theme').DarkColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: colors.bg1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.accent,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: colors.textMuted,
        fontWeight: '500',
    },
    card: {
        width: '100%',
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
        color: colors.muted,
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.muted,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    pickerRow: {
        marginBottom: 16,
    },
    pickerWrapper: {
        backgroundColor: colors.inputBg,
        borderColor: colors.inputBorder,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        color: colors.text,
        height: 50,
    },
    loginBtn: {
        marginBottom: 16,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.cardBorder,
    },
    dividerText: {
        color: colors.muted,
        paddingHorizontal: 16,
        fontSize: 12,
        fontWeight: '700',
    },
    footerText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    linkText: {
        color: colors.accent,
        fontWeight: '600',
        fontSize: 14,
    }
});
