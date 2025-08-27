import { Stack } from 'expo-router';
import React from 'react';
import { ProtectedRoute } from '../../src/presentation/components/auth/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute allowedUserTypes={['agent', 'user']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(agent)" />
        <Stack.Screen name="(user)" />
      </Stack>
    </ProtectedRoute>
  );
}