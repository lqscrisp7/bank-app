import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

type Props = {
    message: string;
    onRetry: () => void;
}

const ErrorView = ({ message, onRetry }: Props) => {
    return (
        <View style={styles.container}>
            <AlertCircle size={48} color="#FF3B30" style={styles.icon} />
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity style={styles.button} onPress={onRetry}>
                <RefreshCw size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorView;
