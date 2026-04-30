import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useOffersStore } from '@/store/offers.store'
import { FlatList, StyleSheet, View } from 'react-native'
import { OfferCard } from './OfferCard'
import { OfferSkeletonCard } from './OfferSkeletonCard'

interface OfferListProps {
  onClaim: (offerId: string) => void
  onOfferPress: (offerId: string) => void
  onRefresh: () => void
}

export function OfferList({
  onClaim,
  onOfferPress,
  onRefresh,
}: OfferListProps) {
  const offers = useOffersStore((s) => s.offers)
  const isStreaming = useOffersStore((s) => s.isStreaming)
  const streamError = useOffersStore((s) => s.streamError)

  if (streamError && offers.length === 0) {
    return <ErrorState message={streamError} onRetry={onRefresh} />
  }

  const skeletonCount = Math.max(0, 3 - offers.length)
  const showSkeletons = isStreaming && skeletonCount > 0

  if (!isStreaming && offers.length === 0) {
    return <EmptyState message="No offers available. Pull to refresh!" />
  }

  return (
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <OfferCard
          offer={item}
          index={index}
          onClaim={onClaim}
          onPress={onOfferPress}
        />
      )}
      ListFooterComponent={
        showSkeletons ? (
          <View>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <OfferSkeletonCard key={`skeleton-${i}`} />
            ))}
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 32,
  },
})
