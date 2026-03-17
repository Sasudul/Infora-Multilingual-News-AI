import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const SERVICES = [
  {
    id: 'passport', title: 'Passport Application', titleSi: 'ගමන් බලපත්‍ර අයදුම්පත',
    icon: 'book' as const, color: '#3B82F6',
    time: '3-4 weeks', fee: 'LKR 3,500', source: 'immigration.gov.lk',
    docs: ['NIC (original + copy)', 'Birth Certificate', 'Passport photos (3.5×4.5cm)', 'Form K35A/K35B'],
    steps: ['Get form K35A (new) or K35B (renewal)', 'Fill in BLOCK CAPITALS', 'Get JP/Attorney certification', 'Attach NIC, birth cert, photos', 'Submit at Battaramulla or Regional Office', 'Pay fee and collect after processing'],
  },
  {
    id: 'nic', title: 'NIC Registration', titleSi: 'ජාතික හැඳුනුම්පත',
    icon: 'card' as const, color: '#8B5CF6',
    time: '2-4 weeks', fee: 'LKR 100', source: 'drp.gov.lk',
    docs: ['Birth Certificate (original)', 'GN certification letter', 'Three passport photos', "Parent's NIC copies"],
    steps: ['Get form from GN/Divisional Secretariat', 'Fill form with GN certification', 'Attach birth cert + photos', 'Submit at Divisional Secretariat', 'Collect NIC after processing'],
  },
  {
    id: 'driving', title: 'Driving License', titleSi: 'රියදුරු බලපත්‍රය',
    icon: 'car' as const, color: '#10B981',
    time: '1-2 weeks', fee: 'LKR 1,500', source: 'motortraffic.gov.lk',
    docs: ['NIC (original + copy)', 'Medical certificate', 'Two passport photos', "Learner's permit"],
    steps: ["Apply for Learner's Permit", 'Pass written/oral exam', 'Practice for 3+ months', 'Pass practical driving test', 'Collect license'],
  },
  {
    id: 'birth', title: 'Birth Certificate', titleSi: 'උප්පැන්න සහතිකය',
    icon: 'document-text' as const, color: '#F59E0B',
    time: '1-2 weeks', fee: 'LKR 50', source: 'rgd.gov.lk',
    docs: ['Hospital birth notification (H-546)', "Parent's NICs", 'Marriage certificate', 'GN certification (home births)'],
    steps: ['Register within 42 days (free)', 'Get hospital form H-546', 'Visit Registrar office', 'Submit with parent NIC copies', 'Receive certificate'],
  },
];

export default function ServicesScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const service = SERVICES.find((s) => s.id === selected);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0D14' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 2 }}>
          Government <Text style={{ color: '#7DBDEC' }}>Services</Text>
        </Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          Step-by-step guides from official sources
        </Text>

        {!selected ? (
          // Service Grid
          SERVICES.map((svc) => (
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
                  <Ionicons name={svc.icon} size={22} color={svc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFF' }}>{svc.title}</Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                    ⏱ {svc.time} • 💰 {svc.fee}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.15)" />
              </View>
            </TouchableOpacity>
          ))
        ) : service ? (
          // Service Detail
          <View>
            <TouchableOpacity onPress={() => setSelected(null)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.4)" />
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Back to all services</Text>
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
                  <Ionicons name={service.icon} size={24} color={service.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFF' }}>{service.title}</Text>
                  <Text style={{ fontSize: 11, color: '#22C55E', marginTop: 2 }}>✅ {service.source}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Processing</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFF', marginTop: 2 }}>{service.time}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Fee</Text>
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
                📋 Required Documents
              </Text>
              {service.docs.map((doc, i) => (
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
                📝 Step-by-Step Process
              </Text>
              {service.steps.map((step, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(125,189,236,0.1)',
                    borderWidth: 1, borderColor: 'rgba(125,189,236,0.2)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#7DBDEC' }}>{i + 1}</Text>
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
                ⚠️ This is guidance only. Always check the official government website for the latest information and requirements.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
