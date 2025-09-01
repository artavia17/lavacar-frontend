import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerOpacity,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

// Skeleton components for specific sections
export const BannerSkeleton: React.FC = () => (
  <View style={styles.bannerContainer}>
    <SkeletonLoader width={width - 32} height={180} borderRadius={16} />
  </View>
);

export const VehicleCardSkeleton: React.FC = () => (
  <View style={styles.vehicleCard}>
    <View style={styles.vehicleHeader}>
      <SkeletonLoader width={60} height={60} borderRadius={30} />
      <View style={styles.vehicleInfo}>
        <SkeletonLoader width={120} height={20} borderRadius={4} />
        <SkeletonLoader width={80} height={16} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
      <SkeletonLoader width={40} height={24} borderRadius={12} />
    </View>
    <View style={styles.vehicleStats}>
      <View style={styles.statItem}>
        <SkeletonLoader width={40} height={16} borderRadius={4} />
        <SkeletonLoader width={60} height={24} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <View style={styles.statItem}>
        <SkeletonLoader width={40} height={16} borderRadius={4} />
        <SkeletonLoader width={60} height={24} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    </View>
  </View>
);

export const CouponCardSkeleton: React.FC = () => (
  <View style={styles.couponCard}>
    <SkeletonLoader width={280} height={120} borderRadius={16} />
  </View>
);

export const RedemptionItemSkeleton: React.FC = () => (
  <View style={styles.redemptionItem}>
    <SkeletonLoader width={60} height={60} borderRadius={8} />
    <View style={styles.redemptionContent}>
      <SkeletonLoader width={120} height={18} borderRadius={4} />
      <SkeletonLoader width={80} height={14} borderRadius={4} style={{ marginTop: 6 }} />
      <SkeletonLoader width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
    <SkeletonLoader width={60} height={32} borderRadius={16} />
  </View>
);

export const VehicleHeaderSkeleton: React.FC = () => (
  <View style={styles.vehicleHeaderSkeleton}>
    <SkeletonLoader width={180} height={24} borderRadius={4} />
    <SkeletonLoader width={120} height={18} borderRadius={4} style={{ marginTop: 8 }} />
  </View>
);

export const TransactionItemSkeleton: React.FC = () => (
  <View style={styles.transactionItemSkeleton}>
    <View style={styles.transactionMainInfo}>
      <SkeletonLoader width={100} height={16} borderRadius={4} />
      <SkeletonLoader width={80} height={14} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
    <SkeletonLoader width={60} height={20} borderRadius={4} />
  </View>
);

export const TransactionsSectionSkeleton: React.FC = () => (
  <View style={styles.transactionsSectionSkeleton}>
    <SkeletonLoader width={120} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
    <TransactionItemSkeleton />
    <TransactionItemSkeleton />
    <TransactionItemSkeleton />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  couponCard: {
    marginRight: 16,
  },
  redemptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  redemptionContent: {
    flex: 1,
    marginLeft: 16,
  },
  vehicleHeaderSkeleton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  transactionItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  transactionMainInfo: {
    flex: 1,
  },
  transactionsSectionSkeleton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
});