import { useLocalSearchParams } from 'expo-router';
import { CouponDetailScreen } from '../../../src/presentation/screens/user/CouponDetailScreen';

export default function CouponDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  if (!id || isNaN(parseInt(id))) {
    throw new Error('Invalid coupon ID');
  }

  return <CouponDetailScreen couponId={parseInt(id)} />;
}