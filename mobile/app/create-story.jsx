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