
import React, { useMemo, useState } from 'react';
import { Platform, View, FlatList, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme, Appbar, Text, Searchbar, Card, Button, Chip, Snackbar } from 'react-native-paper';

// Theme
const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: { ...DefaultTheme.colors, primary: '#1B5E20', secondary: '#C62828' }
};

// --- Data loading: import JSON, with hard fallback if empty ---
import venuesJson from './assets/venues.json';
import programmeJson from './assets/programme.json';

let VENUES = Array.isArray(venuesJson) ? venuesJson : [];
let PROGRAMME = Array.isArray(programmeJson) ? programmeJson : [];

if (!VENUES.length) {
  VENUES = [
    { id: 'erfurthuis', name: 'Erfurthuis', address: '37 Ryneveld St, Stellenbosch', lat: -33.9372, lng: 18.8625, note: 'Festival hub / info' },
    { id: 'idas-valley-primary', name: 'Idas Valley Primary / Idasvallei Primêr', address: 'Bloekomlaan, Idas Valley', lat: -33.919389, lng: 18.882139 },
    { id: 'drostdy-teater', name: 'Drostdy-teater', address: '48 Alexander St, Stellenbosch', lat: -33.9362, lng: 18.8588 }
  ];
}
if (!PROGRAMME.length) {
  PROGRAMME = [
    {
      id: 'n-begin',
      title: "’n Begin",
      category: 'Theatre',
      language: 'Afrikaans',
      times: [
        { dateISO: '2025-10-16', time: '13:00' },
        { dateISO: '2025-10-17', time: '20:00' }
      ],
      venueId: 'idas-valley-primary',
      price: 'R215–R260',
      ticketUrl: 'https://www.webtickets.co.za/v2/Client.aspx?clientcode=woordfees',
      detailUrl: 'https://woordfees.co.za/en/program/n-begin/'
    }
  ];
}

function openExternal(url) { Linking.openURL(url).catch(()=>{}); }
function toVenue(id) { return VENUES.find(v => v.id === id); }
function formatDateLabel(iso) {
  try { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString(undefined, { weekday:'short', day:'2-digit', month:'short' }); }
  catch { return iso; }
}

// Programme Screen
function ProgrammeScreen() {
  const [q,setQ] = useState('');
  const [cat,setCat] = useState('All');
  const [snack,setSnack] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(PROGRAMME.map(p=>p.category)))], []);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PROGRAMME.filter(p => {
      const inCat = cat==='All' || p.category===cat;
      const venueName = (toVenue(p.venueId)?.name || '').toLowerCase();
      const lang = (p.language || '').toLowerCase();
      const inText = !term || p.title.toLowerCase().includes(term) || lang.includes(term) || venueName.includes(term);
      return inCat && inText;
    });
  }, [q,cat]);

  return (
    <View style={{flex:1}}>
      <View style={{ paddingHorizontal:16, paddingVertical:12, gap:12 }}>
        <Searchbar placeholder="Search title, venue, language…" value={q} onChangeText={setQ} autoCorrect={false} />
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
          {categories.map(c => <Chip key={c} selected={c===cat} onPress={()=>setCat(c)}>{c}</Chip>)}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i=>i.id}
        contentContainerStyle={{ padding:12, gap:12 }}
        renderItem={({item}) => <ProgrammeCard item={item} onError={setSnack} />}
      />

      <Snackbar visible={!!snack} onDismiss={()=>setSnack('')}>{snack}</Snackbar>
    </View>
  );
}

function ProgrammeCard({ item, onError }) {
  const venue = toVenue(item.venueId);
  const subtitle = [item.category, item.language].filter(Boolean).join(' • ');
  return (
    <Card mode="elevated">
      <Card.Title title={item.title} subtitle={subtitle} />
      <Card.Content>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:4 }}>
          {item.times?.map((t,idx)=>(<Chip compact key={idx}>{formatDateLabel(t.dateISO)} · {t.time}</Chip>))}
        </View>
        <View style={{ marginTop:8 }}>
          <Text variant="labelMedium">Venue</Text>
          <Text>{venue?.name || 'TBC'}</Text>
        </View>
        {item.price ? (
          <View style={{ marginTop:8 }}>
            <Text variant="labelMedium">Price</Text>
            <Text>{item.price}</Text>
          </View>
        ) : null}
      </Card.Content>
      <Card.Actions style={{ justifyContent:'space-between' }}>
        <Button onPress={()=>openExternal(item.detailUrl || 'https://woordfees.co.za/en/programme/')}>Details</Button>
        <Button mode="contained" onPress={()=> item.ticketUrl ? openExternal(item.ticketUrl) : onError?.('Ticket link not available for this item.')}>Buy tickets</Button>
      </Card.Actions>
    </Card>
  );
}

// Map Screen
function MapScreen() {
  const [selected, setSelected] = useState(null);
  const region = { latitude:-33.932106, longitude:18.860151, latitudeDelta:0.08, longitudeDelta:0.08 };

  const openDirections = (v) => {
    const lat=v.lat, lng=v.lng; const label=encodeURIComponent(v.name);
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`
    });
    Linking.openURL(url || '').catch(()=>{});
  };

  return (
    <View style={{flex:1}}>
      <MapView style={{flex:1}} initialRegion={region}>
        {VENUES.map(v=> (
          <Marker key={v.id} coordinate={{latitude:v.lat, longitude:v.lng}} title={v.name} description={v.address} onPress={()=>setSelected(v)} />
        ))}
      </MapView>
      {selected && (
        <Card style={{ position:'absolute', left:12, right:12, bottom:24 }}>
          <Card.Title title={selected.name} subtitle={selected.address} />
          <Card.Content>{selected.note ? <Text>{selected.note}</Text> : null}</Card.Content>
          <Card.Actions>
            <Button onPress={()=>setSelected(null)}>Close</Button>
            <Button mode="contained" onPress={()=>openDirections(selected)}>Open in Maps</Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
}

// Tickets Screen
function TicketsScreen() {
  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Card>
        <Card.Title title="Webtickets – Woordfees" subtitle="Official ticketing partner" />
        <Card.Content><Text>Browse all Woordfees events and purchase tickets via Webtickets.</Text></Card.Content>
        <Card.Actions><Button mode="contained" onPress={()=>openExternal('https://www.webtickets.co.za/v2/Client.aspx?clientcode=woordfees')}>Open Webtickets</Button></Card.Actions>
      </Card>
      <Card>
        <Card.Title title="Festival website" subtitle="News, programme, updates" />
        <Card.Content><Text>Visit the official Woordfees site for programme announcements and news.</Text></Card.Content>
        <Card.Actions><Button onPress={()=>openExternal('https://woordfees.co.za/en/')}>Open woordfees.co.za</Button></Card.Actions>
      </Card>
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex:1, paddingVertical:14, alignItems:'center', borderBottomWidth:3, borderBottomColor: active ? theme.colors.primary : 'transparent' }}>
      <Text style={{ fontWeight: active ? '700' : '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);
  const screens = [<ProgrammeScreen key="p" />, <MapScreen key="m" />, <TicketsScreen key="t" />];
  const titles = ['Programme', 'Map', 'Tickets'];
  const counts = ` (${PROGRAMME.length} events · ${VENUES.length} venues)`;
  return (
    <PaperProvider theme={theme}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Woordfees" subtitle={`${titles[tab]}${counts}`} />
      </Appbar.Header>
      <View style={{ flexDirection:'row' }}>
        <TabButton label="Programme" active={tab===0} onPress={()=>setTab(0)} />
        <TabButton label="Map" active={tab===1} onPress={()=>setTab(1)} />
        <TabButton label="Tickets" active={tab===2} onPress={()=>setTab(2)} />
      </View>
      <View style={{ flex:1 }}>{screens[tab]}</View>
      <View style={{ padding:8, alignItems:'center' }}>
        <Text variant="labelSmall">Unofficial companion app for Toyota Stellenbosch Woordfees.</Text>
      </View>
    </PaperProvider>
  );
}
