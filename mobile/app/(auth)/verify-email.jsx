import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

import { API_BASE_URL } from '../../config';

const { width } = Dimensions.get('window');

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Input refs for auto-focus
  const inputRefs = useRef([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // Background animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Background animations
    const createAnimation = (value, duration, delay) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, { toValue: 1, duration, useNativeDriver: true }),
            Animated.timing(value, { toValue: 0, duration, useNativeDriver: true }),
          ])
        ),
      ]);
    };
    createAnimation(floatAnim1, 3500, 0).start();
    createAnimation(floatAnim2, 4000, 1000).start();
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!fontsLoaded) {
    return null;
  }

  const handleCodeChange = (value, index) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Incomplete Code', 'Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Make API call to verify the code
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store the token (you might want to use secure storage for this)
        // For now, we'll just navigate to the create story page
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Email verified successfully!');
        router.push('/create-story');
      } else {
        // Show error message
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Verification Failed', data.error || 'Invalid or expired verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setCountdown(60);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      // Make API call to resend verification code
      const response = await fetch('http://localhost:3000/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Code Sent!', 'A new verification code has been sent to your email.');
      } else {
        Alert.alert('Error', data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
    
    // Restart countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  // Interpolate animations
  const float1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15]
  });
  
  const float2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12]
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background elements */}
      <Animated.View style={[styles.backgroundShape, styles.shape1, {
        transform: [{ translateY: float1 }]
      }]} />
      <Animated.View style={[styles.backgroundShape, styles.shape2, {
        transform: [{ translateY: float2 }]
      }]} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6A5ACD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Email</Text>
          <View style={styles.placeholder} />
        </Animated.View>
        
        {/* Main Content */}
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim, 
              transform: [
                { translateY: slideAnim },
                { translateX: shakeAnim }
              ] 
            }
          ]}
        >
          {/* Icon and Title */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="mail" size={40} color="#6A5ACD" />
            </View>
          </View>
          
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to your email address. Enter it below to continue.
          </Text>
          
          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit !== '' && styles.codeInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>
          
          {/* Verify Button */}
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              code.join('').length !== 6 && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={isLoading || code.join('').length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.verifyButtonText}>Verify Code</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
          
          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={!canResend}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.resendButton,
                !canResend && styles.resendButtonDisabled
              ]}>
                {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#999" />
            <Text style={styles.helpText}>
              Check your spam folder if you don't see the email
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  keyboardView: {
    flex: 1,
  },
  // Background elements
  backgroundShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.08,
    zIndex: -1,
  },
  shape1: {
    width: 160,
    height: 160,
    backgroundColor: '#6A5ACD',
    top: -80,
    right: -50,
  },
  shape2: {
    width: 120,
    height: 120,
    backgroundColor: '#FF6B6B',
    bottom: 100,
    left: -40,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#4A4A4A',
  },
  placeholder: {
    width: 40,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  // Code Input
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#E6E6FA',
    borderRadius: 12,
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#4A4A4A',
    backgroundColor: '#F8F9FF',
    marginHorizontal: 4,
  },
  codeInputFilled: {
    borderColor: '#6A5ACD',
    backgroundColor: '#F0F0FF',
  },
  // Verify Button
  verifyButton: {
    backgroundColor: '#6A5ACD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minWidth: width * 0.6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFF',
    marginRight: 8,
  },
  // Resend Section
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#6A5ACD',
  },
  resendButtonDisabled: {
    color: '#999',
  },
  // Help Section
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999',
    marginLeft: 6,
    textAlign: 'center',
    lineHeight: 16,
  },
});