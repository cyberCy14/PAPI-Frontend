// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { CameraView, Camera } from "expo-camera";
// import { useIsFocused } from "@react-navigation/native";

// export default function QRScanner({ navigation }) {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = async ({ data }) => {
//     if (scanned) return;
//     setScanned(true);

//     let parsedData = null;
//     try {
//       parsedData = JSON.parse(data); 
//     } catch {
//       parsedData = { raw: data }; 
//     }

//     try {
//       const API_BASE = "http://192.168.1.37:8000/api";
//       const response = await fetch(
//         `${API_BASE}/loyalty/confirm-earning/${parsedData.transaction_id}`,
//         { method: "POST" }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to confirm transaction");
//       }

//       const result = await response.json();

//       navigation.navigate("TransactionResultScreen", { transaction: result });
//     } catch (error) {
//       console.error("Error confirming transaction:", error);
//       navigation.navigate("TransactionResultScreen", {
//         transaction: {
//           error: "Failed to reach server",
//           ...parsedData,
//         },
//       });
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       {isFocused && (
//         <CameraView
//           style={styles.camera}
//           facing="back"
//           onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//           barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
//         />
//       )}
//       {scanned && <ActivityIndicator size="large" color="blue" />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   camera: { flex: 1 },
// });


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

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

    let parsedData = null;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = { raw: data };
    }

    try {
      const API_BASE = "http://192.168.1.37:8000/api";

      let endpoint = "";
      if (parsedData.action === "earn") {
        endpoint = `${API_BASE}/loyalty/confirm-earning/${parsedData.transaction_id}`;
      } else if (parsedData.action === "redeem") {
        endpoint = `${API_BASE}/loyalty/confirm-redemption/${parsedData.transaction_id}`;
      } else {
        throw new Error("Invalid QR code: missing action");
      }

      const response = await fetch(endpoint, { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to confirm transaction");
      }

      const result = await response.json();

      navigation.navigate("TransactionResultScreen", { transaction: result });
    } catch (error) {
      console.error("Error confirming transaction:", error);
      navigation.navigate("TransactionResultScreen", {
        transaction: {
          error: "Failed to reach server",
          ...parsedData,
        },
      });
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