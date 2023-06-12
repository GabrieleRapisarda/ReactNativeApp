import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gyroscope, Accelerometer, Magnetometer } from 'expo-sensors';
import { mat3,quat, vec3 } from 'gl-matrix';

export default function App() {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [magData, setMagData] = useState({ x: 0, y: 0, z: 0 });
  const [rotationQuaternion, setRotationQuaternion] = useState(quat.create());

  useEffect(() => {
    // Lettura dati del giroscopio
    Gyroscope.addListener(gyroListener);

    // Lettura dati dell'accelerometro
    Accelerometer.addListener(accelListener);

    // Lettura dati del magnetometro
    Magnetometer.addListener(magListener);

    // Impostazione dell'intervallo di aggiornamento
    Gyroscope.setUpdateInterval(16);
    Accelerometer.setUpdateInterval(16);
    Magnetometer.setUpdateInterval(16);

    return () => {
      // Rimozione dei listener quando il componente viene smontato
      Gyroscope.removeAllListeners();
      Accelerometer.removeAllListeners();
      Magnetometer.removeAllListeners();
    };
  }, []);

  const gyroListener = (data) => {
    setGyroData(data);

    // Calcolo del quaternione di rotazione
    const deltaQuaternion = quat.create();
    quat.setAxisAngle(deltaQuaternion, vec3.fromValues(data.x, data.y, data.z), 0.5);
    const newRotationQuaternion = quat.multiply(rotationQuaternion, deltaQuaternion, rotationQuaternion);
    const NormalizedQuaternion = quat.create()
    quat.normalize(NormalizedQuaternion, newRotationQuaternion);
    setRotationQuaternion(NormalizedQuaternion);
  };

  const accelListener = (data) => {
    setAccelData(data);
  };

  const magListener = (data) => {
    setMagData(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dati del giroscopio:</Text>
      <Text style={styles.text}>{`x: ${gyroData.x.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`y: ${gyroData.y.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`z: ${gyroData.z.toFixed(2)}`}</Text>

      <Text style={styles.text}>Dati dell'accelerometro:</Text>
      <Text style={styles.text}>{`x: ${accelData.x.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`y: ${accelData.y.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`z: ${accelData.z.toFixed(2)}`}</Text>

      <Text style={styles.text}>Dati del magnetometro:</Text>
      <Text style={styles.text}>{`x: ${magData.x.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`y: ${magData.y.toFixed(2)}`}</Text>
      <Text style={styles.text}>{`z: ${magData.z.toFixed(2)}`}</Text>

      <Text style={styles.text}>Quaternione di rotazione:</Text>
      <Text style={styles.text}>{`w: ${rotationQuaternion[3]}`}</Text>
      <Text style={styles.text}>{`x: ${rotationQuaternion[0]}`}</Text>
      <Text style={styles.text}>{`y: ${rotationQuaternion[1]}`}</Text>
      <Text style={styles.text}>{`z: ${rotationQuaternion[2]}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
