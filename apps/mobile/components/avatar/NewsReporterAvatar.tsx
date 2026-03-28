import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReporter } from './ReporterProvider';
import { useI18n } from '../../i18n';
import { newsApi } from '../../lib/api';
import { COLORS } from '../../styles/colors';

const AVATAR_CLOSED = require('../../assets/avatar/reporter-closed-mouth.png');
const AVATAR_OPEN = require('../../assets/avatar/reporter-open-mouth.png');

export function NewsReporterAvatar() {
  const { lang, t } = useI18n();
  const { isSpeaking, mouthOpenness, speakText, stopSpeaking } = useReporter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptText, setScriptText] = useState('');

  const handlePlayNews = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    setIsLoading(true);
    setScriptText('');
    try {
      const articles = await newsApi.getLatest(3);
      let script: string;

      if (!articles || articles.length === 0) {
        script = lang === 'si'
          ? 'සුභ දවසක්! මේ මොහොතේ නවතම පුවත් නොමැත.'
          : lang === 'ta'
          ? 'நல்ல நாள்! தற்போது புதிய செய்திகள் இல்லை.'
          : 'Good day! No new articles at the moment.';
      } else {
        const headlines = articles.slice(0, 3).map((a: any) => {
          const title = lang === 'si' ? (a.titleSi || a.titleEn) : lang === 'ta' ? (a.titleTa || a.titleEn) : a.titleEn;
          const summary = lang === 'si' ? (a.summarySi || a.summaryEn) : lang === 'ta' ? (a.summaryTa || a.summaryEn) : a.summaryEn;
          return `${title}. ${summary || ''}`;
        });
        const greetings: Record<string, string> = {
          en: "Good day! I'm your Infora News Reporter. Here are today's top stories. ",
          si: 'සුභ දවසක්! මම ඔබගේ ඉන්ෆෝරා පුවත් වාර්තාකාරිණිය. අද ප්‍රධාන පුවත් මෙන්න. ',
          ta: 'நல்ல நாள்! நான் உங்கள் இன்ஃபோரா செய்தி நிருபர். இன்றைய முக்கிய செய்திகள் இதோ. ',
        };
        script = (greetings[lang] || greetings.en) + headlines.join(' Next up: ');
      }
      setScriptText(script);
      await speakText(script);
    } catch (error) {
      console.warn('News reporter failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const texts = {
    en: { playNews: 'Play News', stopNews: 'Stop', loading: 'Preparing...', reporter: 'AI Reporter', live: 'LIVE' },
    si: { playNews: 'පුවත් ඇසීම', stopNews: 'නවතන්න', loading: 'සූදානම්...', reporter: 'AI වාර්තාකාරිණි', live: 'සජීවී' },
    ta: { playNews: 'செய்திகளைக் கேளுங்கள்', stopNews: 'நிறுத்து', loading: 'தயாராகிறது...', reporter: 'AI நிருபர்', live: 'நேரலை' },
  };

  const labels = texts[lang as keyof typeof texts] || texts.en;

  return (
    <View style={styles.container}>
      {isExpanded && (
        <View style={styles.expandedPanel}>
          <TouchableOpacity onPress={() => setIsExpanded(false)} style={styles.closeButton}>
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>

          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{labels.reporter}</Text>
            {isSpeaking && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>{labels.live}</Text>
              </View>
            )}
          </View>

          {scriptText.length > 0 && (
            <View style={styles.scriptContainer}>
              <Text style={styles.scriptText} numberOfLines={4}>
                {scriptText}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handlePlayNews}
            disabled={isLoading}
            style={[
              styles.actionButton,
              isSpeaking ? styles.actionStop : isLoading ? styles.actionLoading : styles.actionPlay,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : isSpeaking ? (
              <>
                <Ionicons name="mic-off" size={16} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>{labels.stopNews}</Text>
              </>
            ) : (
              <>
                <Ionicons name="volume-high" size={16} color={COLORS.primary} />
                <Text style={[styles.actionText, { color: COLORS.primary }]}>{labels.playNews}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
        style={[styles.avatarWrapper, isSpeaking && styles.avatarSpeaking]}
      >
        <Image
          source={mouthOpenness > 0.5 ? AVATAR_OPEN : AVATAR_CLOSED}
          style={styles.avatarImage}
        />
        {isSpeaking && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Above the tab bar
    left: 20,
    zIndex: 9999,
  },
  expandedPanel: {
    width: 260,
    backgroundColor: 'rgba(15,20,32,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    zIndex: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scriptContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  scriptText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  actionPlay: {
    backgroundColor: 'rgba(125,189,236,0.15)',
    borderColor: 'rgba(125,189,236,0.3)',
  },
  actionStop: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  actionLoading: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  avatarSpeaking: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0A0D14',
  },
});
