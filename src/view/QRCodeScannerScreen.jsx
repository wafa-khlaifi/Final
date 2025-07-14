// import React, { useState } from 'react';
// import { View, Text, Alert, StyleSheet, TouchableOpacity, Linking } from 'react-native';
// import { RNCamera } from 'react-native-camera';

// const QRCodeScannerScreen = () => {
//   const [lastScannedCode, setLastScannedCode] = useState(null);

//   const onBarCodeRead = ({ data }) => {
//     console.log("🔍 Code scanné:", data);
//     console.log("📦 Dernier code enregistré:", lastScannedCode);

//     if (data && data !== lastScannedCode) {
//       setLastScannedCode(data);
//       console.log("✅ Nouveau code détecté, affichage de l'alerte...");
      
//       Alert.alert('QR Code détecté', data, [
//         {
//           text: 'Ouvrir le lien',
//           onPress: () => {
//             console.log("🌐 Tentative d'ouverture du lien:", data);
//             Linking.openURL(data).catch(err => {
//               console.error("❌ Erreur lors de l'ouverture du lien", err);
//             });
//           }
//         },
//         { text: 'Annuler', style: 'cancel' }
//       ]);
//     } else {
//       console.log("⚠️ Code déjà scanné ou vide, aucune action effectuée.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <RNCamera
//         style={styles.preview}
//         type={RNCamera.Constants.Type.back}
//         captureAudio={false}
//         onBarCodeRead={onBarCodeRead}
//         androidCameraPermissionOptions={{
//           title: 'Permission caméra',
//           message: 'Nous avons besoin de votre permission pour utiliser la caméra',
//           buttonPositive: 'OK',
//           buttonNegative: 'Annuler',
//         }}
//         flashMode={RNCamera.Constants.FlashMode.auto}
//       />

//       {/* Texte en haut */}
//       <View style={styles.topContent}>
//         <Text style={styles.centerText}>
//           Allez sur{' '}
//           <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text>{' '}
//           sur votre ordinateur et scannez le code QR.
//         </Text>
//       </View>

//       {/* Bouton en bas */}
//       <View style={styles.bottomContent}>
//         <TouchableOpacity
//           style={styles.buttonTouchable}
//           onPress={() => console.log("👆 Bouton 'OK. J'ai compris !' pressé")}
//         >
//           <Text style={styles.buttonText}>OK. J'ai compris !</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//   },
//   topContent: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//   },
//   bottomContent: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   centerText: {
//     fontSize: 18,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   textBold: {
//     fontWeight: 'bold',
//     color: '#00f',
//   },
//   buttonTouchable: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: 'rgb(0,122,255)',
//   },
// });

// export default QRCodeScannerScreen;




import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const QRCodeScannerScreen = () => {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  const captureAndSend = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        setPreviewUri(data.uri);

        const formData = new FormData();
        formData.append('file', {
          uri: data.uri,
          name: 'qrcode.jpg',
          type: 'image/jpeg',
        });

        const response = await axios.post(
          'http://api.qrserver.com/v1/read-qr-code/?outputformat=json',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const qrData = response.data[0]?.symbol[0]?.data;
        if (qrData) {
          setResult(qrData);
        } else {
          Alert.alert('Erreur', 'QR code non reconnu.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erreur', 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
      />
      <TouchableOpacity style={styles.captureButton} onPress={captureAndSend}>
        <Text style={styles.buttonText}>Scanner</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.previewImage} />
      )}

      {result && (
        <Text style={styles.resultText}>Résultat : {result}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  captureButton: {
    backgroundColor: '#00C853',
    padding: 15,
    alignSelf: 'center',
    margin: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 18 },
  resultText: { color: '#fff', fontSize: 18, textAlign: 'center', margin: 10 },
  previewImage: { width: 200, height: 200, alignSelf: 'center', marginTop: 10 },
});

export default QRCodeScannerScreen;
