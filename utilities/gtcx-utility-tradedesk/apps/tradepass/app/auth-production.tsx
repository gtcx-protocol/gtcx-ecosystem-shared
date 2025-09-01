// ============================================================================
// 🚀 PRODUCTION AUTHENTICATION SCREEN - RAILS API INTEGRATION
// World-class authentication with intelligent session management
// ============================================================================

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { authService, LoginCredentials, RegisterData } from '../src/services/production-auth-service';
import { Layout } from '../src/components/Layout';

export default function ProductionAuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'miner',
    permitNumber: ''
  });

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      router.replace('/');
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.name || !formData.phone) {
        Alert.alert('Validation Error', 'Name and phone are required for registration');
        return false;
      }

      if (formData.role === 'miner' && !formData.permitNumber) {
        Alert.alert('Validation Error', 'Permit number is required for miners');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password
      };

      const response = await authService.login(credentials);
      
      console.log('🎉 Login successful:', response.user.name);
      
      // Navigate to main app
      router.replace('/');
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Error is already handled in authService
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const userData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        permitNumber: formData.permitNumber || undefined
      };

      const response = await authService.register(userData);
      
      console.log('🎉 Registration successful:', response.user.name);
      
      // Navigate to main app
      router.replace('/');
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      // Error is already handled in authService
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const toggleMode = async () => {
    await Haptics.selectionAsync();
    setIsLogin(!isLogin);
    // Clear sensitive fields when switching
    setFormData(prev => ({
      ...prev,
      password: ''
    }));
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="diamond" size={48} color="#1890ff" />
              <Text style={styles.appTitle}>GTCX</Text>
              <Text style={styles.appSubtitle}>Global Trust and Compliance eXchange</Text>
            </View>
            
            <Text style={styles.welcomeText}>
              {isLogin ? 'Welcome back' : 'Join the mining revolution'}
            </Text>
            <Text style={styles.subtitleText}>
              {isLogin 
                ? 'Sign in to access your mining operations' 
                : 'Create your account for Ghana\'s digital mining platform'
              }
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name field (registration only) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>
            )}

            {/* Email field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            {/* Password field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                placeholderTextColor="#8E8E93"
                secureTextEntry
                autoComplete="password"
                editable={!isLoading}
              />
            </View>

            {/* Phone field (registration only) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor="#8E8E93"
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            )}

            {/* Role selection (registration only) */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleContainer}>
                  {[
                    { key: 'miner', label: '⛏️ Miner', description: 'Mining operations' },
                    { key: 'trader', label: '💰 Trader', description: 'Gold trading' },
                    { key: 'government_official', label: '🏛️ Official', description: 'Government oversight' }
                  ].map((role) => (
                    <TouchableOpacity
                      key={role.key}
                      style={[
                        styles.roleOption,
                        formData.role === role.key && styles.roleOptionSelected
                      ]}
                      onPress={() => handleInputChange('role', role.key)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.roleLabel,
                        formData.role === role.key && styles.roleLabelSelected
                      ]}>
                        {role.label}
                      </Text>
                      <Text style={[
                        styles.roleDescription,
                        formData.role === role.key && styles.roleDescriptionSelected
                      ]}>
                        {role.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Permit number (for miners only) */}
            {!isLogin && formData.role === 'miner' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mining Permit Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.permitNumber}
                  onChangeText={(value) => handleInputChange('permitNumber', value)}
                  placeholder="Enter your permit number"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="characters"
                  editable={!isLoading}
                />
              </View>
            )}

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons 
                    name={isLogin ? "log-in" : "person-add"} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Toggle mode */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleMode}
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Powered by Rails 7 + Vue.js
            </Text>
            <Text style={styles.versionText}>
              GTCX v1.0 - Production Ready
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1890ff',
    marginTop: 10,
    letterSpacing: -0.41,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#2c3e50',
  },
  roleContainer: {
    gap: 12,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  roleOptionSelected: {
    borderColor: '#1890ff',
    backgroundColor: '#E6F7FF',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  roleLabelSelected: {
    color: '#1890ff',
  },
  roleDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  roleDescriptionSelected: {
    color: '#1890ff',
  },
  submitButton: {
    backgroundColor: '#1890ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 20,
    padding: 12,
  },
  toggleText: {
    fontSize: 16,
    color: '#1890ff',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});