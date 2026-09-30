import { Alert, Platform, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/Button';
import { Panel } from '@/components/dna/Panel';
import { useAuth } from '@/store/auth';
import { useProgress } from '@/store/progress';
import { toast } from '@/store/toast';
import { colors, fonts, spacing } from '@/theme';

function confirm(title: string, message: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Confirm', style: 'destructive', onPress: onOk },
  ]);
}

export default function Settings() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const reset = useProgress((s) => s.reset);

  return (
    <AppShell title="Settings">
      <View style={styles.page}>
        <Panel title="Account" icon="user" style={styles.panel}>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Panel>
        <Panel title="Data" icon="database" style={styles.panel}>
          <Text style={styles.text}>
            This demo runs fully offline. Your decisions are stored on this device only.
          </Text>
          <View style={styles.actions}>
            <Button
              variant="secondary"
              compact
              title="Reset my DNA"
              onPress={() =>
                user &&
                confirm('Reset DNA?', 'All your decisions will be deleted.', () => {
                  reset(user.id);
                  toast.info('DNA reset', 'Your decision history was cleared.');
                })
              }
            />
            <Button
              variant="glow"
              compact
              title="Sign out"
              onPress={() =>
                confirm('Sign out?', 'You can sign in again anytime.', () => {
                  signOut();
                  toast.info('Signed out', 'See you at the next fateful moment.');
                })
              }
            />
          </View>
        </Panel>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  panel: { flex: 1 },
  name: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  email: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  text: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
