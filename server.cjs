var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var JOBS_FILE = import_path.default.join(DATA_DIR, "jobs.json");
var APPLICATIONS_FILE = import_path.default.join(DATA_DIR, "applications.json");
var PROFILE_FILE = import_path.default.join(DATA_DIR, "profile.json");
var NOTIFICATIONS_FILE = import_path.default.join(DATA_DIR, "notifications.json");
if (!import_fs.default.existsSync(DATA_DIR)) {
  import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
}
var INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Senior Frontend React Developer",
    company: "Gjirafa Inc.",
    logo: "GJ",
    city: "Prishtin\xEB",
    category: "Teknologji & Programim",
    type: "Koh\xEB e plot\xEB",
    salary: "2,200\u20AC - 3,000\u20AC",
    description: "Ne po k\xEBrkojm\xEB nj\xEB Senior Frontend Developer me p\xEBrvoj\xEB t\xEB thell\xEB n\xEB React, Tailwind CSS dhe TypeScript p\xEBr t\xEB udh\xEBhequr zhvillimin e produkteve tona t\xEB rradh\xEBs n\xEB tregun e Kosov\xEBs dhe rajonit.",
    requirements: [
      "Mbi 5 vite p\xEBrvoj\xEB pune me React dhe JavaScript/TypeScript.",
      "Njohuri t\xEB shk\xEBlqyera t\xEB HTML5, CSS3 dhe Tailwind CSS.",
      "P\xEBrvoj\xEB me state management (Redux, Zustand apo React Context).",
      "Njohuri n\xEB optimizimin e performanc\xEBs s\xEB aplikacioneve web."
    ],
    responsibilities: [
      "Zhvillimi i komponent\xEBve t\xEB rip\xEBrdorsh\xEBm me kod t\xEB past\xEBr dhe t\xEB testuesh\xEBm.",
      "Bashk\xEBpunimi magnetized me dizajner\xEBt UI/UX dhe inxhinier\xEBt backend.",
      "Mentorimi i an\xEBtar\xEBve junior t\xEB ekipit ton\xEB.",
      "P\xEBrmir\xEBsimi i vazhduesh\xEBm i arkitektur\xEBs frontend."
    ],
    postedAt: "2026-06-28T10:00:00.000Z",
    isFeatured: true
  },
  {
    id: "job-2",
    title: "UI/UX Designer",
    company: "Radix",
    logo: "RX",
    city: "Prishtin\xEB",
    category: "Dizajn & Kreativitet",
    type: "Pun\xEB nga sht\xEBpia",
    salary: "1,400\u20AC - 1,800\u20AC",
    description: "Radix k\xEBrkon nj\xEB UI/UX Designer pasionant q\xEB do t\xEB marr\xEB p\xEBrgjegj\xEBsin\xEB p\xEBr krijimin e eksperiencave t\xEB shk\xEBlqyera digjitale p\xEBr klient\xEBt tan\xEB nd\xEBrkomb\xEBtar\xEB.",
    requirements: [
      "P\xEBrvoj\xEB e d\xEBshmuar si UI/UX Designer me nj\xEB portfolio t\xEB pasur.",
      "Zot\xEBrim i shk\xEBlqyer i Figma, Adobe XD dhe Illustrator.",
      "Kuptueshm\xEBri e lart\xEB e parimeve t\xEB User-Centered Design.",
      "Aft\xEBsi t\xEB shk\xEBlqyera komunikimi n\xEB gjuh\xEBn angleze."
    ],
    responsibilities: [
      "Krijimi i wireframes, prototipeve dhe dizajneve p\xEBrfundimtare vizuale.",
      "K\xEBrkimi i p\xEBrdoruesve (user research) dhe testimi i prototipeve.",
      "P\xEBrcaktimi i sistemeve t\xEB dizajnit (Design Systems) t\xEB q\xEBndrueshme.",
      "Prezantimi i koncepteve tek pal\xEBt e interesuara."
    ],
    postedAt: "2026-06-27T14:30:00.000Z",
    isFeatured: true
  },
  {
    id: "job-3",
    title: "Menaxher i Marketingut Digjital",
    company: "Albi Group",
    logo: "AG",
    city: "Fush\xEB Kosov\xEB",
    category: "Marketing & Shitje",
    type: "Koh\xEB e plot\xEB",
    salary: "950\u20AC - 1,300\u20AC",
    description: "Albi Group k\xEBrkon nj\xEB profesionist kreativ p\xEBr t\xEB udh\xEBhequr fushatat tona t\xEB marketingut digjital, me fokus n\xEB rritjen e pranis\xEB son\xEB online dhe angazhimin e klient\xEBve.",
    requirements: [
      "Diplom\xEB Fakulteti n\xEB Marketing apo fusha t\xEB ngjashme.",
      "Mbi 2 vite p\xEBrvoj\xEB pune n\xEB menaxhimin e rrjeteve sociale dhe fushatave me pages\xEB.",
      "P\xEBrvoj\xEB me Google Ads, Meta Business Suite dhe Google Analytics.",
      "Shkatht\xEBsi t\xEB larta n\xEB shkrimin e p\xEBrmbajtjes (copywriting) n\xEB gjuh\xEBn shqipe."
    ],
    responsibilities: [
      "Planifikimi dhe ekzekutimi i strategjis\xEB s\xEB marketingut digjital.",
      "Monitorimi dhe raportimi i performanc\xEBs s\xEB fushatave reklamuese.",
      "Krijimi i p\xEBrmbajtjes vizuale dhe tekstuale p\xEBr rrjete sociale.",
      "Bashk\xEBpunimi me ekipe t\xEB ndryshme p\xEBr promovimin e produkteve t\xEB reja."
    ],
    postedAt: "2026-06-26T09:15:00.000Z",
    isFeatured: false
  },
  {
    id: "job-4",
    title: "Praktikant n\xEB Departamentin e Financave",
    company: "NLB Banka",
    logo: "NL",
    city: "Prizren",
    category: "Financa & Banka",
    type: "Praktik\xEB",
    salary: "350\u20AC - 450\u20AC",
    description: "NLB Banka hap dyert p\xEBr student\xEBt apo t\xEB sapodiplomuarit e fush\xEBs s\xEB Ekonomis\xEB p\xEBr nj\xEB praktik\xEB 6-mujore me mund\xEBsi pun\xEBsimi t\xEB rregullt pas p\xEBrfundimit.",
    requirements: [
      "Student i vitit t\xEB fundit apo i sapodiplomuar n\xEB Fakultetin Ekonomik.",
      "Njohuri t\xEB mira t\xEB pun\xEBs me kompjuter (MS Excel).",
      "Persona t\xEB organizuar, t\xEB sakt\xEB dhe t\xEB gatsh\xEBm p\xEBr t\xEB m\xEBsuar.",
      "Njohja e gjuh\xEBs angleze \xEBsht\xEB p\xEBrpar\xEBsi."
    ],
    responsibilities: [
      "Asistimi n\xEB p\xEBrgatitjen e raporteve ditore financiare.",
      "Regjistrimi dhe verifikimi i transaksioneve sipas procedurave t\xEB bank\xEBs.",
      "Mb\xEBshtetja administrative e departamentit t\xEB financave.",
      "Pjes\xEBmarrja n\xEB trajnime t\xEB organizuara nga banka."
    ],
    postedAt: "2026-06-25T11:00:00.000Z",
    isFeatured: false
  }
];
var DEFAULT_PROFILE = {
  name: "Lirim Kastrati",
  title: "Full Stack Web Developer",
  email: "lirim.kastrati@email.com",
  phone: "+383 44 123 456",
  bio: "Developer i pasionuar me p\xEBrvoj\xEB 3 vje\xE7are n\xEB krijimin e aplikacioneve moderne me React, Node.js dhe Tailwind CSS. Me seli n\xEB Prishtin\xEB, i gatsh\xEBm p\xEBr projekte inovative.",
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "SQL", "Git"],
  preferredCity: "Prishtin\xEB",
  preferredCategory: "Teknologji & Programim",
  preferredType: "Koh\xEB e plot\xEB"
};
var INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Pun\xEB e re e p\xEBrshtatshme!",
    message: 'Gjirafa Inc. ka postuar nj\xEB pozit\xEB t\xEB re: "Senior Frontend React Developer" n\xEB Prishtin\xEB q\xEB p\xEBrputhet me preferencat tuaja.',
    time: "Para 10 minutash",
    isRead: false,
    type: "job_match",
    linkJobId: "job-1"
  }
];
function readJsonFile(filePath, defaultValue) {
  try {
    if (!import_fs.default.existsSync(filePath)) {
      import_fs.default.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
      return defaultValue;
    }
    const content = import_fs.default.readFileSync(filePath, "utf-8");
    if (!content.trim()) return defaultValue;
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}
function writeJsonFile(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`;
    import_fs.default.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    import_fs.default.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}
app.use(import_express.default.json());
app.get("/api/jobs", (req, res) => {
  const jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  res.json(jobs);
});
app.post("/api/jobs", (req, res) => {
  const newJob = req.body;
  if (!newJob.title || !newJob.company) {
    return res.status(400).json({ error: 'Fusha "title" dhe "company" jan\xEB t\xEB detyrueshme.' });
  }
  const jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  jobs.unshift(newJob);
  writeJsonFile(JOBS_FILE, jobs);
  res.status(201).json(newJob);
});
app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  let jobs = readJsonFile(JOBS_FILE, INITIAL_JOBS);
  const exists = jobs.some((j) => j.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Pozita nuk u gjet." });
  }
  jobs = jobs.filter((j) => j.id !== id);
  writeJsonFile(JOBS_FILE, jobs);
  res.json({ success: true });
});
app.get("/api/applications", (req, res) => {
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  res.json(apps);
});
app.post("/api/applications", (req, res) => {
  const newApp = req.body;
  if (!newApp.jobId || !newApp.candidateName || !newApp.candidateEmail) {
    return res.status(400).json({ error: "T\xEB dh\xEBnat e aplikimit jan\xEB t\xEB mang\xEBta." });
  }
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  apps.unshift(newApp);
  writeJsonFile(APPLICATIONS_FILE, apps);
  res.status(201).json(newApp);
});
app.put("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const apps = readJsonFile(APPLICATIONS_FILE, []);
  const appIndex = apps.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Aplikimi nuk u gjet." });
  }
  apps[appIndex].status = status;
  writeJsonFile(APPLICATIONS_FILE, apps);
  res.json(apps[appIndex]);
});
app.get("/api/profile", (req, res) => {
  const profile = readJsonFile(PROFILE_FILE, DEFAULT_PROFILE);
  res.json(profile);
});
app.put("/api/profile", (req, res) => {
  const updatedProfile = req.body;
  writeJsonFile(PROFILE_FILE, updatedProfile);
  res.json(updatedProfile);
});
app.get("/api/notifications", (req, res) => {
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  res.json(notifs);
});
app.post("/api/notifications", (req, res) => {
  const newNotif = req.body;
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  notifs.unshift(newNotif);
  writeJsonFile(NOTIFICATIONS_FILE, notifs);
  res.status(201).json(newNotif);
});
app.put("/api/notifications/read", (req, res) => {
  const { id } = req.body;
  const notifs = readJsonFile(NOTIFICATIONS_FILE, INITIAL_NOTIFICATIONS);
  if (id) {
    const notifIndex = notifs.findIndex((n) => n.id === id);
    if (notifIndex !== -1) {
      notifs[notifIndex].isRead = true;
    }
  } else {
    notifs.forEach((n) => {
      n.isRead = true;
    });
  }
  writeJsonFile(NOTIFICATIONS_FILE, notifs);
  res.json({ success: true });
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
