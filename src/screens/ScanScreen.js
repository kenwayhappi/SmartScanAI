import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, useTheme } from 'react-native-paper';

export default function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const theme = useTheme();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Nous avons besoin de votre permission pour utiliser la caméra afin d'analyser les plants.</Text>
        <Button mode="contained" onPress={requestPermission} buttonColor={theme.colors.primary}>
          Accorder la permission
        </Button>
      </View>
    );
  }

  const takePicture = () => {
    // Simulation: on passe directement à l'écran de diagnostic après "avoir pris" la photo
    // Dans la réalité: on utiliserait cameraRef.current.takePictureAsync() puis on enverrait à l'IA
    navigation.navigate('Diagnostic');
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          {/* Cadre de visée */}
          <View style={styles.scanFrame} />
          
          <Text style={styles.instructions}>
            Placez la feuille ou le cabosse malade au centre du cadre
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 20,
    marginTop: 50,
  },
  instructions: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF',
  },
});
