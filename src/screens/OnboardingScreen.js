import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Détection IA Rapide',
    description: 'Prenez en photo vos plants de cacao et identifiez instantanément les maladies grâce à notre intelligence artificielle.',
    icon: '📸'
  },
  {
    id: '2',
    title: 'Conseils Personnalisés',
    description: 'Accédez à un catalogue complet de bonnes pratiques et recevez des recommandations adaptées à votre plantation.',
    icon: '🌱'
  },
  {
    id: '3',
    title: 'Météo Intelligente',
    description: 'Anticipez les risques agricoles grâce à nos alertes météo locales et protégez vos récoltes.',
    icon: '⛅'
  }
];

export default function OnboardingScreen({ navigation }) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

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

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.primary }]}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
              <Text style={{ color: '#888' }}>Passer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePrev} style={styles.skipButton}>
              <Text style={{ color: '#888' }}>Précédent</Text>
            </TouchableOpacity>
          )}
          <Button 
            mode="contained" 
            onPress={handleNext}
            buttonColor={theme.colors.primary}
            style={styles.nextButton}
          >
            {currentIndex === slides.length - 1 ? "Commencer" : "Suivant"}
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
