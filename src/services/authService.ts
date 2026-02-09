import * as LocalAuthentication from 'expo-local-authentication';

export enum AuthStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    NO_BIOMETRICS = 'NO_BIOMETRICS',
    CANCELLED = 'CANCELLED',
}

interface AuthConfig {
    promptMessage?: string;
    fallbackToPin?: boolean;
}

export const authService = {
    authenticateWithBiometrics: async (config: AuthConfig = {}): Promise<AuthStatus> => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const canUseBiometrics = hasHardware && isEnrolled;

        if (!canUseBiometrics) {
            return AuthStatus.NO_BIOMETRICS;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: config.promptMessage || 'Login with Biometrics',
                fallbackLabel: 'Use PIN',
                disableDeviceFallback: false,
            });

            if (result.success) {
                return AuthStatus.SUCCESS;
            }

            if (result.error === 'user_cancel') {
                return AuthStatus.CANCELLED;
            }

            return AuthStatus.FAILED;
        } catch (error) {
            console.error('Biometric authentication error:', error);
            return AuthStatus.FAILED;
        }
    },

    validatePin: async (pin: string): Promise<boolean> => {
        // Demo PIN
        const DEMO_PIN = '123456';
        await new Promise(resolve => setTimeout(resolve, 800));
        return pin === DEMO_PIN;
    }
};
