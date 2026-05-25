import React, {useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';


import {useThemeStore} from '../../core/store/themeStore';
import {colors} from '../../core/theme/colors';
import {GlassCard} from '../../shared/components/GlassCard';

export const QRScannerScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isDark} = useThemeStore();
  const theme = isDark ? colors.dark : colors.light;
  const [scanning, setScanning] = useState(false);

  const handleBarCodeRead = (event) => {
    if (scanning) return;
    setScanning(true);

    try {
      const data = JSON.parse(event.nativeEvent.codeStringValue);
      if (data.type === 'sasa_contact') {
        // Navigate to add contact with sasa_id
        Alert.alert(
          'Contact Found',
          `Add ${data.username}?`,
          [
            {text: 'Cancel', style: 'cancel', onPress: () => setScanning(false)},
            {
              text: 'Add',
              onPress: () => {
                setScanning(false);
                // Navigate to add contact flow
                navigation.goBack();
              }
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Invalid QR Code', 'This is not a valid Sasa QR code.');
      setScanning(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{fontSize: 24}}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.text}]}>{t('scanQR')}</Text>
        <View style={{width: 40}} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.instruction, {color: theme.textSecondary}]}>
          Point camera at a Sasa QR code
        </Text>

        <GlassCard style={styles.scannerCard}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            <View style={styles.scannerPlaceholder}>
              <Icon name="scan-outline" size={60} color={colors.neon.lime} />
              <Text style={[styles.placeholderText, {color: theme.textMuted}]}>
                Camera preview will appear here
              </Text>
              <Text style={[styles.placeholderSub, {color: theme.textMuted}]}>
                (Integrate react-native-camera-kit for production)
              </Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.manualBtn}>
          <Text style={[styles.manualText, {color: colors.neon.lime}]}>
            Enter Sasa ID manually
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {padding: 4},
  title: {fontSize: 18, fontWeight: '600'},
  content: {flex: 1, alignItems: 'center', paddingHorizontal: 24},
  instruction: {fontSize: 14, marginBottom: 24, marginTop: 20},
  scannerCard: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
  },
  scannerFrame: {
    width: 260,
    height: 260,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.neon.lime,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scannerPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {fontSize: 14, marginTop: 12, textAlign: 'center'},
  placeholderSub: {fontSize: 11, marginTop: 4, textAlign: 'center'},
  manualBtn: {marginTop: 32, padding: 12},
  manualText: {fontSize: 15, fontWeight: '600'},
});
