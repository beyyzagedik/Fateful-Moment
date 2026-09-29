import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { CountdownBar, urgencyOpacity } from '@/components/play/CountdownBar';
import { OptionButton } from '@/components/play/OptionButton';
import { ScenarioVideo } from '@/components/play/ScenarioVideo';
import { SceneSlideshow } from '@/components/play/SceneSlideshow';
import { getScenario } from '@/data/scenarios';
import { useAuth } from '@/store/auth';
import { useProgress } from '@/store/progress';
import { colors, fonts, spacing } from '@/theme';
import type { DecisionRecord, Scenario } from '@/types';

type Phase =
  | { kind: 'briefing' }
  | { kind: 'intro' }
  | { kind: 'decision'; step: number }
  | { kind: 'locked'; step: number; optionId: string | null }
  | { kind: 'outcome'; step: number; optionId: string | null };

const LOCK_MS = 1100;
// Only called from event handlers / effects, never during render.
const now = () => Date.now();

export default function PlayScenario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = getScenario(id);
  const userId = useAuth((s) => s.user?.id);
  const { record, clearScenario } = useProgress.getState();

  const [phase, setPhase] = useState<Phase>({ kind: 'briefing' });
  const records = useRef<DecisionRecord[]>([]);
  const decisionStartedAt = useRef(0);
  // Blocks a second tap (or tap + timeout) landing before the re-render disables the options.
  const lockedStep = useRef(-1);
  const [overlay] = useState(() => new Animated.Value(0));
  const [remaining] = useState(() => new Animated.Value(1));

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

  // Figma "Simulation": briefing card with the Start Simulation button.
  if (phase.kind === 'briefing') {
    return (
      <AppShell back>
        <Briefing scenario={scenario} onStart={() => setPhase({ kind: 'intro' })} />
      </AppShell>
    );
  }

  const decision = 'step' in phase ? scenario.decisions[phase.step] : undefined;
  const chosen = phase.kind === 'locked' || phase.kind === 'outcome' ? decision?.options.find((o) => o.id === phase.optionId) : undefined;

  const lockIn = (optionId: string | null) => {
    if (phase.kind !== 'decision' || !decision || lockedStep.current === phase.step) return;
    lockedStep.current = phase.step;
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
      remaining.setValue(1); // no red flash before the next countdown starts
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
  const deciding = decision && (phase.kind === 'decision' || phase.kind === 'locked');

  return (
    <View style={styles.root}>
      {/* Background: video if bundled, cinematic scenes otherwise */}
      {chosen?.outcomeVideo && phase.kind === 'outcome' ? (
        <ScenarioVideo key={chosen.id} source={chosen.outcomeVideo} onEnd={() => {}} />
      ) : scenario.video ? (
        <ScenarioVideo source={scenario.video} onEnd={introDone} paused={backgroundFrozen} />
      ) : (
        <SceneSlideshow scenes={scenario.scenes} onEnd={introDone} frozen={backgroundFrozen} />
      )}

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
      {/* Red wash in the last third of the countdown (Figma red decision frame). */}
      {deciding && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.urgency, { opacity: urgencyOpacity(remaining) }]} />
      )}

      <SafeAreaView style={StyleSheet.absoluteFill} edges={['left', 'right', 'top', 'bottom']}>
        <View style={styles.topRow}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Leave scenario"
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Feather name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          {phase.kind === 'intro' && (
            <Pressable onPress={introDone} hitSlop={10} accessibilityRole="button" style={styles.skip}>
              <Text style={styles.skipText}>Skip intro</Text>
              <Feather name="chevrons-right" size={14} color={colors.text} />
            </Pressable>
          )}
        </View>

        {deciding && (
          <View style={styles.decisionWrap}>
            <Text style={styles.stepLabel}>
              DECISION {phase.step + 1}/{scenario.decisions.length}
            </Text>
            <Text style={styles.prompt} numberOfLines={2}>
              {decision.prompt}
            </Text>
            <View style={styles.grid}>
              {decision.options.map((o) => (
                <OptionButton
                  key={o.id}
                  label={o.label}
                  disabled={phase.kind !== 'decision'}
                  state={phase.kind === 'locked' ? (phase.optionId === o.id ? 'selected' : 'faded') : 'idle'}
                  onPress={() => lockIn(o.id)}
                  style={styles.cell}
                />
              ))}
            </View>
            {phase.kind === 'locked' && phase.optionId === null && <Text style={styles.timeout}>Time’s up. No decision was made.</Text>}
          </View>
        )}

        {deciding && (
          <View style={styles.timer}>
            <CountdownBar
              key={decision.id}
              remaining={remaining}
              durationSec={decision.timeLimitSec}
              running={phase.kind === 'decision'}
              onTimeout={() => lockIn(null)}
            />
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

/** Figma "Scenario Container" (1644:863). */
function Briefing({ scenario, onStart }: { scenario: Scenario; onStart: () => void }) {
  const art = scenario.cover ? (
    <ImageBackground source={scenario.cover} resizeMode="cover" style={StyleSheet.absoluteFill} />
  ) : (
    <LinearGradient colors={scenario.tint} style={StyleSheet.absoluteFill} />
  );
  return (
    <View style={styles.briefingPage}>
      <View style={styles.briefingCard}>
        {art}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(2,6,24,0.4)', '#020618']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.briefingBody}>
          <Text style={styles.briefingLabel}>SCENARIO BRIEFING</Text>
          <Text style={styles.briefingTitle}>{scenario.title}</Text>
          <Text style={styles.briefingText}>{scenario.teaser}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onStart}
            style={({ pressed }) => [styles.startBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.startText}>Start Simulation</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  body: { fontFamily: fonts.regular, color: colors.textSecondary },
  dim: { backgroundColor: colors.overlay },
  dimLight: { backgroundColor: 'rgba(0, 0, 0, 0.49)' },
  urgency: { backgroundColor: colors.urgency },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    zIndex: 2,
  },
  iconBtn: { padding: 1 },
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

  decisionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, marginTop: -30 },
  stepLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: colors.primaryBright },
  prompt: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
    maxWidth: 600,
  },
  // Figma "Options": two 345px columns, 12px gaps, an odd last card centered.
  grid: {
    width: '100%',
    maxWidth: 702,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 12,
  },
  cell: { width: '48.5%', maxWidth: 345 },
  timer: { position: 'absolute', left: spacing.xxl, right: spacing.xxl, bottom: 26 },
  timeout: { fontFamily: fonts.semibold, fontSize: 12, color: colors.danger, marginTop: spacing.md },

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

  briefingPage: { flex: 1, paddingHorizontal: spacing.xxl, paddingTop: 16, paddingBottom: 16, alignItems: 'center' },
  briefingCard: {
    flex: 1,
    width: '100%',
    maxWidth: 728,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1D293D',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  briefingBody: { alignItems: 'center', padding: 24, gap: 16 },
  briefingLabel: { fontFamily: fonts.mono, fontWeight: '700', fontSize: 11, lineHeight: 16, letterSpacing: 1, color: colors.primaryBright },
  briefingTitle: {
    fontFamily: fonts.blackItalic,
    fontSize: 28,
    lineHeight: 34,
    color: '#F8FAFC',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: -12,
  },
  briefingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#E2E8F0',
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: 497,
  },
  startBtn: { backgroundColor: 'rgba(0,184,219,0.14)', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  startText: { fontFamily: fonts.black, fontSize: 16, lineHeight: 24, color: colors.primaryBright },
});
