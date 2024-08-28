import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { api } from '../services';
import { Home } from '../types';
import { colors } from '../styles';

type HomeListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeList'>;

type Props = {
  navigation: HomeListScreenNavigationProp;
};

const useHomes = () => {
  const [homes, setHomes] = useState<Home[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const fetchHomes = useCallback(async (pageNumber: number, refresh: boolean = false) => {
    if (loading || (!hasMorePages && !refresh)) return;
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to check proximity.');
        const { homes: newHomes, totalPages } = await api.getHomes({ page: pageNumber });
        if (refresh) {
          setHomes(newHomes);
        } else {
          setHomes(prevHomes => [...prevHomes, ...newHomes]);
        }
        setHasMorePages(pageNumber < totalPages);
        setPage(pageNumber);
        return;
      }
      let location = await Location.getCurrentPositionAsync({})
      const { homes: newHomes, totalPages } = await api.getHomes({ page: pageNumber, baseLat: location?.coords.latitude, baseLng: location?.coords.longitude });
      if (refresh) {
        setHomes(newHomes);
      } else {
        setHomes(prevHomes => [...prevHomes, ...newHomes]);
      }
      setHasMorePages(pageNumber < totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching homes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, hasMorePages]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMorePages(true);
    fetchHomes(1, true);
  }, [fetchHomes]);

  return { homes, page, loading, refreshing, hasMorePages, isFetched, fetchHomes, setIsFetched, onRefresh };
};

const HomeListScreen: React.FC<Props> = React.memo(({ navigation }) => {
  const { homes, page, loading, isFetched, refreshing, fetchHomes, setIsFetched, onRefresh } = useHomes();

  useEffect(() => {
    if (!isFetched) {
      setIsFetched(true)
      fetchHomes(1);
    }
  }, [fetchHomes, isFetched]);

  const renderHomeItem: ListRenderItem<Home> = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.homeItem}
      onPress={() => navigation.navigate('HomeDetails', { homeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.homeImage} />
      <View style={styles.homeInfo}>
        <Text style={styles.homeAddress}>{item.address}</Text>
        <Text style={styles.homeDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.homeDetails}>
          ${item.price.toLocaleString()} | {item.bedrooms} bd | {item.bathrooms} ba | {item.squareFootage} sqft
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }, [loading]);

  const memoizedFlatList = useMemo(() => (
    <FlatList
      data={homes}
      renderItem={renderHomeItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.listContent}
      onEndReached={() => fetchHomes(page + 1)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    />
  ), [homes, page, fetchHomes, renderHomeItem, renderFooter, refreshing, onRefresh]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Homes</Text>
      {memoizedFlatList}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    padding: 16,
  },
  listContent: {
    padding: 16,
  },
  homeItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeImage: {
    width: 120,
    height: 120,
  },
  homeInfo: {
    flex: 1,
    padding: 12,
  },
  homeAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  homeDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 4,
  },
  homeDetails: {
    fontSize: 12,
    color: colors.primary,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeListScreen;