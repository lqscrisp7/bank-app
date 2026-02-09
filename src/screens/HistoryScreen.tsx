import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { transactionService } from '../services/mockData';
import { TransactionGroup } from '../models/transaction';
import TransactionListItem from '../components/TransactionListItem';
import ErrorView from '../components/ErrorView';
import { useAuth } from '../context/AuthContext';
import { Lock, Unlock } from 'lucide-react-native';
import { TouchableOpacity, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

const HistoryScreen: React.FC = () => {
    const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<HistoryScreenNavigationProp>();
    const { isShowAmount, handleToggleAuth } = useAuth();

    const fetchTransactions = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await transactionService.getTransactions()
            setTransactions(data)
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const onRefresh = async () => {
        setIsRefreshing(true)
        try {
            const data = await transactionService.refreshTransactions()
            setTransactions(data)
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred')
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleTransactionPress = (transactionId: string) => {
        navigation.navigate('Detail', { transactionId });
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return <ErrorView message={error} onRetry={() => fetchTransactions()} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Transactions</Text>
                    <Text style={styles.subtitle}>Recent activity</Text>
                </View>
                <TouchableOpacity style={[styles.authToggle, isShowAmount && styles.authToggleActive]} onPress={handleToggleAuth}>
                    {!isShowAmount ? <Lock size={20} color="#007AFF" /> : <Unlock size={20} color="#34C759" />}
                    <Text style={[styles.authToggleText, isShowAmount && styles.authToggleTextActive]}>{!isShowAmount ? 'Reveal All' : 'Revealed'}</Text>
                </TouchableOpacity>
            </View>
            <SectionList
                sections={transactions}
                keyExtractor={(item) => item.id}
                style={styles.listContent}
                renderItem={({ item }) => <TransactionListItem transaction={item} onPress={handleTransactionPress} />}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{section.date}</Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions found</Text>
                </View>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        marginTop: 2,
    },
    authToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    authToggleActive: {
        backgroundColor: '#E8F5E9',
    },
    authToggleText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    authToggleTextActive: {
        color: '#34C759',
    },
    listContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        backgroundColor: '#F2F2F7',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600'
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
    },
});

export default HistoryScreen;
