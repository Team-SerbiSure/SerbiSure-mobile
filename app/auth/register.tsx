import { Picker } from '@react-native-picker/picker';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card, Input } from '../../components/CommonUI';
import { auth, db } from '../../constants/firebase';
import { Theme } from '../../constants/theme';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Homeowner');
    const [skill, setSkill] = useState('Plumbing');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || (role === 'Service Worker' && !skill)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            const isWorker = role === 'Service Worker';
            const profileData = {
                name,
                role: isWorker ? "worker" : "homeowner",
                skills: isWorker ? skill : "",
                isWorkerOnboarded: isWorker,
                workerProfile: isWorker ? { skills: [skill] } : null
            };

            await setDoc(doc(db, "users", userCredential.user.uid), profileData);

            Alert.alert('Success', `Welcome to SerbiSure, ${name}!`);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>SerbiSure</Text>
                    <Text style={styles.subtitle}>Mobile</Text>
                </View>

                <Card style={styles.card}>
                    <Text style={styles.formTitle}>Register</Text>
                    <Text style={styles.formSubtitle}>Create your account</Text>

                    <Input
                        label="Full Name"
                        placeholder="Juana Dela Cruz"
                        value={name}
                        onChangeText={setName}
                    />

                    <Input
                        label="Email"
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <View style={styles.pickerRow}>
                        <Text style={styles.label}>I am a...</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={role}
                                onValueChange={(itemValue) => setRole(itemValue)}
                                style={styles.picker}
                                dropdownIconColor={Theme.colors.text}
                            >
                                <Picker.Item label="Homeowner" value="Homeowner" color={Theme.colors.accent} />
                                <Picker.Item label="Service Worker" value="Service Worker" color={Theme.colors.accent} />
                            </Picker>
                        </View>
                    </View>

                    {role === 'Service Worker' && (
                        <View style={styles.pickerRow}>
                            <Text style={styles.label}>Primary Skill</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={skill}
                                    onValueChange={(itemValue) => setSkill(itemValue)}
                                    style={styles.picker}
                                    dropdownIconColor={Theme.colors.text}
                                >
                                    {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Babysitting', 'Pet Care', 'General Help'].map(cat => (
                                        <Picker.Item key={cat} label={cat} value={cat} color={Theme.colors.accent} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Button
                        title={loading ? "Registering..." : "Register"}
                        onPress={handleRegister}
                        disabled={loading}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/auth/login" asChild>
                            <Text style={styles.linkText}>Log in here</Text>
                        </Link>
                    </View>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.bg1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Theme.colors.bg1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: Theme.colors.accent,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: Theme.colors.textMuted,
        fontWeight: '500',
    },
    card: {
        width: '100%',
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
        color: Theme.colors.muted,
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: Theme.colors.muted,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    pickerRow: {
        marginBottom: 16,
    },
    pickerWrapper: {
        backgroundColor: Theme.colors.inputBg,
        borderColor: Theme.colors.inputBorder,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        color: Theme.colors.text,
        height: 50,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: Theme.colors.textMuted,
        fontSize: 14,
    },
    linkText: {
        color: Theme.colors.accent,
        fontWeight: '600',
        fontSize: 14,
    }
});
