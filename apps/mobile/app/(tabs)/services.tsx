import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { servicesApi } from '../../lib/api';
import { COLORS } from '../../styles/colors';

const FALLBACK_SERVICES = [
  {
    id: 'passport', title: 'Passport Application', titleSi: 'ගමන් බලපත්‍ර අයදුම්පත', titleTa: 'கடவுச்சீட்டு விண்ணப்பம்',
    icon: 'book' as const, color: '#3B82F6',
    time: '3-4 weeks', fee: 'LKR 3,500', source: 'immigration.gov.lk',
    docs: ['NIC (original + copy)', 'Birth Certificate', 'Passport photos (3.5×4.5cm)', 'Form K35A/K35B'],
    steps: ['Get form K35A (new) or K35B (renewal)', 'Fill in BLOCK CAPITALS', 'Get JP/Attorney certification', 'Attach NIC, birth cert, photos', 'Submit at Battaramulla or Regional Office', 'Pay fee and collect after processing'],
  },
  {
    id: 'nic', title: 'NIC Registration', titleSi: 'ජාතික හැඳුනුම්පත', titleTa: 'தேசிய அடையாள அட்டை',
    icon: 'card' as const, color: '#8B5CF6',
    time: '2-4 weeks', fee: 'LKR 100', source: 'drp.gov.lk',
    docs: ['Birth Certificate (original)', 'GN certification letter', 'Three passport photos', "Parent's NIC copies"],
    steps: ['Get form from GN/Divisional Secretariat', 'Fill form with GN certification', 'Attach birth cert + photos', 'Submit at Divisional Secretariat', 'Collect NIC after processing'],
  },
  {
    id: 'driving', title: 'Driving License', titleSi: 'රියදුරු බලපත්‍රය', titleTa: 'ஓட்டுநர் உரிமம்',
    icon: 'car' as const, color: '#10B981',
    time: '1-2 weeks', fee: 'LKR 1,500', source: 'motortraffic.gov.lk',
    docs: ['NIC (original + copy)', 'Medical certificate', 'Two passport photos', "Learner's permit"],
    steps: ["Apply for Learner's Permit", 'Pass written/oral exam', 'Practice for 3+ months', 'Pass practical driving test', 'Collect license'],
  },
  {
    id: 'birth', title: 'Birth Certificate', titleSi: 'උප්පැන්න සහතිකය', titleTa: 'பிறப்புச் சான்றிதழ்',
    icon: 'document-text' as const, color: '#F59E0B',
    time: '1-2 weeks', fee: 'LKR 50', source: 'rgd.gov.lk',
    docs: ['Hospital birth notification (H-546)', "Parent's NICs", 'Marriage certificate', 'GN certification (home births)'],
    steps: ['Register within 42 days (free)', 'Get hospital form H-546', 'Visit Registrar office', 'Submit with parent NIC copies', 'Receive certificate'],
  },
];

export default function ServicesScreen() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setServices(data.map((s: any) => ({
          ...s,
          icon: s.id === 'passport' ? 'book' : s.id === 'nic' ? 'card' : s.id === 'driving-license' ? 'car' : 'document-text',
          color: s.id === 'passport' ? '#3B82F6' : s.id === 'nic' ? '#8B5CF6' : s.id === 'driving-license' ? '#10B981' : '#F59E0B',
          time: s.processingTime || '2-4 weeks',
          fee: s.fee || 'Contact office',
          source: s.officialSource || s.source || '',
          docs: s.documents || s.docs || [],
          steps: s.steps || [],
        })));
      }
    } catch (e) {
      // Use fallback data
    }
  };

  const getTitle = (svc: any) => {
    if (lang === 'si') return svc.titleSi || svc.title;
    if (lang === 'ta') return svc.titleTa || svc.title;
    return svc.title;
  };

  const service = services.find((s) => s.id === selected);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 2 }}>
          {t('govServices').split(' ')[0]}{' '}
          <Text style={{ color: COLORS.primary }}>{t('govServices').split(' ').slice(1).join(' ')}</Text>
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          {t('govServicesDesc')}
        </Text>

        {!selected ? (
          services.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              onPress={() => setSelected(svc.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: '#131A2A', borderRadius: 16, padding: 18, marginBottom: 10,
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 12, backgroundColor: `${svc.color}20`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name={svc.icon as any} size={22} color={svc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFF' }}>{getTitle(svc)}</Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    ⏱ {svc.time} • 💰 {svc.fee}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.15)" />
              </View>
            </TouchableOpacity>
          ))
        ) : service ? (
          <View>
            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}
            >
              <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.4)" />
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{t('back')}</Text>
            </TouchableOpacity>

            {/* Header Card */}
            <View style={{
              backgroundColor: '#131A2A', borderRadius: 18, padding: 20, marginBottom: 14,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <View style={{
                  width: 48, height: 48, borderRadius: 14, backgroundColor: `${service.color}20`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ionicons name={service.icon as any} size={24} color={service.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFF' }}>{getTitle(service)}</Text>
                  <Text style={{ fontSize: 11, color: '#22C55E', marginTop: 2 }}>✅ {service.source}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t('processing')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFF', marginTop: 2 }}>{service.time}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t('fee')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFF', marginTop: 2 }}>{service.fee}</Text>
                </View>
              </View>
            </View>

            {/* Documents */}
            <View style={{
              backgroundColor: '#131A2A', borderRadius: 18, padding: 20, marginBottom: 14,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 14 }}>
                📋 {t('requiredDocs')}
              </Text>
              {service.docs.map((doc: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginTop: 2 }} />
                  <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20 }}>{doc}</Text>
                </View>
              ))}
            </View>

            {/* Steps */}
            <View style={{
              backgroundColor: '#131A2A', borderRadius: 18, padding: 20, marginBottom: 14,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF', marginBottom: 14 }}>
                📝 {t('steps')}
              </Text>
              {service.steps.map((step: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(125,189,236,0.1)',
                    borderWidth: 1, borderColor: 'rgba(125,189,236,0.2)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20, paddingTop: 4 }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* Disclaimer */}
            <View style={{
              backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: 12, padding: 14,
              borderWidth: 1, borderColor: 'rgba(245,158,11,0.15)',
            }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 18 }}>
                ⚠️ {t('disclaimer')}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
