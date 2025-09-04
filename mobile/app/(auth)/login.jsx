import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

const { width, height } = Dimensions.get('window'); 

import { API_BASE_URL } from '../../config'; 
console.log(API_BASE_URL);
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const verificationMessageAnim = useRef(new Animated.Value(0)).current;
  
  // Background animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Add the missing isValidEmail function
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    // Initial entrance animation
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Background floating animations
    const createFloatingAnimation = (value, duration, delay) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    };
    createFloatingAnimation(floatAnim1, 4000, 0).start();
    createFloatingAnimation(floatAnim2, 3500, 1000).start();
    createFloatingAnimation(floatAnim3, 4500, 500).start();
  }, []);
  if (!fontsLoaded) {
    return null;
  }
  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsGoogleLoading(true);
    
    // Simulate Google auth process
    setTimeout(() => {
      setIsGoogleLoading(false);
      // Navigate to create story page after successful Google auth
      router.push('/create-story');
    }, 2000);
  };
  const handleEmailSignIn = async () => {
  if (!email || !isValidEmail(email)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address');
    return;
  }
  
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  setIsEmailLoading(true);
  
  // Dismiss keyboard before showing verification message
  Keyboard.dismiss();
  
  try {
    // Make API call to send verification code
    const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
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
      // Show success message
      setShowVerificationMessage(true);
      
      // Animate verification message
      Animated.sequence([
        Animated.timing(verificationMessageAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(verificationMessageAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowVerificationMessage(false);
        // Navigate to verification page, passing the email as a parameter
        router.push({ 
          pathname: '/verify-email', 
          params: { email: email } 
        });
      });
    } else {
      // Show error message
      Alert.alert('Error', data.error || 'Failed to send verification code');
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    Alert.alert('Error', 'Network error. Please try again.');
  } finally {
    setIsEmailLoading(false);
  }
};
  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };
  // Interpolate floating animations
  const float1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });
  
  const float2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });
  
  const float3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12]
  });
  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorative elements */}
      <Animated.View style={[styles.backgroundShape, styles.shape1, {
        transform: [{ translateY: float1 }]
      }]} />
      <Animated.View style={[styles.backgroundShape, styles.shape2, {
        transform: [{ translateY: float2 }]
      }]} />
      <Animated.View style={[styles.backgroundShape, styles.shape3, {
        transform: [{ translateY: float3 }]
      }]} />
      
      {/* Verification Message Overlay */}
      {showVerificationMessage && (
        <Animated.View 
          style={[
            styles.verificationOverlay,
            {
              opacity: verificationMessageAnim,
              transform: [{
                scale: verificationMessageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.verificationCard}>
            <Ionicons name="mail" size={40} color="#6A5ACD" />
            <Text style={styles.verificationTitle}>Check Your Email!</Text>
            <Text style={styles.verificationText}>
              We've sent a verification code to{'\n'}{email}
            </Text>
          </View>
        </Animated.View>
      )}
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6A5ACD" />
          </TouchableOpacity>
          
        </Animated.View>
        
        {/* Main Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Craft X</Text>
            <Text style={styles.welcomeSubtitle}>
              Create magical stories and bring your imagination to life
            </Text>
          </View>
          
          {/* Google Sign In Button */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#4285F4" size="small" />
            ) : (
              <>
                <Image 
                   source={require('../../assets/images/google.png')} 
                   style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or with email</Text>
            <View style={styles.dividerLine} />
          </View>
          
          {/* Email Input Section */}
          <View style={styles.emailSection}>
            <Text style={styles.emailLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6A5ACD" style={styles.inputIcon} />
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.emailButton,
                !email && styles.emailButtonDisabled
              ]}
              onPress={handleEmailSignIn}
              activeOpacity={0.8}
              disabled={isEmailLoading || !email}
            >
              {isEmailLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Text style={styles.emailButtonText}>Send Verification Code</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
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
    opacity: 0.1,
    zIndex: -1,
  },
  shape1: {
    width: 180,
    height: 180,
    backgroundColor: '#6A5ACD',
    top: -90,
    right: -60,
  },
  shape2: {
    width: 120,
    height: 120,
    backgroundColor: '#FF6B6B',
    bottom: 150,
    left: -40,
  },
  shape3: {
    width: 100,
    height: 100,
    backgroundColor: '#4ECDC4',
    top: '35%',
    right: -30,
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
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Google Button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
   googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
    marginLeft: 12,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#999',
    marginHorizontal: 16,
  },
  // Email Section
  emailSection: {
    marginBottom: 30,
  },
  emailLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6FA',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#4A4A4A',
  },
  emailButton: {
    backgroundColor: '#6A5ACD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emailButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  emailButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFF',
    marginRight: 8,
  },
  // Verification Message
  verificationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(106, 90, 205, 0.9)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationCard: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  verificationTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#4A4A4A',
    marginTop: 16,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Footer
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});