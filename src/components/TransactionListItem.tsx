import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../models/transaction';
import MaskedAmount from './MaskedAmount';
import { ChevronRight } from 'lucide-react-native';

interface TransactionListItemProps {
    transaction: Transaction;
    onPress: (transactionId: string) => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(transaction.id)}
        >
            <View style={styles.mainInfo}>
                <Text style={styles.id}>{transaction.id}</Text>
                <Text style={styles.description}>{transaction.description}</Text>
            </View>
            <View style={styles.amountInfo}>
                <MaskedAmount
                    amount={transaction.amount}
                    type={transaction.type}
                    showRevealButton={false}
                />
                <ChevronRight size={15} color='grey' />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    mainInfo: {
        flex: 1,
        marginRight: 8,
    },
    id: {
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    description: {
        color: '#000',
        marginBottom: 4,
    },
    amountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5
    }
});

export default TransactionListItem;
