import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from '../config';


export default function QRScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

const handleBarCodeScanned = async ({ data }) => {
  if (scanned) return;
  setScanned(true);

  console.log("Scanned QR Raw:", data);

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch {
    parsedData = { raw: data };
  }

  console.log("Parsed Data:", parsedData);

  if (!parsedData.transaction_id || !parsedData.action) {
    navigation.navigate("TransactionResultScreen", {
      transaction: { error: "Invalid QR code." },
    });
    return;
  }

  navigation.navigate("TransactionResultScreen", { transaction: parsedData });

  // Optional: then confirm transaction in background
  try {
    // const API_BASE = "http://192.168.1.28:8000/api";
    await fetch(`${API_BASE_URL}/api/loyalty/confirm-${parsedData.action}/${parsedData.transaction_id}`, { method: "POST" });
  } catch (e) {
    console.error("Background confirmation failed:", e);
  }
};




  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
      )}
      {scanned && <ActivityIndicator size="large" color="blue" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
});