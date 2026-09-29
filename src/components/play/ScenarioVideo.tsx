import { useEvent } from 'expo';
import { useVideoPlayer, VideoView, type VideoSource } from 'expo-video';
import { useEffect, useEffectEvent } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  source: VideoSource;
  onEnd: () => void;
  /** Pause on the current frame (behind the decision UI). */
  paused?: boolean;
};

/** Full-bleed scenario video without native controls. */
export function ScenarioVideo({ source, onEnd, paused }: Props) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.play();
  });
  const fireEnd = useEffectEvent(onEnd);

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => fireEnd());
    return () => sub.remove();
  }, [player]);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    if (paused && isPlaying) player.pause();
  }, [paused, isPlaying, player]);

  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}
