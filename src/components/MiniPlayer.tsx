import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tracks, useMiniPlayer } from '@/store/player';
import { colors, fonts } from '@/theme';

/** The list icon on the right opens the side menu (Figma "Container" 1595:186). */
export function MiniPlayer({ onMenu }: { onMenu?: () => void }) {
  const { playing, index, toggle, next, prev } = useMiniPlayer();

  return (
    <View style={styles.pill}>
      <Pressable hitSlop={8} onPress={prev} accessibilityLabel="Previous track">
        <Ionicons name="play-skip-back-outline" size={13} color={colors.textSecondary} />
      </Pressable>
      <Pressable onPress={toggle} style={styles.play} accessibilityLabel={playing ? 'Pause' : 'Play'}>
        <Ionicons name={playing ? 'pause' : 'play'} size={13} color={colors.primaryBright} style={!playing && { marginLeft: 2 }} />
      </Pressable>
      <Pressable hitSlop={8} onPress={next} accessibilityLabel="Next track">
        <Ionicons name="play-skip-forward-outline" size={13} color={colors.textSecondary} />
      </Pressable>
      <View style={styles.meta}>
        <Text style={styles.status}>{playing ? 'NOW PLAYING' : 'STANDBY'}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {tracks[index].toUpperCase()}
        </Text>
      </View>
      <Pressable hitSlop={10} onPress={onMenu} accessibilityRole="button" accessibilityLabel="Open menu">
        <Feather name="list" size={14} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 48,
    paddingLeft: 17,
    paddingRight: 17,
    // Figma MusicPlayer: docked to the right edge, rounded on the left only.
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    backgroundColor: 'rgba(15,23,43,0.8)',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: 'rgba(49,65,88,0.5)',
  },
  play: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: '#062633',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  meta: { width: 124 },
  status: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 1, color: colors.primaryBright },
  title: { fontFamily: fonts.bold, fontSize: 10, color: colors.text, marginTop: 1 },
});
