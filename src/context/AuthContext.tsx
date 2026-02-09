import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService, AuthStatus } from '../services/authService';
import PinAuthModal from '../components/PinAuthModal';
import { StatusBar } from 'react-native';

interface AuthContextType {
    isAuthenticated: boolean;
    authenticate: () => Promise<boolean>;
    isShowAmount: boolean;
    handleToggleAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPinModalVisible, setIsPinModalVisible] = useState(false);
    const [authResolver, setAuthResolver] = useState<((value: boolean) => void) | null>(null);
    const [isShowAmount, setIsShowAmount] = useState(false);

    const authenticate = async (): Promise<boolean> => {
        if (isAuthenticated) return true;

        // First attempt: Biometrics
        const result = await authService.authenticateWithBiometrics();

        if (result === AuthStatus.SUCCESS) {
            setIsAuthenticated(true);
            setIsShowAmount(true);
            return true;
        }

        // If biometrics fail or aren't available, fallback to PIN
        if (result === AuthStatus.FAILED || result === AuthStatus.NO_BIOMETRICS) {
            return new Promise((resolve) => {
                setAuthResolver(() => resolve);
                setIsPinModalVisible(true);
            });
        }

        return false;
    }

    const handlePinSuccess = () => {
        setIsAuthenticated(true);
        setIsShowAmount(true);
        authResolver?.(true);
        setAuthResolver(null);
    }

    const handlePinClose = () => {
        setIsPinModalVisible(false);
        authResolver?.(false);
        setAuthResolver(null);
    }

    const handleToggleAuth = async () => {
        if (!isAuthenticated) {
            await authenticate();
        } else {
            setIsShowAmount(!isShowAmount);
        }
    };

    const value = {
        isAuthenticated,
        authenticate,
        isShowAmount,
        handleToggleAuth
    };

    return (
        <AuthContext.Provider value={value}>
            <StatusBar barStyle="dark-content" />
            {children}
            <PinAuthModal
                isVisible={isPinModalVisible}
                onClose={handlePinClose}
                onSuccess={handlePinSuccess}
                onValidatePin={authService.validatePin}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
