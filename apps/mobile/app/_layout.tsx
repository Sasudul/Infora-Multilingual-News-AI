import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from '../lib/auth';
import { I18nProvider } from '../i18n';
import { ReporterProvider } from '../components/avatar/ReporterProvider';
import { NewsReporterAvatar } from '../components/avatar/NewsReporterAvatar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <I18nProvider>
        <ReporterProvider>
          <View style={{ flex: 1, backgroundColor: '#0A0D14' }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#0A0D14' },
              }}
            />
            <NewsReporterAvatar />
          </View>
        </ReporterProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
