import { StyleSheet } from 'react-native';

const colors = {
  primary: '#88e051',
  secondary: '#FF5A5F',
  textPrimary: '#333333',
  textSecondary: '#555555',
  text3: '#ffffff',
  textPlaceholder: '#666666',
  backgroundLight: '#f9f9f9',
  backgroundDark: '#1e1e1e',
  backgroundBlue: '#e0f7fa',
  backgroundGreen: '#e8f5e9',
  borderLight: '#cccccc',
  borderDark: '#dddddd',
  overlayLit: 'rgba(0, 0, 0, 0.5)',
  overlayDrk: 'rgba(255, 255, 255, 0.5)',
  overlayBlue: 'rgba(0, 0, 255, 0.5)',
  overlayGreen: 'rgba(0, 255, 0, 0.5)',
  birthday: '#88e051',
  appointment: '#FF5A5F',
  interview: '#FFA500',
  anniversary: '#FF69B4',
  error1: 'red',
  blueHighlight: '#0000FF',
  greenHighlight: '#00FF00',
  inactive: '#cccccc',
  active: '#88e051',
  inactiveThumb: '#f4f3f4',
  activeThumb: '#ffffff',
};

const fontSizes = {
  small: 14,
  medium: 16,
  large: 18,
  xLarge: 24,
};

const spacing = {
  small: 5,
  medium: 10,
  large: 15,
  xLarge: 20,
};

const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    padding: spacing.xLarge,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text
  title: {
    fontSize: fontSizes.xLarge,
    fontWeight: 'bold',
    marginBottom: spacing.xLarge,
    textAlign: 'center',
  },
  textPrimary: {
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
  },
  textSecondary: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
  },
  textHeader: {
    fontSize: fontSizes.xLarge,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  textLink: {
    fontSize: fontSizes.medium,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // Buttons
  button: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.primary,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.text3,
    padding: spacing.large,
    borderRadius: spacing.small,
    alignItems: 'center',
    width: '100%', 
    maxWidth: 300,
    marginBottom: spacing.large,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    color: colors.text3
  },
  anchor: {
    textDecorationStyle: 'solid',
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primary,
    marginTop: spacing.medium,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
},

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: spacing.medium,
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundDark,
  },
  inputContainer: {
    marginBottom: spacing.large,
  },

  // Modals
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    width: '80%',
    borderRadius: 10,
    padding: spacing.large,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: fontSizes.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
});

export { colors, fontSizes, spacing, globalStyles };
