import { Job, Notification, UserProfile } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend React Developer',
    company: 'Gjirafa Inc.',
    logo: 'GJ',
    city: 'Prishtinë',
    category: 'Teknologji & Programim',
    type: 'Kohë e plotë',
    salary: '2,200€ - 3,000€',
    description: 'Ne po kërkojmë një Senior Frontend Developer me përvojë të thellë në React, Tailwind CSS dhe TypeScript për të udhëhequr zhvillimin e produkteve tona të rradhës në tregun e Kosovës dhe rajonit.',
    requirements: [
      'Mbi 5 vite përvojë pune me React dhe JavaScript/TypeScript.',
      'Njohuri të shkëlqyera të HTML5, CSS3 dhe Tailwind CSS.',
      'Përvojë me state management (Redux, Zustand apo React Context).',
      'Njohuri në optimizimin e performancës së aplikacioneve web.'
    ],
    responsibilities: [
      'Zhvillimi i komponentëve të ripërdorshëm me kod të pastër dhe të testueshëm.',
      'Bashkëpunimi me dizajnerët UI/UX dhe inxhinierët backend.',
      'Mentorimi i anëtarëve junior të ekipit tonë.',
      'Përmirësimi i vazhdueshëm i arkitekturës frontend.'
    ],
    postedAt: '2026-06-28T10:00:00.000Z',
    isFeatured: true
  },
  {
    id: 'job-2',
    title: 'UI/UX Designer',
    company: 'Radix',
    logo: 'RX',
    city: 'Prishtinë',
    category: 'Dizajn & Kreativitet',
    type: 'Punë nga shtëpia',
    salary: '1,400€ - 1,800€',
    description: 'Radix kërkon një UI/UX Designer pasionant që do të marrë përgjegjësinë për krijimin e eksperiencave të shkëlqyera digjitale për klientët tanë ndërkombëtarë.',
    requirements: [
      'Përvojë e dëshmuar si UI/UX Designer me një portfolio të pasur.',
      'Zotërim i shkëlqyer i Figma, Adobe XD dhe Illustrator.',
      'Kuptueshmëri e lartë e parimeve të User-Centered Design.',
      'Aftësi të shkëlqyera komunikimi në gjuhën angleze.'
    ],
    responsibilities: [
      'Krijimi i wireframes, prototipeve dhe dizajneve përfundimtare vizuale.',
      'Kërkimi i përdoruesve (user research) dhe testimi i prototipeve.',
      'Përcaktimi i sistemeve të dizajnit (Design Systems) të qëndrueshme.',
      'Prezantimi i koncepteve tek palët e interesuara.'
    ],
    postedAt: '2026-06-27T14:30:00.000Z',
    isFeatured: true
  },
  {
    id: 'job-3',
    title: 'Menaxher i Marketingut Digjital',
    company: 'Albi Group',
    logo: 'AG',
    city: 'Fushë Kosovë',
    category: 'Marketing & Shitje',
    type: 'Kohë e plotë',
    salary: '950€ - 1,300€',
    description: 'Albi Group kërkon një profesionist kreativ për të udhëhequr fushatat tona të marketingut digjital, me fokus në rritjen e pranisë sonë online dhe angazhimin e klientëve.',
    requirements: [
      'Diplomë Fakulteti në Marketing apo fusha të ngjashme.',
      'Mbi 2 vite përvojë pune në menaxhimin e rrjeteve sociale dhe fushatave me pagesë.',
      'Përvojë me Google Ads, Meta Business Suite dhe Google Analytics.',
      'Shkathtësi të larta në shkrimin e përmbajtjes (copywriting) në gjuhën shqipe.'
    ],
    responsibilities: [
      'Planifikimi dhe ekzekutimi i strategjisë së marketingut digjital.',
      'Monitorimi dhe raportimi i performancës së fushatave reklamuese.',
      'Krijimi i përmbajtjes vizuale dhe tekstuale për rrjete sociale.',
      'Bashkëpunimi me ekipe të ndryshme për promovimin e produkteve të reja.'
    ],
    postedAt: '2026-06-26T09:15:00.000Z',
    isFeatured: false
  },
  {
    id: 'job-4',
    title: 'Praktikant në Departamentin e Financave',
    company: 'NLB Banka',
    logo: 'NL',
    city: 'Prizren',
    category: 'Financa & Banka',
    type: 'Praktikë',
    salary: '350€ - 450€',
    description: 'NLB Banka hap dyert për studentët apo të sapodiplomuarit e fushës së Ekonomisë për një praktikë 6-mujore me mundësi punësimi të rregullt pas përfundimit.',
    requirements: [
      'Student i vitit të fundit apo i sapodiplomuar në Fakultetin Ekonomik.',
      'Njohuri të mira të punës me kompjuter (MS Excel).',
      'Persona të organizuar, të saktë dhe të gatshëm për të mësuar.',
      'Njohja e gjuhës angleze është përparësi.'
    ],
    responsibilities: [
      'Asistimi në përgatitjen e raporteve ditore financiare.',
      'Regjistrimi dhe verifikimi i transaksioneve sipas procedurave të bankës.',
      'Mbështetja administrative e departamentit të financave.',
      'Pjesëmarrja në trajnime të organizuara nga banka.'
    ],
    postedAt: '2026-06-25T11:00:00.000Z',
    isFeatured: false
  },
  {
    id: 'job-5',
    title: 'Inxhinier i Ndërtimtarisë (Projektues)',
    company: 'Saba Belca',
    logo: 'SB',
    city: 'Pejë',
    category: 'Ndërtimtari & Arkitekturë',
    type: 'Kohë e plotë',
    salary: '1,500€ - 2,000€',
    description: 'Saba Belca kërkon një Inxhinier të Ndërtimtarisë me përvojë në projektimin dhe kalkulimin statik të objekteve civile dhe industriale.',
    requirements: [
      'Diplomë e Masterit në Ndërtimtari (Drejtimi Konstruktiv).',
      'Mbi 3 vite përvojë në projektim dhe përgatitje të dokumentacionit teknik.',
      'Zotërim i shkëlqyer i programeve: AutoCAD, Tower, SAP2000.',
      'Licenca e projektuesit është e dëshirueshme.'
    ],
    responsibilities: [
      'Kalkulimi statik dhe sizmik i konstruksioneve.',
      'Hartimi i projekteve kryesore dhe detajeve të armimit.',
      'Koordinimi me arkitektët dhe inxhinierët e tjerë të projektit.',
      'Mbikëqyrja e zbatimit të projekteve në terren sipas nevojës.'
    ],
    postedAt: '2026-06-24T16:45:00.000Z',
    isFeatured: true
  },
  {
    id: 'job-6',
    title: 'Farmacist i Licencuar',
    company: 'Koha Pharm',
    logo: 'KP',
    city: 'Gjakovë',
    category: 'Shëndetësi & Farmaci',
    type: 'Kohë e plotë',
    salary: '850€ - 1,100€',
    description: 'Koha Pharm kërkon një Farmacist të licencuar për pikën tonë të re në qytetin e Gjakovës. Ne ofrojmë ambient të shkëlqyeshëm pune dhe kushte konkurruese.',
    requirements: [
      'Diplomë e Fakultetit të Farmacisë.',
      'Licenca valide e punës nga Ministria e Shëndetësisë.',
      'Përvojë pune në farmaci të hapur (e dëshirueshme).',
      'Aftësi të shkëlqyera të komunikimit me pacientët.'
    ],
    responsibilities: [
      'Dhënia e barnave me dhe pa receta sipas rregullave dhe udhëzimeve.',
      'Këshillimi i pacientëve mbi përdorimin e drejtë të barnave.',
      'Menaxhimi i stokut të farmacisë dhe kontrolli i afateve të përdorimit.',
      'Mbajtja e pastërtisë dhe standardeve higjienike në farmaci.'
    ],
    postedAt: '2026-06-23T08:00:00.000Z',
    isFeatured: false
  },
  {
    id: 'job-7',
    title: 'Customer Support Representative (German Language)',
    company: 'Kosbit',
    logo: 'KB',
    city: 'Prishtinë',
    category: 'Administratë & Burime Njerëzore',
    type: 'Kohë e pjesshme',
    salary: '800€ - 1,100€',
    description: 'Kosbit po rritet! Po kërkojmë agjentë të shkëlqyeshëm të mbështetjes së klientit që zotërojnë gjuhën gjermane në nivel fluent, për të ndihmuar klientët tanë europianë me kërkesat e tyre.',
    requirements: [
      'Zotërim i shkëlqyer i gjuhës gjermane (C1 apo C2) në të shkruar dhe të folur.',
      'Njohuri të mira të përdorimit të kompjuterit dhe paketës Office.',
      'Aftësi shumë të mira ndërpersonale dhe të dëgjimit aktiv.',
      'Fleksibilitet për të punuar në ndërrime të ndryshme.'
    ],
    responsibilities: [
      'Përgjigjja në telefonata, email-e dhe biseda live (live chat) në gjuhën gjermane.',
      'Zgjidhja e problemeve të klientëve në mënyrë të shpejtë dhe profesionale.',
      'Regjistrimi i saktë i të dhënave në platformën CRM.',
      'Bashkëpunimi me departamentin teknik për zgjidhjen e rasteve më komplekse.'
    ],
    postedAt: '2026-06-22T13:20:00.000Z',
    isFeatured: false
  },
  {
    id: 'job-8',
    title: 'Chef de Cuisine / Kryekuzhinier/e',
    company: 'Swiss Diamond Hotel',
    logo: 'SD',
    city: 'Prishtinë',
    category: 'Gastronomi & Turizëm',
    type: 'Kohë e plotë',
    salary: '1,800€ - 2,500€',
    description: 'Swiss Diamond Hotel Prishtina kërkon një Kryekuzhinier me përvojë ndërkombëtare për të udhëhequr kuzhinën e restoranteve tona prestigjioze, duke sjellë inovacione në meny dhe standarde kulmore.',
    requirements: [
      'Mbi 5 vite përvojë si Kryekuzhinier apo Nën-kryekuzhinier në hotele me 5 yje.',
      'Njohuri të thella të kuzhinës mesdhetare, lokale dhe ndërkombëtare.',
      'Aftësi të jashtëzakonshme të menaxhimit të ekipit dhe organizimit të punës.',
      'Njohuri të rrepta të rregullave të sigurisë ushqimore (HACCP).'
    ],
    responsibilities: [
      'Krijimi i menyve të reja sezonale dhe kalkulimi i kostove të ushqimit (food cost).',
      'Mbikëqyrja dhe trajnimi i stafit të kuzhinës për ruajtjen e standardit maksimal.',
      'Menaxhimi i porosive dhe furnizimeve me lëndë të parë cilësore.',
      'Sigurimi që përgatitja dhe prezantimi i ushqimit të jetë në nivelin më të lartë.'
    ],
    postedAt: '2026-06-20T10:30:00.000Z',
    isFeatured: true
  }
];

export const POPULAR_CATEGORIES = [
  { id: 'cat-1', name: 'Teknologji & Programim', icon: 'Laptop', count: 142 },
  { id: 'cat-2', name: 'Dizajn & Kreativitet', icon: 'Palette', count: 58 },
  { id: 'cat-3', name: 'Marketing & Shitje', icon: 'TrendingUp', count: 96 },
  { id: 'cat-4', name: 'Financa & Banka', icon: 'Briefcase', count: 74 },
  { id: 'cat-5', name: 'Ndërtimtari & Arkitekturë', icon: 'Building2', count: 48 },
  { id: 'cat-6', name: 'Shëndetësi & Farmaci', icon: 'Heart', count: 35 },
  { id: 'cat-7', name: 'Administratë & Burime Njerëzore', icon: 'Users', count: 82 },
  { id: 'cat-8', name: 'Gastronomi & Turizëm', icon: 'Utensils', count: 110 }
];

export const POPULAR_CITIES = [
  { name: 'Prishtinë', count: 420, img: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=300&auto=format&fit=crop' },
  { name: 'Prizren', count: 185, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop' },
  { name: 'Pejë', count: 92, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&auto=format&fit=crop' },
  { name: 'Gjakovë', count: 74, img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=300&auto=format&fit=crop' },
  { name: 'Gjilan', count: 65, img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300&auto=format&fit=crop' },
  { name: 'Mitrovicë', count: 58, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&auto=format&fit=crop' },
  { name: 'Ferizaj', count: 81, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop' }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Lirim Kastrati',
  title: 'Full Stack Web Developer',
  email: 'lirim.kastrati@email.com',
  phone: '+383 44 123 456',
  bio: 'Developer i pasionuar me përvojë 3 vjeçare në krijimin e aplikacioneve moderne me React, Node.js dhe Tailwind CSS. Me seli në Prishtinë, i gatshëm për projekte inovative.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'SQL', 'Git'],
  preferredCity: 'Prishtinë',
  preferredCategory: 'Teknologji & Programim',
  preferredType: 'Kohë e plotë'
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Punë e re e përshtatshme!',
    message: 'Gjirafa Inc. ka postuar një pozitë të re: "Senior Frontend React Developer" në Prishtinë që përputhet me preferencat tuaja.',
    time: 'Para 10 minutash',
    isRead: false,
    type: 'job_match',
    linkJobId: 'job-1'
  },
  {
    id: 'notif-2',
    title: 'Statusi i aplikimit u përditësua',
    message: 'Aplikimi juaj për "UI/UX Designer" në Radix është shënuar si "E shqyrtuar". Fat të mbarë!',
    time: 'Para 2 orësh',
    isRead: true,
    type: 'application_status',
    linkJobId: 'job-2'
  },
  {
    id: 'notif-3',
    title: 'Mirëseerdhët në PunëTani',
    message: 'Plotësoni profilin tuaj sot për të marrë rekomandime të personalizuara rreth vendeve më të mira të punës në Kosovë.',
    time: 'Para 1 dite',
    isRead: true,
    type: 'system'
  }
];
