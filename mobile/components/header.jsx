// components/Header.tsx - Top header with user info and menu
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';


export default function Header({ title = 'Craft X', showBack = false, onBack }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleMenuPress = () => {
    Alert.alert(
      'Menu',
      'Choose an option',
      [
        { text: 'My Stories', onPress: () => router.push('/(tabs)/stories') },
        { text: 'Settings', onPress: () => console.log('Settings - Coming soon!') },
        { text: 'Sign Out', onPress: handleLogout, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  // Get user's first name or email
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get emoji based on user email (fun touch!)
  const getUserEmoji = () => {
    const emojis = ['😊', '🌟', '🎨', '📚', '✨', '🎭', '🌈', '🎪'];
    if (user?.email) {
      const index = user.email.charCodeAt(0) % emojis.length;
      return emojis[index];
    }
    return '😊';
  };

  return (
    <View style={styles.header}>
      {/* Left side */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#4A4A4A" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right side - User info */}
      {user && (
        <View style={styles.rightSection}>
          <Text style={styles.userName}>{getUserName()}</Text>
          <TouchableOpacity style={styles.userButton} onPress={handleMenuPress}>
            <Text style={styles.userEmoji}>{getUserEmoji()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginRight: 10,
  },
  userButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6A5ACD',
  },
  userEmoji: {
    fontSize: 18,
  },
});



