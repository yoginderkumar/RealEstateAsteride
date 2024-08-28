import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services/api';
import { Home } from '../types';
import * as Location from 'expo-location';
import { calculateDistance } from '../utils';
import { colors } from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components';

type HomeDetailsScreenRouteProp = RouteProp<RootStackParamList, 'HomeDetails'>;

type Props = {
    route: HomeDetailsScreenRouteProp;
};

const HomeDetailsScreen: React.FC<Props> = React.memo(({ route }) => {
    const { homeId } = route.params;
    const [home, setHome] = useState<Home | null>(null);
    const [isNearby, setIsNearby] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(false)

    const [checkingLocation, setCheckingLocation] = useState(true);

    const fetchHomeDetails = useCallback(async () => {
        try {
            const fetchedHome = await api.getHomeById(homeId);
            setHome(fetchedHome);
            if (fetchedHome) {
                checkLocation(fetchedHome);
            }
        } catch (error) {
            console.error('Error fetching home details:', error);
        }
    }, [homeId]);

    useEffect(() => {
        if (!isFetched) {
            setIsFetched(true)
            fetchHomeDetails();
        }
    }, [fetchHomeDetails, isFetched]);

    const checkLocation = useCallback(async (selectedHome: Home) => {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            setCheckingLocation(false);
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setCheckingLocation(false);
        const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            selectedHome.latitude,
            selectedHome.longitude
        );
        setIsNearby(distance <= 30);
    }, []);

    const handleUnlock = useCallback(async () => {
        setLoading(true);
        try {
            const success = await api.unlockHome(homeId);
            if (success) {
                setHome(prev => prev ? { ...prev, isUnlocked: true } : null);
                Alert.alert('Success', 'Home unlocked successfully!');
            } else {
                Alert.alert('Error', 'Failed to unlock the home.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while unlocking the home.');
        } finally {
            setLoading(false);
        }
    }, [homeId]);

    const renderContent = useMemo(() => {
        if (!home || checkingLocation) {
            return <Text>Loading...</Text>;
        }

        return (
            <>
                <Image source={{ uri: home.image }} style={styles.image} />
                <View style={styles.contentContainer}>
                    <Text style={styles.address}>{home.address}</Text>
                    <Text style={styles.price}>${home.price.toLocaleString()}</Text>
                    <Text style={styles.details}>
                        {home.bedrooms} bd | {home.bathrooms} ba | {home.squareFootage} sqft
                    </Text>
                    <Text style={styles.description}>{home.description}</Text>
                    {home.isUnlocked ? (
                        <Text style={styles.unlockedMessage}>This home is unlocked</Text>
                    ) : isNearby ? (
                        <Button
                            title="Unlock Home"
                            onPress={handleUnlock}
                            loading={loading}
                        />
                    ) : (
                        <Text style={styles.nearbyMessage}>
                            Move closer to the property to unlock
                        </Text>
                    )}
                </View>
            </>
        );
    }, [home, checkingLocation, isNearby, loading, handleUnlock]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[{ key: 'content' }]}
                renderItem={() => renderContent}
                keyExtractor={item => item.key}
            />
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    image: {
        width: '100%',
        height: 250,
    },
    contentContainer: {
        padding: 16,
    },
    address: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: colors.lightText,
        marginBottom: 24,
    },
    nearbyMessage: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    details: {
        fontSize: 16,
        color: colors.lightText,
        marginBottom: 16,
    },
    unlockedMessage: {
        fontSize: 16,
        color: colors.primary,
        textAlign: 'center',
        marginTop: 16,
        fontWeight: 'bold',
    },
});

export default HomeDetailsScreen;