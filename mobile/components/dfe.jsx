craftx-mobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth group (hidden from tabs)
│   │   ├── login.tsx
│   │   ├── verify-email.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home/Landing
│   │   ├── stories.tsx           # My Stories
│   │   ├── coloring.tsx          # Coloring Books
│   │   └── _layout.tsx
│   ├── create-story.tsx          # Story creation flow
│   ├── story/[id].tsx            # Individual story view
│   ├── settings.tsx
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # Basic UI components
│   │   ├── Header.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── AnimatedBackground.tsx
│   ├── story/                    # Story-related components
│   │   ├── StoryCard.tsx
│   │   ├── StoryReader.tsx
│   │   └── StoryCreator.tsx
│   └── auth/                     # Auth components
│       ├── GoogleSignIn.tsx
│       └── EmailVerification.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useStories.ts
│   ├── useAnimations.ts
│   └── useAPI.ts
├── services/                     # API and external services
│   ├── api.ts                    # Main API client
│   ├── auth.ts                   # Authentication service
│   ├── stories.ts                # Stories API
│   └── civic-auth.ts             # Civic Auth integration
├── store/                        # State management (Zustand recommended)
│   ├── authStore.ts
│   ├── storiesStore.ts
│   └── appStore.ts
├── utils/                        # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validation.ts
│   └── storage.ts
├── types/                        # TypeScript types
│   ├── auth.ts
│   ├── story.ts
│   └── api.ts
├── assets/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── animations/
└── styles/                       # Global styles
    ├── colors.ts
    ├── typography.ts
    └── spacing.ts


is this folder really structure really okay for my rn expo project? i Think its too complex for me just starting rn, and its just an jsx project not TypeScript, Currently now i have the landing page that leads the login an verify page as shown in first attached img, but now with this even if the user is already loggedin it stills shows the user the landing page the next time the app is being visited and still have to log in again tat is not supposed to be so, help me create a work through that is best for a mobile app an good ux , 
an auth that persist with ability to sign out, 
heres the dashboard page

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
// import Header from '../components/Header'; // Assuming you put the Header component in a components folder

export default function Dashsboard() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Background animations
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
    const createAnimation = (value, duration, delay) => {
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

    createAnimation(floatAnim1, 4000, 0).start();
    createAnimation(floatAnim2, 3500, 1000).start();
    createAnimation(floatAnim3, 4500, 500).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleCreateStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to story creation flow
  };

  const handleGenerateIdea = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Generate story idea
  };

  const handleViewTemplates = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Show story templates
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

      {/* Header */}
      {/* <Header 
        title="Create Story" 
        showBack={false}
        showMenu={true}
      /> */}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['#6A5ACD', '#8A69D4', '#9B7CE8']}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <Ionicons name="create" size={40} color="#FFF" />
              <Text style={styles.welcomeTitle}>Welcome to Craft X!</Text>
              <Text style={styles.welcomeSubtitle}>
                Let's create magical stories together
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          {/* Primary Action - Create New Story */}
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={handleCreateStory}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6A5ACD', '#8A69D4']}
              style={styles.actionGradient}
            >
              <View style={styles.actionContent}>
                <View style={styles.actionIcon}>
                  <Ionicons name="add-circle" size={24} color="#FFF" />
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Create New Story</Text>
                  <Text style={styles.actionSubtitle}>Start from scratch with AI assistance</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={handleGenerateIdea}
              activeOpacity={0.8}
            >
              <View style={[styles.secondaryActionIcon, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="bulb" size={20} color="#FFF" />
              </View>
              <Text style={styles.secondaryActionTitle}>Generate Ideas</Text>
              <Text style={styles.secondaryActionSubtitle}>Get AI-powered story prompts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryAction}
              onPress={handleViewTemplates}
              activeOpacity={0.8}
            >
              <View style={[styles.secondaryActionIcon, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="library" size={20} color="#FFF" />
              </View>
              <Text style={styles.secondaryActionTitle}>Story Templates</Text>
              <Text style={styles.secondaryActionSubtitle}>Use pre-made story structures</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View 
          style={[
            styles.recentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Continue Your Journey</Text>
          
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={60} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No stories yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your created stories will appear here. Start by creating your first magical tale!
            </Text>
          </View>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View 
          style={[
            styles.tipsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="information-circle" size={20} color="#6A5ACD" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Pro Tip</Text>
              <Text style={styles.tipText}>
                Start with a simple character and setting. Our AI will help you build an amazing story around it!
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // Background elements
  backgroundShape: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.06,
    zIndex: -1,
  },
  shape1: {
    width: 200,
    height: 200,
    backgroundColor: '#6A5ACD',
    top: -100,
    right: -80,
  },
  shape2: {
    width: 150,
    height: 150,
    backgroundColor: '#FF6B6B',
    bottom: 200,
    left: -50,
  },
  shape3: {
    width: 120,
    height: 120,
    backgroundColor: '#4ECDC4',
    top: '50%',
    right: -40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Welcome Section
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  welcomeContent: {
    padding: 30,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  // Actions Container
  actionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#4A4A4A',
    marginBottom: 20,
  },
  // Primary Action
  primaryAction: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    padding: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#FFF',
    opacity: 0.8,
  },
  // Secondary Actions
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  secondaryActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryActionTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 4,
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Recent Section
  recentSection: {
    marginBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Tips Section
  tipsSection: {
    marginBottom: 20,
  },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6A5ACD'
  }

})

that the user get routed to after login, but the page is not perfect yet there should be header that should be persitent across all the pagess as the case may be, where the can be an hambugger for navigation, with items like library, and favourites, also the user profile should show on the header with an emoji icon and the name of the user, meaning we will have to pupulate the user info from the db
the create new story when clicked should lead to create story page where user can create a new story, and the generate ideas and and story template i dont know how that will sync with the project yet
here is the controller im using to authenticate a user

heres the root layout i have on ground which is the only layout i have for now

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </SafeAreaProvider>
  );
}



my existing login page
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
Dont forget explanation on to go so i can understand better