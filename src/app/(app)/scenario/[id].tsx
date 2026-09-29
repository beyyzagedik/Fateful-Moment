import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CountdownBar } from '@/components/play/CountdownBar';
import { OptionButton } from '@/components/play/OptionButton';
import { ScenarioVideo } from '@/components/play/ScenarioVideo';
import { SceneSlideshow } from '@/components/play/SceneSlideshow';
import { getScenario } from '@/data/scenarios';
import { useAuth } from '@/store/auth';
import { useProgress } from '@/store/progress';
import { colors, fonts, spacing } from '@/theme';
import type { DecisionRecord } from '@/types';

type Phase =
  | { kind: 'title' }
  | { kind: 'intro' }
  | { kind: 'decision'; step: number }
  | { kind: 'locked'; step: number; optionId: string | null }
  | { kind: 'outcome'; step: number; optionId: string | null };

const TITLE_MS = 2600;
const LOCK_MS = 1100;
// Only called from event handlers / effects, never during render.
const now = () => Date.now();

export default function PlayScenario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = getScenario(id);
  const userId = useAuth((s) => s.user?.id);
  const { record, clearScenario } = useProgress.getState();

  const [phase, setPhase] = useState<Phase>({ kind: 'title' });
  const records = useRef<DecisionRecord[]>([]);
  const decisionStartedAt = useRef(0);
  const [overlay] = useState(() => new Animated.Value(0));

  // Title card → intro
  useEffect(() => {
    if (phase.kind !== 'title') return;
    const t = setTimeout(() => setPhase({ kind: 'intro' }), TITLE_MS);
    return () => clearTimeout(t);
  }, [phase.kind]);

  // Dim the background whenever the decision UI is up.
  const showOverlay = phase.kind === 'decision' || phase.kind === 'locked' || phase.kind === 'outcome';
  useEffect(() => {
    Animated.timing(overlay, { toValue: showOverlay ? 1 : 0, duration: 400, useNativeDriver: true }).start();
  }, [showOverlay, overlay]);

  useEffect(() => {
    if (phase.kind === 'decision') decisionStartedAt.current = now();
  }, [phase]);

  if (!scenario || !scenario.available) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.body}>This scenario is not available yet.</Text>
        <Button variant="glow" compact title="Back" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const decision = 'step' in phase ? scenario.decisions[phase.step] : undefined;
  const chosen = phase.kind === 'locked' || phase.kind === 'outcome' ? decision?.options.find((o) => o.id === phase.optionId) : undefined;

  const lockIn = (optionId: string | null) => {
    if (phase.kind !== 'decision' || !decision) return;
    if (Platform.OS !== 'web') {
      (optionId ? Haptics.selectionAsync() : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)).catch(() => {});
    }
    records.current.push({
      scenarioId: scenario.id,
      decisionId: decision.id,
      optionId,
      responseMs: now() - decisionStartedAt.current,
      at: now(),
    });
    const step = phase.step;
    setPhase({ kind: 'locked', step, optionId });
    setTimeout(() => setPhase({ kind: 'outcome', step, optionId }), LOCK_MS);
  };

  const next = () => {
    if (phase.kind !== 'outcome') return;
    if (phase.step < scenario.decisions.length - 1) {
      setPhase({ kind: 'decision', step: phase.step + 1 });
      return;
    }
    // Scenario finished: replaying replaces earlier answers for this scenario.
    if (userId) {
      clearScenario(userId, scenario.id);
      records.current.forEach((r) => record(userId, r));
    }
    router.replace({ pathname: '/dna', params: { fresh: scenario.id } });
  };

  const introDone = () => setPhase({ kind: 'decision', step: 0 });
  const backgroundFrozen = phase.kind !== 'intro';

  return (
    <View style={styles.root}>
      {/* Background: video if bundled, cinematic scenes otherwise */}
      {phase.kind !== 'title' &&
        (chosen?.outcomeVideo && phase.kind === 'outcome' ? (
          <ScenarioVideo key={chosen.id} source={chosen.outcomeVideo} onEnd={() => {}} />
        ) : scenario.video ? (
          <ScenarioVideo source={scenario.video} onEnd={introDone} paused={backgroundFrozen} />
        ) : (
          <SceneSlideshow scenes={scenario.scenes} onEnd={introDone} frozen={backgroundFrozen} />
        ))}

      {/* Figma "Unselected Options": a still (map) replaces the paused video while deciding. */}
      {scenario.decisionBackdrop && !(chosen?.outcomeVideo && phase.kind === 'outcome') && (
        <Animated.Image
          source={scenario.decisionBackdrop}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { opacity: overlay }]}
        />
      )}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, scenario.decisionBackdrop ? styles.dimLight : styles.dim, { opacity: overlay }]}
      />

      <SafeAreaView style={StyleSheet.absoluteFill} edges={['left', 'right', 'top', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Leave scenario"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Feather name="arrow-left" size={18} color={colors.text} />
          </Pressable>
          {phase.kind === 'intro' && (
            <Pressable onPress={introDone} hitSlop={10} accessibilityRole="button" style={styles.skip}>
              <Text style={styles.skipText}>Skip intro</Text>
              <Feather name="chevrons-right" size={14} color={colors.text} />
            </Pressable>
          )}
        </View>

        {phase.kind === 'title' && <TitleCard title={scenario.title} year={scenario.year} role={scenario.role} />}

        {decision && (phase.kind === 'decision' || phase.kind === 'locked') && (
          <View style={styles.decisionWrap}>
            <Text style={styles.stepLabel}>
              DECISION {phase.step + 1}/{scenario.decisions.length}
            </Text>
            <Text style={styles.prompt}>{decision.prompt}</Text>
            <ScrollView style={styles.options} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={false}>
              {decision.options.map((o) => (
                <OptionButton
                  key={o.id}
                  label={o.label}
                  disabled={phase.kind !== 'decision'}
                  state={phase.kind === 'locked' ? (phase.optionId === o.id ? 'selected' : 'faded') : 'idle'}
                  onPress={() => lockIn(o.id)}
                />
              ))}
            </ScrollView>
            <View style={styles.timer}>
              <CountdownBar
                key={decision.id}
                durationSec={decision.timeLimitSec}
                running={phase.kind === 'decision'}
                onTimeout={() => lockIn(null)}
              />
            </View>
            {phase.kind === 'locked' && phase.optionId === null && <Text style={styles.timeout}>Time’s up. No decision was made.</Text>}
          </View>
        )}

        {phase.kind === 'outcome' && (
          <View style={styles.outcomeWrap}>
            <Text style={styles.stepLabel}>{chosen ? 'YOUR DECISION' : 'NO DECISION'}</Text>
            <Text style={styles.outcomeChoice}>{chosen ? chosen.label : 'You hesitated — and the clock decided for you.'}</Text>
            <Text style={styles.outcomeText}>
              {chosen ? chosen.outcome : 'Events moved on without you. Others filled the silence you left.'}
            </Text>
            <Button
              variant="glow"
              compact
              title={phase.step < scenario.decisions.length - 1 ? 'Continue' : 'See your DNA'}
              onPress={next}
              style={styles.outcomeCta}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

function TitleCard({ title, year, role }: { title: string; year: number; role: string }) {
  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(TITLE_MS - 1200),
      Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade]);
  return (
    <Animated.View style={[styles.titleCard, { opacity: fade }]}>
      <Text style={styles.titleYear}>{year}</Text>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.titleRole}>{role}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  body: { fontFamily: fonts.regular, color: colors.textSecondary },
  dim: { backgroundColor: colors.overlay },
  dimLight: { backgroundColor: 'rgba(3, 7, 20, 0.45)' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    zIndex: 2,
  },
  iconBtn: { padding: 4 },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  skipText: { fontFamily: fonts.medium, fontSize: 12, color: colors.text },

  titleCard: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 6 },
  titleYear: { fontFamily: fonts.mono, fontSize: 13, color: colors.primaryBright, letterSpacing: 4 },
  titleText: { fontFamily: fonts.extraBoldItalic, fontSize: 28, color: colors.text, textAlign: 'center' },
  titleRole: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },

  decisionWrap: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxxl, marginTop: -8 },
  stepLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.primaryBright },
  prompt: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.md,
    maxWidth: 520,
  },
  options: { width: 320, flexGrow: 0, flexShrink: 1 },
  optionsContent: { gap: 8, paddingVertical: 2 },
  timer: { width: 320, marginTop: spacing.md, marginBottom: spacing.sm },
  timeout: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger },

  outcomeWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 80, gap: 8 },
  outcomeChoice: { fontFamily: fonts.extraBoldItalic, fontSize: 18, color: colors.text, textAlign: 'center', maxWidth: 560 },
  outcomeText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 520,
  },
  outcomeCta: { marginTop: spacing.md },
});
