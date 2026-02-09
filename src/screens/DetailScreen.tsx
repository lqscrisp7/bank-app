import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react-native';
import MaskedAmount from '../components/MaskedAmount';
import { SafeAreaView } from 'react-native-safe-area-context';
import { transactionService } from '../services/mockData';
import { Transaction } from '../models/transaction';
import { useAuth } from '../context/AuthContext';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation();
    const { transactionId } = route.params;

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isShowAmount } = useAuth();

    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoading(true);
            const data = await transactionService.getTransactionById(transactionId);
            setTransaction(data || null);
            setIsLoading(false);
        };
        fetchDetail();
    }, [transactionId]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const DetailRow = ({ title, value }: { title: string, value: string }) => (
        <View style={styles.detailRow}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );

    const getAccountDisplay = (accountNumber: string, accountType: string) => {
        return isShowAmount ? `${accountNumber} (${accountType.replace(/\b\w/gi, (letter) => letter.toUpperCase())})` : '************ (Account)';
    }

    const isBank = transaction?.transactionType === 'bank';
    const isCredit = transaction?.type === 'credit';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Details</Text>
                </View>
                {transaction && <View style={styles.detail}>
                    <Text style={styles.id}>{transaction.id}</Text>
                    <MaskedAmount
                        amount={transaction.amount}
                        type={transaction.type}
                    />
                </View>}
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {!transaction ?
                    <View style={styles.center}>
                        <Text>Transaction not found</Text>
                    </View> :
                    <>
                        {!isCredit && <DetailRow title="Transfer Method" value={isBank ? 'Bank Transfer' : 'DuitNow'} />}
                        <DetailRow title="Date & Time" value={`${format(new Date(transaction.date), 'dd/MM/yyyy')} ${format(new Date(transaction.date), 'hh:mm:ss a')}`} />
                        <DetailRow title="Reference No." value={transaction.referenceNo.toString()} />
                        {!isCredit && <DetailRow title="From Account" value={getAccountDisplay(transaction.accountNumber, transaction.accountType)} />}
                        {isBank && !isCredit && <DetailRow title="Recepient Account No." value={getAccountDisplay(transaction.recepientAccountNumber!, transaction.recepientAccountType!)} />}
                        {!isCredit && <DetailRow title="Recepient Name" value={transaction.recepientName} />}
                        {!isBank && !isCredit && <DetailRow title="Mobile Number" value={isShowAmount ? transaction.mobileNumber! : '************'} />}
                        <DetailRow title="Description" value={transaction.description} />
                        <DetailRow title="Transaction Status" value='Successful' />
                    </>}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        rowGap: 10,
        backgroundColor: '#ececec',
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        paddingVertical: 8,
        marginRight: 10
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    id: {
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    title: {
        fontWeight: 500,
        color: 'grey'
    },
    value: {
        flexWrap: 'wrap',
        textAlign: 'right',
        flexShrink: 1
    },
    scrollContent: {
        flexGrow: 1
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 30,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C7C7CC',
        marginHorizontal: 10
    }
});

export default DetailScreen;
