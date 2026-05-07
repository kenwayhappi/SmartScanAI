import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const slides = [
    {
      id: '1',
      title: t('onboarding.slide1_title'),
      description: t('onboarding.slide1_desc'),
      icon: '📸'
    },
    {
      id: '2',
      title: t('onboarding.slide2_title'),
      description: t('onboarding.slide2_desc'),
      icon: '🌱'
    },
    {
      id: '3',
      title: t('onboarding.slide3_title'),
      description: t('onboarding.slide3_desc'),
      icon: '⛅'
    }
  ];

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('fr') ? 'en' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Animatable.View animation="bounceIn" duration={1500} style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </Animatable.View>
      <Animatable.Text animation="fadeInUp" delay={200} style={[styles.title, { color: theme.colors.primary }]}>
        {item.title}
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" delay={400} style={styles.description}>
        {item.description}
      </Animatable.Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sélecteur de langue */}
      <View style={styles.langContainer}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {i18n.language.startsWith('fr') ? 'FR / EN' : 'EN / FR'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />
      
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicator, 
                currentIndex === index 
                  ? [styles.activeIndicator, { backgroundColor: theme.colors.primary }]
                  : { backgroundColor: '#ccc' }
              ]} 
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex === 0 ? (
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipButton}>
              <Text style={{ color: '#888' }}>{t('onboarding.skip')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePrev} style={styles.skipButton}>
              <Text style={{ color: '#888' }}>{t('onboarding.prev')}</Text>
            </TouchableOpacity>
          )}
          <Button 
            mode="contained" 
            onPress={handleNext}
            buttonColor={theme.colors.primary}
            style={styles.nextButton}
          >
            {currentIndex === slides.length - 1 ? t('onboarding.start') : t('onboarding.next')}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  langContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  langButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    height: 120,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  skipButton: {
    padding: 10,
  },
  nextButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
  }
});
