import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const checkInternetConnectivity = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    Alert.alert('Error', 'No internet connection. Please check your connection and try again.');
  }
  return state.isConnected;
};
