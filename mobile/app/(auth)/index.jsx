import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current;
  
  // Load fonts
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  
  // Animation values for background elements
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create floating animation for background elements
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
    createAnimation(floatAnim1, 3000, 0).start();
    createAnimation(floatAnim2, 4000, 1000).start();
    createAnimation(floatAnim3, 3500, 500).start();
  }, []);

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setMenuOpen(!menuOpen);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateTo = (route) => {
    toggleMenu();
    setTimeout(() => router.push(route), 300);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Interpolate floating animations
  const float1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15]
  });
  
  const float2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12]
  });
  
  const float3 = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Background decorative elements */}
        <Animated.View style={[styles.backgroundCircle, styles.bgCircle1, {
          transform: [{ translateY: float1 }]
        }]} />
        <Animated.View style={[styles.backgroundCircle, styles.bgCircle2, {
          transform: [{ translateY: float2 }]
        }]} />
        <Animated.View style={[styles.backgroundCircle, styles.bgCircle3, {
          transform: [{ translateY: float3 }]
        }]} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Hamburger Menu */}
          <View style={styles.header}>
            <Text style={styles.logo}>Craft X</Text>
            <TouchableOpacity 
              onPress={toggleMenu} 
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#6A5ACD" />
            </TouchableOpacity>
          </View>
          
          {/* Hero Section */}
          <View style={styles.hero}>
            <Text style={styles.title}>Create, Read & Color</Text>
            <Text style={styles.title}>Magical Stories,</Text>
            <Text style={styles.title}>Powered by AI</Text>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Craftx helps parents, teachers, and kids bring their imagination to life with fun, illustrated stories and printable coloring books.
              </Text>
            </View>
          </View>
          
          {/* Illustration Area with Image */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/images/hero.png')}
              style={styles.mainImage}
              resizeMode="contain"
            />
            
            {/* Subtle decorative elements that don't overlap content */}
            <View style={styles.edgeDecorations}>
              <View style={[styles.edgeCircle, styles.edgeCircle1]} />
              <View style={[styles.edgeCircle, styles.edgeCircle2]} />
              <View style={[styles.edgeCircle, styles.edgeCircle3]} />
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                router.push('/login');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Creating</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Explore Stories</Text>
            </TouchableOpacity>
          </View>
          
          {/* Story Prompt */}
          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Write a story titled</Text>
            <View style={styles.prompt}>
              <Text style={styles.promptText}>How the Turtle Cracked His Shell</Text>
              <Ionicons name="pencil" size={20} color="#6A5ACD" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Navigation Menu Overlay */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        />
      )}
      
      {/* Sliding Menu */}
      <Animated.View 
        style={[
          styles.sideMenu, 
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <LinearGradient
          colors={['#6A5ACD', '#8A69D4']}
          style={styles.menuGradient}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Craft X</Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.menuItems}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/')}
          >
            <Ionicons name="home" size={20} color="#6A5ACD" />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/stories')}
          >
            <Ionicons name="book" size={20} color="#6A5ACD" />
            <Text style={styles.menuItemText}>My Stories</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/coloring')}
          >
            <Ionicons name="color-palette" size={20} color="#6A5ACD" />
            <Text style={styles.menuItemText}>Coloring Books</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('/settings')}
          >
            <Ionicons name="settings" size={20} color="#6A5ACD" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.signInItem]}
            onPress={() => navigateTo('/login')}
          >
            <Ionicons name="log-in" size={20} color="#FFF" />
            <Text style={[styles.menuItemText, styles.signInText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // Background elements
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
    zIndex: -1,
  },
  bgCircle1: {
    width: 200,
    height: 200,
    backgroundColor: '#6A5ACD',
    top: -50,
    right: -50,
  },
  bgCircle2: {
    width: 150,
    height: 150,
    backgroundColor: '#FF6B6B',
    bottom: 100,
    left: -50,
  },
  bgCircle3: {
    width: 120,
    height: 120,
    backgroundColor: '#4ECDC4',
    top: '40%',
    right: -30,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // Navigation Menu Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height, // Full screen height
    backgroundColor: '#FFF',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  menuGradient: {
    paddingBottom: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#FFF',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItems: {
    paddingVertical: 20,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
    marginLeft: 15,
  },
  signInItem: {
    marginTop: 'auto',
    marginBottom: 30,
    backgroundColor: '#6A5ACD',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  signInText: {
    color: '#FFF',
    fontFamily: 'Nunito_600SemiBold',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E6E6FA',
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F0F0FF',
  },
  logo: {
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    color: '#6A5ACD',
  },
  // Hero Section
  hero: {
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FF6B6B',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_800ExtraBold',
    lineHeight: 38,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Illustration Container
  illustrationContainer: {
    height: 250,
    marginVertical: 5,
    position: 'relative',
    backgroundColor: '#F8F9FF',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainImage: {
    width: '90%',
    height: '90%',
    zIndex: 2,
  },
  edgeDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  edgeCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.3,
  },
  edgeCircle1: {
    width: 80,
    height: 80,
    backgroundColor: '#6A5ACD',
    top: -40,
    left: -40,
  },
  edgeCircle2: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B6B',
    bottom: -20,
    right: -20,
  },
  edgeCircle3: {
    width: 40,
    height: 40,
    backgroundColor: '#4ECDC4',
    top: '50%',
    right: -10,
    transform: [{ translateY: -20 }],
  },
  // Action Buttons
  actions: {
    marginTop: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6A5ACD',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6A5ACD',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  // Story Prompt
  promptContainer: {
    backgroundColor: '#F0F0FF',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promptLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  prompt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6FA',
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#4A4A4A',
  },
});