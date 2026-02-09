import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

interface MaskedAmountProps {
    amount: number;
    type: 'credit' | 'debit';
    showRevealButton?: boolean;
}

const MaskedAmount: React.FC<MaskedAmountProps> = ({
    amount,
    type,
    showRevealButton = true
}) => {
    const { isShowAmount, handleToggleAuth } = useAuth();

    const amountText = isShowAmount ? amount.toFixed(2) : '*****';
    const prefix = type === 'credit' ? '' : '-';
    const color = type === 'credit' ? '#34C759' : '#ff3f3f';

    return (
        <View style={styles.container}>
            <View style={styles.amountWrapper}>
                <Text style={[
                    styles.amount,
                    { color }
                ]}>
                    {prefix} RM {amountText}
                </Text>

                {showRevealButton &&
                    <TouchableOpacity
                        onPress={handleToggleAuth}
                        style={styles.revealButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {isShowAmount ? <Eye size={16} /> : <EyeOff size={16} />}
                    </TouchableOpacity>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amount: {
        fontWeight: '600',
        fontFamily: 'System',
    },
    revealButton: {
        marginLeft: 8,
    },
});

export default MaskedAmount;
