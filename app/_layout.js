import React, { useCallback } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
const StyledSafeAreaView = styled(SafeAreaView);

SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-bold': require('../assets/fonts/Lato-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StyledSafeAreaView className="flex-1 px-2 bg-primary">
        <Slot />
        <StatusBar barStyle={'light-content'} />
      </StyledSafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootLayout;
