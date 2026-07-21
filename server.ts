import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Path to data files
const DATA_DIR = path.join(process.cwd(), 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Mock Data to seed the database if empty
const INITIAL_JOBS = [
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
      'Bashkëpunimi magnetized me dizajnerët UI/UX dhe inxhinierët backend.',
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
  }
];

const DEFAULT_PROFILE = {
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

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Punë e re e përshtatshme!',
    message: 'Gjirafa Inc. ka postuar një pozitë të re: "Senior Frontend React Developer" në Prishtinë që përputhet me preferencat tuaja.',
    time: 'Para 10 minutash',
    isRead: false,
    type: 'job_match',
    linkJobId: 'job-1'
  }
];

// File storage helpers with atomic rename write patterns
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) return defaultValue;
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Middleware
app.use(express.json());

// API Routes

// GET /api/jobs
app.get('/api/jobs', (req, res) => {
  const jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  res.json(jobs);
});

// POST /api/jobs
app.post('/api/jobs', (req, res) => {
  const newJob = req.body;
  if (!newJob.title || !newJob.company) {
    return res.status(400).json({ error: 'Fusha "title" dhe "company" janë të detyrueshme.' });
  }
  const jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  jobs.unshift(newJob);
  writeJsonFile(JOBS_FILE, jobs);
  res.status(201).json(newJob);
});

// DELETE /api/jobs/:id
app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  let jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  const exists = jobs.some(j => j.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Pozita nuk u gjet.' });
  }
  jobs = jobs.filter(j => j.id !== id);
  writeJsonFile(JOBS_FILE, jobs);
  res.json({ success: true });
});

// GET /api/applications
app.get('/api/applications', (req, res) => {
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  res.json(apps);
});

// POST /api/applications
app.post('/api/applications', (req, res) => {
  const newApp = req.body;
  if (!newApp.jobId || !newApp.candidateName || !newApp.candidateEmail) {
    return res.status(400).json({ error: 'Të dhënat e aplikimit janë të mangëta.' });
  }
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  apps.unshift(newApp);
  writeJsonFile(APPLICATIONS_FILE, apps);
  res.status(201).json(newApp);
});

// PUT /api/applications/:id
app.put('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  const appIndex = apps.findIndex(a => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: 'Aplikimi nuk u gjet.' });
  }
  apps[appIndex].status = status;
  writeJsonFile(APPLICATIONS_FILE, apps);
  res.json(apps[appIndex]);
});

// GET /api/profile
app.get('/api/profile', (req, res) => {
  const profile = readJsonFile(PROFILE_FILE, DEFAULT_PROFILE);
  res.json(profile);
});

// PUT /api/profile
app.put('/api/profile', (req, res) => {
  const updatedProfile = req.body;
  writeJsonFile(PROFILE_FILE, updatedProfile);
  res.json(updatedProfile);
});

// GET /api/notifications
app.get('/api/notifications', (req, res) => {
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  res.json(notifs);
});

// POST /api/notifications
app.post('/api/notifications', (req, res) => {
  const newNotif = req.body;
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  notifs.unshift(newNotif);
  writeJsonFile(NOTIFICATIONS_FILE, notifs);
  res.status(201).json(newNotif);
});

// PUT /api/notifications/read
app.put('/api/notifications/read', (req, res) => {
  const { id } = req.body;
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  if (id) {
    const notifIndex = notifs.findIndex(n => n.id === id);
    if (notifIndex !== -1) {
      notifs[notifIndex].isRead = true;
    }
  } else {
    notifs.forEach(n => { n.isRead = true; });
  }
  writeJsonFile(NOTIFICATIONS_FILE, notifs);
  res.json({ success: true });
});

// Vite Dev Server Middleware or Static Production Build setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
