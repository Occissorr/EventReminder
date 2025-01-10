import { StyleSheet } from 'react-native';

const colors = {
  primary: '#88e051',
  secondary: '#FF5A5F',
  textPrimary: '#333',
  textSecondary: '#555',
  textPlaceholder: '#666',
  backgroundLight: '#f9f9f9',
  backgroundDark: '#fff',
  borderLight: '#ccc',
  borderDark: '#ddd',
  overlay: 'rgba(0, 0, 0, 0.5)',
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
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.backgroundDark,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
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
    shadowColor: '#000',
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
