import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Vibration,
    ScrollView
} from 'react-native';
import { Delete, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

interface PinAuthModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onValidatePin: (pin: string) => Promise<boolean>;
}

const PIN_LENGTH = 6;

const PinAuthModal: React.FC<PinAuthModalProps> = ({
    isVisible,
    onClose,
    onSuccess,
    onValidatePin
}) => {
    const [pin, setPin] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isVisible) {
            setPin('');
            setError(null);
            setIsValidating(false);
        }
    }, [isVisible]);

    const handlePress = (val: string) => {
        if (pin.length < PIN_LENGTH && !isValidating) {
            const newPin = pin + val;
            setPin(newPin);
            setError(null);

            if (newPin.length === PIN_LENGTH) {
                validate(newPin);
            }
        }
    };

    const handleDelete = () => {
        if (pin.length > 0 && !isValidating) {
            setPin(pin.slice(0, -1));
            setError(null);
        }
    };

    const validate = async (completePin: string) => {
        setIsValidating(true);
        const isValid = await onValidatePin(completePin);

        if (isValid) {
            onSuccess();
            onClose();
        } else {
            setIsValidating(false);
            setPin('');
            setError('Incorrect PIN. Please try again.');
            Vibration.vibrate([0, 100, 50, 100]);
        }
    };

    const renderKey = (val: string) => (
        <TouchableOpacity
            key={val}
            style={styles.key}
            onPress={() => handlePress(val)}
            disabled={isValidating}
        >
            <Text style={styles.keyText}>{val}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color="#333" size={24} />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Enter PIN</Text>
                        <Text style={styles.subtitle}>Enter your 6-digit PIN to authorize</Text>
                    </View>

                    <View style={styles.pinContainer}>
                        {[...Array(PIN_LENGTH)].map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.pinDot,
                                    pin.length > i && styles.pinDotFilled,
                                    error && styles.pinDotError
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.statusContainer}>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        {isValidating && <ActivityIndicator color="#007AFF" />}
                    </View>

                    <View style={styles.keypad}>
                        <View style={styles.row}>
                            {['1', '2', '3'].map(renderKey)}
                        </View>
                        <View style={styles.row}>
                            {['4', '5', '6'].map(renderKey)}
                        </View>
                        <View style={styles.row}>
                            {['7', '8', '9'].map(renderKey)}
                        </View>
                        <View style={styles.row}>
                            <View style={styles.keyEmpty} />
                            {renderKey('0')}
                            <TouchableOpacity style={styles.key} onPress={handleDelete}>
                                <Delete color="#333" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 30
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#E5E5EA',
        marginHorizontal: 8,
    },
    pinDotFilled: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    pinDotError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF2F1',
    },
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        height: 20
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '500',
    },
    keypad: {
        width: '100%',
        maxWidth: 320,
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    key: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyEmpty: {
        width: 75,
        height: 75,
    },
    keyText: {
        fontSize: 32,
        fontWeight: '400',
        color: '#000',
    },
});

export default PinAuthModal;
