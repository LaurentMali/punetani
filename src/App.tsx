import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Job, Application, UserProfile, Notification } from './types';
import { INITIAL_JOBS, POPULAR_CATEGORIES, POPULAR_CITIES, DEFAULT_PROFILE, INITIAL_NOTIFICATIONS } from './mockData';

// Dynamic Category Icon Resolver using Lucide Icons
const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Briefcase className={className} />;
  return <IconComponent className={className} />;
};

export default function App() {
  // --- Persistent States (with database and localStorage sync) ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('punetani_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- UI Control States ---
  const [currentTab, setCurrentTab] = useState<'home' | 'jobs' | 'recruiter' | 'profile'>('home');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchTypes, setSearchTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'salary_desc'>('newest');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  // Navigation & Dropdown states
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sub-tabs
  const [activeRecruiterSubTab, setActiveRecruiterSubTab] = useState<'jobs' | 'applications' | 'post'>('jobs');
  const [activeProfileSubTab, setActiveProfileSubTab] = useState<'saved' | 'applications'>('saved');

  // Application Form Inside Job Detail
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState('');

  // Post Job Form
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobCity, setNewJobCity] = useState('Prishtinë');
  const [newJobCategory, setNewJobCategory] = useState('Teknologji & Programim');
  const [newJobType, setNewJobType] = useState<Job['type']>('Kohë e plotë');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobRequirements, setNewJobRequirements] = useState('');
  const [newJobResponsibilities, setNewJobResponsibilities] = useState('');

  // Toast Alerts State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- Synchronization & Database Fetching ---
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        const [jobsRes, appsRes, profileRes, notifsRes] = await Promise.all([
          fetch('/api/jobs').then((r) => r.json()),
          fetch('/api/applications').then((r) => r.json()),
          fetch('/api/profile').then((r) => r.json()),
          fetch('/api/notifications').then((r) => r.json()),
        ]);
        setJobs(jobsRes);
        setApplications(appsRes);
        setProfile(profileRes);
        setNotifications(notifsRes);
        if (jobsRes.length > 0) {
          setSelectedJobId(jobsRes[0].id);
        }
      } catch (err) {
        console.error('Error fetching database data:', err);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadDatabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('punetani_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Show a temporary toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Matching Notification Engine ---
  // When applicant profile preferences or jobs change, scan for matching unnotified positions
  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const savedProfile = await res.json();
      setProfile(savedProfile);
      showToast('Profili juaj u ruajt me sukses!', 'success');

      // Simulated scanner: Check if there are existing jobs matching the new preferences
      const matches = jobs.filter(
        (j) =>
          j.city.toLowerCase() === savedProfile.preferredCity.toLowerCase() ||
          j.category.toLowerCase() === savedProfile.preferredCategory.toLowerCase()
      );

      if (matches.length > 0) {
        const randomJob = matches[Math.floor(Math.random() * matches.length)];
        const newNotif: Notification = {
          id: `notif-dyn-${Date.now()}`,
          title: 'Pozitë e re e përshtatshme për profilin tuaj!',
          message: `${randomJob.company} po kërkon "${randomJob.title}" në ${randomJob.city}. Kliko për ta shqyrtuar.`,
          time: 'Tani',
          isRead: false,
          type: 'job_match',
          linkJobId: randomJob.id,
        };
        
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNotif),
        });

        setNotifications((prev) => [newNotif, ...prev]);
        showToast('Kemi gjetur pozita pune që përshtaten me profilin tuaj!', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Gabim gjatë përditësimit të profilit!', 'error');
    }
  };

  // --- Filter and Sort Engine ---
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesTitle =
          job.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTitle.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTitle.toLowerCase());
        const matchesCity = searchCity === '' || job.city.toLowerCase() === searchCity.toLowerCase();
        const matchesCategory =
          searchCategory === '' || job.category.toLowerCase() === searchCategory.toLowerCase();
        const matchesType = searchTypes.length === 0 || searchTypes.includes(job.type);
        const matchesBookmark = !showBookmarksOnly || bookmarks.includes(job.id);

        return matchesTitle && matchesCity && matchesCategory && matchesType && matchesBookmark;
      })
      .sort((a, b) => {
        if (sortBy === 'salary_desc') {
          // Parse first number in salary
          const valA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
          const valB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
          return valB - valA;
        }
        // Default newest
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
  }, [jobs, searchTitle, searchCity, searchCategory, searchTypes, showBookmarksOnly, bookmarks, sortBy]);

  // Handle category tile click from Home
  const handleCategorySelect = (categoryName: string) => {
    setSearchCategory(categoryName);
    setCurrentTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle city tile click from Home
  const handleCitySelect = (cityName: string) => {
    setSearchCity(cityName);
    setCurrentTab('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle saved status
  const toggleBookmark = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => {
      const isBookmarked = prev.includes(jobId);
      if (isBookmarked) {
        showToast('Pozita u largua nga të ruajturat', 'info');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('Pozita u ruajt me sukses!', 'success');
        return [...prev, jobId];
      }
    });
  };

  // --- Submit Application Action ---
  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyEmail || !applyPhone) {
      showToast('Ju lutem plotësoni fushat e detyrueshme!', 'error');
      return;
    }

    const currentJob = jobs.find((j) => j.id === selectedJobId);
    if (!currentJob) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: currentJob.id,
      jobTitle: currentJob.title,
      company: currentJob.company,
      candidateName: applyName,
      candidateEmail: applyEmail,
      candidatePhone: applyPhone,
      coverLetter: applyCoverLetter,
      status: 'Në pritje',
      appliedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      if (!res.ok) throw new Error('Aplikimi dështoi');
      const savedApp = await res.json();
      setApplications((prev) => [savedApp, ...prev]);
      showToast('Aplikimi juaj u dërgua me sukses!', 'success');
      setShowApplyForm(false);
      
      // Reset fields
      setApplyName('');
      setApplyEmail('');
      setApplyPhone('');
      setApplyCoverLetter('');
      setUploadedResumeName('');
    } catch (err) {
      console.error(err);
      showToast('Gabim gjatë dërgimit të aplikimit!', 'error');
    }
  };

  // --- Recruiter: Create Job Action ---
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany || !newJobSalary || !newJobDescription) {
      showToast('Ju lutem plotësoni të gjitha fushat kryesore!', 'error');
      return;
    }

    const createdJob: Job = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      company: newJobCompany,
      logo: newJobCompany.substring(0, 2).toUpperCase(),
      city: newJobCity,
      category: newJobCategory,
      type: newJobType,
      salary: newJobSalary,
      description: newJobDescription,
      requirements: newJobRequirements.split('\n').filter((r) => r.trim() !== ''),
      responsibilities: newJobResponsibilities.split('\n').filter((r) => r.trim() !== ''),
      postedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdJob)
      });
      if (!res.ok) throw new Error('Failed to create job');
      const savedJob = await res.json();
      setJobs((prev) => [savedJob, ...prev]);
      showToast('Shpallja e punës u publikua me sukses!', 'success');
      
      // Auto matching check for candidates
      if (
        profile.preferredCity.toLowerCase() === newJobCity.toLowerCase() ||
        profile.preferredCategory.toLowerCase() === newJobCategory.toLowerCase()
      ) {
        const matchNotif: Notification = {
          id: `notif-match-${Date.now()}`,
          title: 'Punë e re përputhet me profilin tënd!',
          message: `${newJobCompany} ka shpallur "${newJobTitle}" në ${newJobCity}. Shiko tani!`,
          time: 'Tani',
          isRead: false,
          type: 'job_match',
          linkJobId: savedJob.id,
        };
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchNotif)
        });
        setNotifications((prev) => [matchNotif, ...prev]);
      }

      // Reset Form
      setNewJobTitle('');
      setNewJobCompany('');
      setNewJobSalary('');
      setNewJobDescription('');
      setNewJobRequirements('');
      setNewJobResponsibilities('');
      
      // Go to recruiter active jobs list
      setActiveRecruiterSubTab('jobs');
    } catch (err) {
      console.error(err);
      showToast('Gabim gjatë krijimit të shpalljes së punës!', 'error');
    }
  };

  // --- Recruiter: Handle Application Review ---
  const updateApplicationStatus = async (appId: string, status: Application['status']) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedApp = await res.json();
      
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? updatedApp : app))
      );

      // Create notification
      const statusNotif: Notification = {
        id: `notif-app-${Date.now()}`,
        title: `Statusi i aplikimit në ${updatedApp.company}`,
        message: `Aplikimi juaj për "${updatedApp.jobTitle}" është shënuar si: "${status}".`,
        time: 'Tani',
        isRead: false,
        type: 'application_status',
        linkJobId: updatedApp.jobId,
      };

      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusNotif),
      });

      setNotifications((prev) => [statusNotif, ...prev]);
      showToast(`Statusi i aplikimit u përditësua në: ${status}`, status === 'Pranuar' ? 'success' : 'info');
    } catch (err) {
      console.error(err);
      showToast('Gabim gjatë përditësimit të statusit!', 'error');
    }
  };

  // Dynamic notification handler click
  const handleNotifClick = async (notif: Notification) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notif.id })
      });
      // Mark as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setShowNotifDropdown(false);
      
      if (notif.linkJobId) {
        setSelectedJobId(notif.linkJobId);
        setCurrentTab('jobs');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotifsRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('Të gjitha njoftimet u shënuan si të lexuara', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Counts
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const activeJobObject = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased" id="punetani-root">
      
      {/* --- TOAST NOTIFICATION CONTAINER --- */}
      {toast && (
        <div 
          id="global-toast" 
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-fade-in-up ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-emerald-100/40' 
              : toast.type === 'error'
              ? 'bg-rose-50 border-rose-100 text-rose-800 shadow-rose-100/40'
              : 'bg-blue-50 border-blue-100 text-blue-800 shadow-blue-100/40'
          }`}
        >
          {toast.type === 'success' && <Icons.CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <Icons.XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Icons.Info className="w-5 h-5 text-blue-600 shrink-0" />}
          <span className="text-sm font-semibold tracking-tight">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- PREMIUM HEADER --- */}
      <header id="punetani-header" className="backdrop-blur-md bg-[#0B2545]/95 sticky top-0 z-50 shadow-lg border-b border-[#134074]/55">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentTab('home')}>
              <div className="w-10.5 h-10.5 bg-[#FF5E00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5E00]/30 group-hover:scale-105 transition-transform duration-300">
                <Icons.Search className="w-5.5 h-5.5 text-white stroke-[3px]" />
              </div>
              <div className="text-left">
                <span className="text-2.5xl font-display font-bold tracking-tight text-white leading-none block">
                  Punë<span className="text-[#FF5E00]">Tani</span>
                </span>
                <span className="block text-[8.5px] text-slate-300 font-bold tracking-widest uppercase mt-0.5 font-mono">
                  KOSOVO JOB PORTAL
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5 bg-[#07162c] p-1 rounded-xl border border-[#134074]/30">
              <button
                id="nav-home"
                onClick={() => setCurrentTab('home')}
                className={`px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentTab === 'home' 
                    ? 'text-[#FF5E00] bg-[#134074]/70 border border-[#134074]/50 shadow-inner' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Ballina
              </button>
              <button
                id="nav-jobs"
                onClick={() => { setCurrentTab('jobs'); setShowBookmarksOnly(false); }}
                className={`px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentTab === 'jobs' 
                    ? 'text-[#FF5E00] bg-[#134074]/70 border border-[#134074]/50 shadow-inner' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Kërko Punë
              </button>
              <button
                id="nav-recruiter"
                onClick={() => setCurrentTab('recruiter')}
                className={`px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentTab === 'recruiter' 
                    ? 'text-[#FF5E00] bg-[#134074]/70 border border-[#134074]/50 shadow-inner' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard Recruiter
              </button>
              <button
                id="nav-profile"
                onClick={() => setCurrentTab('profile')}
                className={`px-4.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentTab === 'profile' 
                    ? 'text-[#FF5E00] bg-[#134074]/70 border border-[#134074]/50 shadow-inner' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Profili im
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Notification System Button */}
              <div className="relative">
                <button
                  id="notif-btn"
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-3 rounded-xl bg-[#134074]/50 text-slate-300 hover:text-white hover:bg-[#134074]/80 border border-[#134074]/30 transition-all relative cursor-pointer"
                  aria-label="Notification center"
                >
                  <Icons.Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5E00] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Drawer */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-3 w-100 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[99] overflow-hidden text-slate-800 animate-fade-in-up">
                    <div className="px-5 py-4 bg-[#0B2545] text-white flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Icons.Bell className="w-4 h-4 text-[#FF5E00]" />
                        <h4 className="font-display font-bold text-sm">Njoftimet ({unreadNotifsCount} të reja)</h4>
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button onClick={markAllNotifsRead} className="text-xs text-[#FF5E00] hover:text-[#E05200] hover:underline font-semibold cursor-pointer">
                          Shëno të gjitha si të lexuara
                        </button>
                      )}
                    </div>
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                          <Icons.BellOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          Nuk ka njoftime të reja.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`p-4.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                              !notif.isRead ? 'bg-blue-50/40 border-l-4 border-[#FF5E00]' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2 font-mono">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                            {notif.linkJobId && (
                              <span className="inline-flex items-center text-[10.5px] text-[#FF5E00] font-bold mt-1.5 hover:underline">
                                Shiko Detajet <Icons.ChevronRight className="w-3 h-3 ml-0.5" />
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <span className="text-[10px] text-slate-500 font-bold tracking-wide font-mono uppercase">PunëTani Match Engine</span>
                    </div>
                  </div>
                )}
              </div>

              {/* POST A JOB - HERMES ORANGE BUTTON */}
              <button
                id="header-post-job"
                onClick={() => {
                  setCurrentTab('recruiter');
                  setActiveRecruiterSubTab('post');
                }}
                className="bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md shadow-[#FF5E00]/25 hover:shadow-lg hover:shadow-[#FF5E00]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <Icons.PlusCircle className="w-4 h-4" />
                Posto një Punë
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex items-center md:hidden gap-3">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2.5 rounded-lg bg-[#134074]/50 text-slate-300 relative"
              >
                <Icons.Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FF5E00] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-lg bg-[#134074]/50 text-slate-300 hover:text-white"
                aria-label="Toggle mobile navigation menu"
              >
                {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-[#0B2545] border-t border-[#134074]/50 py-4 px-4 space-y-2 text-left">
            <button
              onClick={() => { setCurrentTab('home'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold block ${
                currentTab === 'home' ? 'bg-[#FF5E00] text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Ballina
            </button>
            <button
              onClick={() => { setCurrentTab('jobs'); setShowBookmarksOnly(false); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold block ${
                currentTab === 'jobs' ? 'bg-[#FF5E00] text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Kërko Punë
            </button>
            <button
              onClick={() => { setCurrentTab('recruiter'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold block ${
                currentTab === 'recruiter' ? 'bg-[#FF5E00] text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Dashboard Recruiter
            </button>
            <button
              onClick={() => { setCurrentTab('profile'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold block ${
                currentTab === 'profile' ? 'bg-[#FF5E00] text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Profili im
            </button>
            <div className="pt-4 border-t border-[#134074]/50">
              <button
                onClick={() => {
                  setCurrentTab('recruiter');
                  setActiveRecruiterSubTab('post');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-[#FF5E00] hover:bg-[#E05200] text-white font-bold text-center py-3 rounded-lg block cursor-pointer"
              >
                Posto një Punë
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- CORE VIEWS CONTENT --- */}
      <main className="flex-grow animate-fade-in-up">
        
        {/* ==================== 1. HOME VIEW ==================== */}
        {currentTab === 'home' && (
          <div className="space-y-16 pb-16">
            
            {/* Premium Hero Gradient Section with Sleek Glass Search Console */}
            <section id="hero-section" className="bg-gradient-to-br from-[#0B2545] via-[#003366] to-[#134074] text-white py-24 px-4 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
              {/* Luxury radial glow decorative blobs */}
              <div className="absolute top-0 right-0 w-110 h-110 bg-[#FF5E00]/15 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>
              
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="bg-[#07162c]/75 text-[#FF5E00] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-[#134074]/50 inline-block mb-5 font-mono shadow-inner">
                  🚀 PLATFORMA MË PROGRESIVE NË KOSOVË
                </span>
                
                <h1 className="text-4xl md:text-6.5xl font-display font-bold tracking-tight leading-[1.05] mb-6">
                  Gjej mundësinë tënde <br />
                  në <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF5E00] font-bold">Kosovë</span>
                </h1>
                
                <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-sans">
                  Lidhu me liderët e tregut si Gjirafa, NLB, Radix dhe Kosbit. Eksploro shpallje pune të përditësuara në sekonda.
                </p>

                {/* Advanced Quick Search Console */}
                <div className="bg-white p-3.5 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-100 text-slate-800 max-w-3xl mx-auto text-left transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                    
                    {/* Position Input */}
                    <div className="md:col-span-5 flex items-center gap-3 px-3 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0">
                      <Icons.Search className="w-5 h-5 text-[#FF5E00] shrink-0" />
                      <input
                        id="hero-search-input"
                        type="text"
                        placeholder="Pozita, teknologjia apo kompania..."
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold placeholder:text-slate-400"
                      />
                    </div>

                    {/* City Select Input */}
                    <div className="md:col-span-4 flex items-center gap-3 px-3 pb-3 md:pb-0">
                      <Icons.MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                      <select
                        id="hero-city-select"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold cursor-pointer"
                      >
                        <option value="">Të gjitha qytetet</option>
                        {POPULAR_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Submit Search Button */}
                    <div className="md:col-span-3">
                      <button
                        id="hero-submit-btn"
                        onClick={() => setCurrentTab('jobs')}
                        className="w-full bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl md:rounded-2xl shadow-lg shadow-[#FF5E00]/30 hover:shadow-xl hover:shadow-[#FF5E00]/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Icons.Search className="w-4 h-4" />
                        Kërko Punë
                      </button>
                    </div>

                  </div>
                </div>

                {/* Instant Checkboxes */}
                <div className="flex flex-wrap justify-center gap-3 mt-10 text-xs font-bold text-slate-300">
                  {['Kohë e plotë', 'Kohë e pjesshme', 'Punë nga shtëpia', 'Praktikë'].map((type) => {
                    const isChecked = searchTypes.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2 cursor-pointer bg-[#07162c]/50 border border-[#134074]/45 hover:border-[#FF5E00] hover:bg-[#07162c]/85 px-4.5 py-2.5 rounded-full transition-all duration-300 shadow-sm select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSearchTypes(searchTypes.filter((t) => t !== type));
                            } else {
                              setSearchTypes([...searchTypes, type]);
                            }
                          }}
                          className="accent-[#FF5E00] w-4 h-4 cursor-pointer"
                        />
                        <span className="font-sans font-semibold text-slate-200">{type}</span>
                      </label>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* ==================== TILE-LIKE POPULAR CATEGORIES ==================== */}
            <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center md:text-left mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3.5xl font-display font-bold text-slate-900 leading-none">
                    Eksploro sipas <span className="text-[#FF5E00]">Kategorive</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-2.5 font-sans">Zgjidhni njërën nga kachelat interaktive për të filtruar menjëherë punët</p>
                </div>
                <button
                  onClick={() => { setSearchCategory(''); setCurrentTab('jobs'); }}
                  className="text-xs font-display font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 flex items-center gap-1.5 self-center cursor-pointer hover:underline"
                >
                  Shiko të gjitha kategoritë <Icons.ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of 8 Beautiful Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4.5">
                {POPULAR_CATEGORIES.map((cat) => {
                  const isSelected = searchCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`group p-6 rounded-2xl text-left transition-all duration-300 border transform hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between min-h-[145px] cursor-pointer ${
                        isSelected 
                          ? 'bg-[#0B2545] border-[#FF5E00] shadow-[#FF5E00]/10 shadow-lg text-white' 
                          : 'bg-white border-slate-100 hover:border-[#134074]/30 shadow-sm text-slate-800'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#FF5E00] text-white' 
                          : 'bg-slate-50 text-blue-600 group-hover:bg-[#FF5E00] group-hover:text-white group-hover:scale-110'
                      }`}>
                        <CategoryIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      
                      <div className="mt-4">
                        <h4 className={`font-display font-bold text-sm tracking-tight group-hover:text-[#FF5E00] transition-colors line-clamp-1 ${
                          isSelected ? 'text-[#FF5E00]' : 'text-slate-900'
                        }`}>
                          {cat.name}
                        </h4>
                        <span className={`text-[11px] mt-1.5 block font-mono font-bold uppercase tracking-wider ${
                          isSelected ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                          {cat.count} pozita
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ==================== TILE-LIKE KOSOVO CITIES ==================== */}
            <section id="cities-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center md:text-left mb-10">
                <h2 className="text-2xl md:text-3.5xl font-display font-bold text-slate-900 leading-none">
                  Punë sipas <span className="text-blue-600">Qyteteve</span> kryesore
                </h2>
                <p className="text-sm text-slate-500 mt-2.5 font-sans">Ku dëshironi të punoni? Klikoni mbi qytet për të hapur shpalljet aktive.</p>
              </div>

              {/* Grid of Cities Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4.5">
                {POPULAR_CITIES.map((city) => {
                  const isSelected = searchCity === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className={`group relative overflow-hidden rounded-2xl h-30 flex flex-col justify-end p-4 text-left transition-all duration-300 border cursor-pointer hover:shadow-xl ${
                        isSelected 
                          ? 'border-[#FF5E00] ring-2 ring-[#FF5E00]/40 shadow-lg shadow-[#FF5E00]/10' 
                          : 'border-slate-100 hover:border-[#134074]/30'
                      }`}
                    >
                      {/* background fallback color gradient and image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-slate-950/50 to-transparent z-10"></div>
                      <img
                        src={city.img}
                        alt={city.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Text details */}
                      <div className="relative z-20 text-white text-left">
                        <span className="font-display font-bold text-sm block tracking-tight text-white group-hover:text-[#FF5E00] transition-colors leading-none">
                          {city.name}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono font-bold block mt-1">
                          {city.count} shpallje
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ==================== FEATURED JOBS SECTION ==================== */}
            <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3.5xl font-display font-bold text-slate-900 leading-none">
                    Pozitat më të <span className="text-[#FF5E00]">Kërkuara</span> të Javës
                  </h2>
                  <p className="text-sm text-slate-500 mt-2.5 font-sans">Kompanitë më prestigjioze që po rekrutojnë pikërisht sot</p>
                </div>
                <button
                  onClick={() => {
                    setSearchTitle('');
                    setSearchCity('');
                    setSearchCategory('');
                    setSearchTypes([]);
                    setShowBookmarksOnly(false);
                    setCurrentTab('jobs');
                  }}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-display font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  Kërko të gjitha vendet e punës <Icons.ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
                {jobs.slice(0, 3).map((job) => {
                  const isBookmarked = bookmarks.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentTab('jobs');
                      }}
                      className="bg-white border border-slate-100 hover:border-slate-200/80 p-6.5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative cursor-pointer"
                    >
                      {/* Premium Badge & Save Option */}
                      <div className="flex justify-between items-start mb-5">
                        <span className="bg-amber-50 text-amber-700 text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                          <Icons.Award className="w-3.5 h-3.5 text-amber-500" /> REKOMANDUAR
                        </span>
                        
                        {/* STAR LESEZEICHEN BUTTON */}
                        <button
                          onClick={(e) => toggleBookmark(job.id, e)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isBookmarked 
                              ? 'bg-[#FF5E00]/10 text-[#FF5E00]' 
                              : 'bg-slate-50 text-slate-400 hover:text-[#FF5E00] hover:bg-slate-100'
                          }`}
                          aria-label="Save this job"
                        >
                          <Icons.Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Header info */}
                      <div className="flex gap-3.5 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-display font-bold text-base shrink-0 shadow-md">
                          {job.logo}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-[#FF5E00] transition-colors line-clamp-1">{job.title}</h4>
                          <span className="text-xs font-bold text-slate-500 block mt-1 font-sans">{job.company}</span>
                        </div>
                      </div>

                      {/* Info Chips */}
                      <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100/50">
                          <Icons.MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-sans">{job.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100/50">
                          <Icons.DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono truncate font-bold text-slate-700">{job.salary}</span>
                        </div>
                      </div>

                      {/* Footer type & apply trigger */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="bg-[#0B2545] text-white text-[9px] font-mono font-bold tracking-wide uppercase px-2.5 py-1 rounded-md">
                          {job.type}
                        </span>
                        
                        <span className="text-xs font-display font-bold text-[#FF5E00] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Apliko Tani <Icons.ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* ==================== 2. JOBS SEARCH ENGINE VIEW ==================== */}
        {currentTab === 'jobs' && (
          <div className="bg-slate-50/50 py-10" id="jobs-search-module">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Floating Filter Quick Actions Panel on Mobile */}
              <div className="md:hidden mb-4 flex gap-2">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex-grow bg-[#0B2545] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Icons.Filter className="w-4 h-4 text-[#FF5E00]" /> Filtro Shpalljet
                </button>
                {showBookmarksOnly && (
                  <button
                    onClick={() => setShowBookmarksOnly(false)}
                    className="bg-[#FF5E00] text-white font-display font-semibold text-xs uppercase tracking-wider px-4 rounded-xl flex items-center justify-center shadow-md cursor-pointer"
                  >
                    Të Ruajturat <Icons.X className="w-4 h-4 ml-1.5" />
                  </button>
                )}
              </div>

              {/* Main Two-Column Dynamic Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDEBAR: ADVANCED SEARCH FILTERS (HIDDEN ON MOBILE EXCEPT IN DRAWER) */}
                <aside className={`lg:col-span-4 bg-white p-6.5 rounded-2xl shadow-sm border border-slate-100 space-y-6.5 ${
                   isMobileFiltersOpen ? 'fixed inset-0 z-[100] overflow-y-auto block p-8 bg-white' : 'hidden lg:block'
                }`}>
                  
                  {/* Mobile Drawer Header */}
                  <div className="flex justify-between items-center lg:hidden pb-4 border-b border-slate-100">
                    <h3 className="font-display font-bold text-lg text-slate-900">Filtro kërkimin</h3>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-slate-100 rounded-full cursor-pointer">
                      <Icons.X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-sm tracking-tight mb-4.5 flex items-center gap-2">
                      <Icons.Filter className="w-4 h-4 text-[#FF5E00]" /> Filtra të avancuar
                    </h3>
                    <div className="h-0.5 bg-slate-50 w-full mb-4.5"></div>
                  </div>

                  {/* Text search input */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Fjala kyçe (Kërko)</label>
                    <div className="flex items-center gap-2.5 px-3 py-3 bg-slate-50/50 border border-slate-100/90 rounded-xl focus-within:border-[#FF5E00] transition-all">
                      <Icons.Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Titulli, kompania..."
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold placeholder:text-slate-400"
                      />
                      {searchTitle && (
                        <button onClick={() => setSearchTitle('')} className="cursor-pointer">
                          <Icons.X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* City search select */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Qyteti (Kosovo)</label>
                    <div className="flex items-center gap-2.5 px-3 py-3 bg-slate-50/50 border border-slate-100/90 rounded-xl focus-within:border-blue-500 transition-all">
                      <Icons.MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <select
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold cursor-pointer"
                      >
                        <option value="">Të gjitha qytetet</option>
                        {POPULAR_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category select */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Sektori / Kategoria</label>
                    <div className="flex items-center gap-2.5 px-3 py-3 bg-slate-50/50 border border-slate-100/90 rounded-xl focus-within:border-blue-500 transition-all">
                      <Icons.Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                      <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold cursor-pointer"
                      >
                        <option value="">Të gjitha kategoritë</option>
                        {POPULAR_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Job Type Checkboxes */}
                  <div className="space-y-3.5 text-left">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Orari / Lloji i punës</label>
                    <div className="space-y-3">
                      {['Kohë e plotë', 'Kohë e pjesshme', 'Punë nga shtëpia', 'Praktikë'].map((type) => {
                        const isChecked = searchTypes.includes(type);
                        return (
                          <label key={type} className="flex items-center gap-3 cursor-pointer group text-sm font-semibold text-slate-700 hover:text-slate-900 select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSearchTypes(searchTypes.filter((t) => t !== type));
                                } else {
                                  setSearchTypes([...searchTypes, type]);
                                }
                              }}
                              className="accent-[#FF5E00] w-4.5 h-4.5 rounded cursor-pointer"
                            />
                            <span className="font-sans text-slate-600 group-hover:text-slate-900">{type}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lesezeichen Filter Toggle */}
                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.Star className="w-4 h-4 text-[#FF5E00] fill-current" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Vetëm të ruajturat</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowBookmarksOnly(!showBookmarksOnly);
                        if (isMobileFiltersOpen) setIsMobileFiltersOpen(false);
                      }}
                      className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
                        showBookmarksOnly ? 'bg-[#FF5E00]' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all ${
                        showBookmarksOnly ? 'translate-x-5' : 'translate-x-0'
                      }`}></span>
                    </button>
                  </div>

                  {/* Clear Filter button */}
                  <button
                    onClick={() => {
                      setSearchTitle('');
                      setSearchCity('');
                      setSearchCategory('');
                      setSearchTypes([]);
                      setShowBookmarksOnly(false);
                      if (isMobileFiltersOpen) setIsMobileFiltersOpen(false);
                      showToast('Të gjithë filtrat u pastruan', 'info');
                    }}
                    className="w-full py-3 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 rounded-xl text-xs font-display font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors block text-center cursor-pointer"
                  >
                    Pastro të gjithë filtrat
                  </button>

                  {/* Mobile Save Button inside Drawer */}
                  {isMobileFiltersOpen && (
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="w-full bg-[#0B2545] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl block text-center cursor-pointer"
                    >
                      Aplikoni Filtrin ({filteredJobs.length} rezultate)
                    </button>
                  )}
                </aside>

                {/* MIDDLE & RIGHT AREA: SPLIT LIST + LIVE DETAILS VIEW */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* MIDDLE COLUMN: JOB TILES LIST */}
                  <section className="md:col-span-6 space-y-4">
                    
                    {/* Header showing results count & sorting */}
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Rezultati: <span className="text-slate-800 font-bold font-mono">{filteredJobs.length} pozita</span>
                      </span>
                      
                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-1.5">
                        <Icons.ArrowDownAZ className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-transparent focus:outline-none text-xs font-bold text-slate-600 cursor-pointer"
                        >
                          <option value="newest">Më të rejat</option>
                          <option value="salary_desc">Paga (Më e lartë)</option>
                        </select>
                      </div>
                    </div>

                    {/* Jobs Map list */}
                    <div className="space-y-3.5 max-h-[750px] overflow-y-auto pr-1 text-left">
                      {filteredJobs.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400">
                          <Icons.Search className="w-10 h-10 mx-auto mb-3 opacity-35 text-slate-300" />
                          <p className="font-display font-bold text-slate-800">Asnjë shpallje nuk u gjet</p>
                          <p className="text-xs mt-1.5 font-sans text-slate-400">Provoni të ndryshoni filtrat e kërkimit apo pastroni ato.</p>
                        </div>
                      ) : (
                        filteredJobs.map((job) => {
                          const isSelected = job.id === selectedJobId;
                          const isBookmarked = bookmarks.includes(job.id);
                          return (
                            <div
                              key={job.id}
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setShowApplyForm(false);
                              }}
                              className={`p-4.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative ${
                                isSelected
                                  ? 'bg-white border-[#FF5E00] shadow-md shadow-[#FF5E00]/5 ring-1 ring-[#FF5E00]'
                                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="w-10.5 h-10.5 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-sm">
                                  {job.logo}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="font-display font-bold text-sm text-slate-900 truncate leading-none mt-0.5">{job.title}</h4>
                                  <span className="text-xs font-semibold text-slate-400 block mt-1.5">{job.company}</span>
                                </div>
                                
                                {/* Save Quick Star */}
                                <button
                                  onClick={(e) => toggleBookmark(job.id, e)}
                                  className={`p-1.5 rounded-lg shrink-0 cursor-pointer transition-colors ${
                                    isBookmarked ? 'text-[#FF5E00]' : 'text-slate-300 hover:text-[#FF5E00]'
                                  }`}
                                >
                                  <Icons.Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                </button>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] text-slate-500 font-bold font-mono">
                                <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                                  {job.city}
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100">
                                  {job.type}
                                </span>
                                <span className="text-emerald-700 ml-auto font-mono font-bold text-[11px]">
                                  {job.salary}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </section>

                  {/* RIGHT COLUMN: RICH JOB DETAIL & DIRECT APPLY FLOW */}
                  <section className="md:col-span-6 bg-white p-6.5 rounded-2xl shadow-sm border border-slate-100 sticky top-24 self-start min-h-[500px]">
                    {activeJobObject ? (
                      <div className="space-y-6 text-left" id="job-detail-card">
                        
                        {/* Header Area */}
                        <div className="pb-4 border-b border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-blue-50 text-blue-700 text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                              PUNË E VERIFIKUAR
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono font-bold">
                              Postuar para pak ditësh
                            </span>
                          </div>

                          <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 bg-[#0B2545] text-white font-display font-bold text-lg flex items-center justify-center rounded-xl shadow">
                              {activeJobObject.logo}
                            </div>
                            <div>
                              <h2 className="text-xl font-display font-bold text-slate-900 leading-tight">{activeJobObject.title}</h2>
                              <span className="font-sans font-bold text-sm text-[#FF5E00] block mt-1">{activeJobObject.company}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Parameters Grid */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="p-3 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2.5">
                            <Icons.MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wide">Vendndodhja</span>
                              <span className="text-xs font-bold text-slate-800 font-sans">{activeJobObject.city}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2.5">
                            <Icons.DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wide">Paga Mujore</span>
                              <span className="text-xs font-bold text-slate-800 font-mono">{activeJobObject.salary}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2.5">
                            <Icons.Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wide">Orari / Lloji</span>
                              <span className="text-xs font-bold text-slate-800 font-sans">{activeJobObject.type}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50/55 rounded-xl border border-slate-100 flex items-center gap-2.5">
                            <Icons.Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wide">Sektori</span>
                              <span className="text-xs font-bold text-slate-800 truncate block max-w-[120px] font-sans">{activeJobObject.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* MAIN BUTTONS: APPLY & BOOKMARK */}
                        {!showApplyForm ? (
                          <div className="flex gap-3.5 pt-2">
                            <button
                              id="btn-apply-main"
                              onClick={() => {
                                // Prepopulate from candidate profile if present
                                setApplyName(profile.name);
                                setApplyEmail(profile.email);
                                setApplyPhone(profile.phone);
                                setShowApplyForm(true);
                              }}
                              className="flex-grow bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md shadow-[#FF5E00]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Icons.Send className="w-4 h-4" /> Apliko për këtë Punë
                            </button>
                            
                            <button
                              id="btn-bookmark-main"
                              onClick={() => toggleBookmark(activeJobObject.id)}
                              className={`px-4 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                                bookmarks.includes(activeJobObject.id)
                                  ? 'bg-[#FF5E00]/10 border-[#FF5E00] text-[#FF5E00]'
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                              title="Save Position"
                            >
                              <Icons.Star className={`w-5 h-5 ${bookmarks.includes(activeJobObject.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        ) : null}

                        {/* CONDITIONAL SUB-VIEW: INTERACTIVE APPLY FORM */}
                        {showApplyForm ? (
                          <form onSubmit={submitApplication} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4 animate-fade-in-up text-left">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                              <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 leading-none">
                                <Icons.Send className="w-4 h-4 text-[#FF5E00]" /> Formulari i Aplikimit
                              </h4>
                              <button
                                type="button"
                                onClick={() => setShowApplyForm(false)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 bg-white rounded-xl border border-slate-100 cursor-pointer shadow-sm"
                              >
                                <Icons.X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3.5 text-xs">
                              <div>
                                <label className="block text-slate-500 font-bold mb-1.5 font-sans">Emri & Mbiemri *</label>
                                <input
                                  type="text"
                                  required
                                  value={applyName}
                                  onChange={(e) => setApplyName(e.target.value)}
                                  placeholder="p.sh. Lirim Kastrati"
                                  className="w-full bg-white border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] transition-colors"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3.5">
                                <div>
                                  <label className="block text-slate-500 font-bold mb-1.5 font-sans">Email *</label>
                                  <input
                                    type="email"
                                    required
                                    value={applyEmail}
                                    onChange={(e) => setApplyEmail(e.target.value)}
                                    placeholder="lirim@email.com"
                                    className="w-full bg-white border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-500 font-bold mb-1.5 font-sans">Nr. Telefonit *</label>
                                  <input
                                    type="tel"
                                    required
                                    value={applyPhone}
                                    onChange={(e) => setApplyPhone(e.target.value)}
                                    placeholder="+383 44 123 456"
                                    className="w-full bg-white border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] transition-colors"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-slate-500 font-bold mb-1.5 font-sans">Letër Motivimi (Cover Letter)</label>
                                <textarea
                                  value={applyCoverLetter}
                                  onChange={(e) => setApplyCoverLetter(e.target.value)}
                                  placeholder="Pse jeni kandidati më i mirë për këtë pozitë?"
                                  rows={3}
                                  className="w-full bg-white border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] transition-colors resize-none"
                                ></textarea>
                              </div>

                              {/* Modern CV Drag & Drop Area */}
                              <div>
                                <label className="block text-slate-500 font-bold mb-1.5 font-sans">CV / Rezumeja juaj</label>
                                <div
                                  onClick={() => {
                                    setIsUploadingResume(true);
                                    setTimeout(() => {
                                      setIsUploadingResume(false);
                                      setUploadedResumeName('CV_Lirim_Kastrati.pdf');
                                      showToast('Rezumeja u ngarkua me sukses!');
                                    }, 1200);
                                  }}
                                  className="border-2 border-dashed border-slate-200 hover:border-[#FF5E00] bg-white rounded-2xl p-4.5 text-center cursor-pointer transition-all hover:bg-orange-50/20"
                                >
                                  {isUploadingResume ? (
                                    <div className="flex flex-col items-center gap-1.5 py-1">
                                      <Icons.LoaderPinwheel className="w-5 h-5 text-[#FF5E00] animate-spin" />
                                      <span className="font-semibold text-slate-500">Duke ngarkuar dokumentin...</span>
                                    </div>
                                  ) : uploadedResumeName ? (
                                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold py-1">
                                      <Icons.Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                      <span>{uploadedResumeName} (Suksesshëm)</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5 py-1">
                                      <Icons.FileText className="w-6 h-6 text-slate-400 mx-auto" />
                                      <p className="font-semibold text-slate-600">Klikoni për të ngarkuar CV-në</p>
                                      <p className="text-[10px] text-slate-400 font-mono">Pranohen vetëm PDF, DOCX deri në 5MB</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow shadow-orange-100 cursor-pointer"
                            >
                              Dërgo Aplikimin Ditën e Sotme
                            </button>
                          </form>
                        ) : (
                          // Description & Lists
                          <div className="space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-5 text-left">
                            
                            <div>
                              <h4 className="font-display font-bold text-slate-900 text-xs mb-2 uppercase tracking-wide">Përshkrimi i Pozitës</h4>
                              <p className="font-sans text-slate-600 font-medium leading-relaxed">{activeJobObject.description}</p>
                            </div>

                            {activeJobObject.requirements && activeJobObject.requirements.length > 0 && (
                              <div>
                                <h4 className="font-display font-bold text-slate-900 text-xs mb-3 uppercase tracking-wide">Kërkesat & Kualifikimet</h4>
                                <ul className="space-y-2.5 pl-0.5">
                                  {activeJobObject.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-600 font-sans font-medium">
                                      <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {activeJobObject.responsibilities && activeJobObject.responsibilities.length > 0 && (
                              <div>
                                <h4 className="font-display font-bold text-slate-900 text-xs mb-3 uppercase tracking-wide">Përgjegjësitë e Punës</h4>
                                <ul className="space-y-2.5 pl-0.5">
                                  {activeJobObject.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-600 font-sans font-medium">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5E00] shrink-0 mt-2"></div>
                                      <span>{resp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="py-20 text-center text-slate-400">
                        <Icons.Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        Ju lutem zgjidhni një pozitë për të parë detajet.
                      </div>
                    )}
                  </section>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. RECRUITER DASHBOARD VIEW ==================== */}
        {currentTab === 'recruiter' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="recruiter-dashboard">
            
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-left">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 leading-tight">
                  Paneli i <span className="text-[#FF5E00]">Punëdhënësit</span> (Recruiter)
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1.5 font-sans">Menaxhoni shpalljet tuaja të lira dhe shqyrtoni aplikimet e pranuara nga kandidatët.</p>
              </div>
              
              <button
                onClick={() => setActiveRecruiterSubTab('post')}
                className="bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icons.PlusCircle className="w-4 h-4 text-white" /> Posto një Pozitë të Re
              </button>
            </div>

            {/* Premium Stat Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider block">Shpallje Aktive</span>
                  <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block">{jobs.length}</span>
                </div>
                <div className="w-11 h-11 bg-blue-50/70 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icons.Briefcase className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider block">Aplikime Gjithsej</span>
                  <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block">{applications.length}</span>
                </div>
                <div className="w-11 h-11 bg-indigo-50/70 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Icons.Users className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider block">Të Pranuara</span>
                  <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block">
                    {applications.filter((a) => a.status === 'Pranuar').length}
                  </span>
                </div>
                <div className="w-11 h-11 bg-emerald-50/70 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Icons.CheckCircle2 className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider block">Në Pritje</span>
                  <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block">
                    {applications.filter((a) => a.status === 'Në pritje').length}
                  </span>
                </div>
                <div className="w-11 h-11 bg-amber-50/70 text-amber-600 rounded-xl flex items-center justify-center">
                  <Icons.Clock className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>

            {/* Recruiter Sub-Navigation Tabs */}
            <div className="border-b border-slate-100 mb-8 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setActiveRecruiterSubTab('jobs')}
                className={`px-4 py-3 font-display font-semibold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecruiterSubTab === 'jobs'
                    ? 'border-[#FF5E00] text-[#FF5E00]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icons.Briefcase className="w-4 h-4" /> Pozitat tona ({jobs.length})
              </button>
              <button
                onClick={() => setActiveRecruiterSubTab('applications')}
                className={`px-4 py-3 font-display font-semibold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecruiterSubTab === 'applications'
                    ? 'border-[#FF5E00] text-[#FF5E00]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icons.Users className="w-4 h-4" /> Aplikimet e Kandidatëve ({applications.length})
              </button>
              <button
                onClick={() => setActiveRecruiterSubTab('post')}
                className={`px-4 py-3 font-display font-semibold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecruiterSubTab === 'post'
                    ? 'border-[#FF5E00] text-[#FF5E00]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icons.PlusCircle className="w-4 h-4" /> Shpall një Pozitë
              </button>
            </div>

            {/* ==================== REC SUBTAB 1: POSTED JOBS ==================== */}
            {activeRecruiterSubTab === 'jobs' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-left">
                <div className="px-6 py-4.5 bg-[#0B2545] text-white font-display font-medium text-xs uppercase tracking-wider">
                  Aktualisht janë shfaqur {jobs.length} pozita të lira pune për Kosovë
                </div>
                <div className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#0B2545] text-white rounded-xl flex items-center justify-center font-display font-bold text-base shrink-0 shadow-sm">
                          {job.logo}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-slate-900 text-base">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-bold font-mono">
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                              <Icons.MapPin className="w-3.5 h-3.5 text-blue-600" /> {job.city}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                              <Icons.DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {job.salary}
                            </span>
                            <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 uppercase text-[10px]">
                              {job.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start md:self-center">
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setCurrentTab('jobs');
                          }}
                          className="px-4 py-2.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 font-display font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Shiko Shpalljen
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' });
                              if (!res.ok) throw new Error('Dështoi fshirja');
                              setJobs(jobs.filter((j) => j.id !== job.id));
                              showToast('Pozita u mbyll dhe u fshi me sukses!', 'info');
                            } catch (err) {
                              console.error(err);
                              showToast('Gabim gjatë mbylljes së pozitës!', 'error');
                            }
                          }}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-display font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Mbyll Pozitën
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== REC SUBTAB 2: APPLICATIONS LIST ==================== */}
            {activeRecruiterSubTab === 'applications' && (
              <div className="space-y-5 text-left">
                {applications.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400">
                    <Icons.Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-300" />
                    <p className="font-display font-bold text-slate-800">Asnjë aplikim nuk është marrë ende</p>
                    <p className="text-xs mt-1.5 font-sans text-slate-400">Kur kandidatët aplikojnë, aplikimet e tyre do të renditen këtu në kohë reale.</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      
                      {/* Top Info Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3.5 border-b border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider block">KANDIDATI PER POZITEN</span>
                          <h4 className="font-display font-bold text-slate-900 text-base mt-0.5">{app.jobTitle}</h4>
                          <span className="text-xs text-slate-400 font-semibold">{app.company}</span>
                        </div>
                        
                        {/* Interactive Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                            app.status === 'Pranuar'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'Refuzuar'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Candidate details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase tracking-wide">Emri Plotë</span>
                          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{app.candidateName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase tracking-wide">Email adresa</span>
                          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{app.candidateEmail}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase tracking-wide">Numri i telefonit</span>
                          <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{app.candidatePhone}</span>
                        </div>
                      </div>

                      {/* Cover letter */}
                      {app.coverLetter && (
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase tracking-wide mb-1.5">Letër Motivimi</span>
                          <p className="text-xs text-slate-600 bg-slate-50/30 p-3.5 rounded-xl font-medium border border-slate-100/80 italic">
                            "{app.coverLetter}"
                          </p>
                        </div>
                      )}

                      {/* Quick Recruiter Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-mono font-bold">
                          Aplikuar më: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        
                        {app.status === 'Në pritje' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Refuzuar')}
                              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-display font-bold text-[10px] uppercase tracking-wider rounded-xl border border-rose-200 transition-colors cursor-pointer"
                            >
                              Refuzo Kandidatin
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'Pranuar')}
                              className="px-4 py-2 bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
                            >
                              Prano Kandidatin
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* ==================== REC SUBTAB 3: CREATE NEW JOB FORM ==================== */}
            {activeRecruiterSubTab === 'post' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl mx-auto text-left">
                <div className="mb-6 pb-4 border-b border-slate-50">
                  <h3 className="text-xl font-display font-bold text-slate-900 leading-none">Posto një shpallje të re pune</h3>
                  <p className="text-xs text-slate-400 mt-2 font-sans">Të gjitha fushat e shënuara me yll (*) janë të detyrueshme të plotësohen.</p>
                </div>

                <form onSubmit={handleCreateJob} className="space-y-5 text-sm">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Titulli i Pozitës së Punës *</label>
                      <input
                        type="text"
                        required
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                        placeholder="p.sh. Junior React Developer"
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Kompania Postuese *</label>
                      <input
                        type="text"
                        required
                        value={newJobCompany}
                        onChange={(e) => setNewJobCompany(e.target.value)}
                        placeholder="p.sh. IPKO Sh.a."
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Qyteti (Kosovo) *</label>
                      <select
                        value={newJobCity}
                        onChange={(e) => setNewJobCity(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer transition-all"
                      >
                        {POPULAR_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Kategoria e Sektorit *</label>
                      <select
                        value={newJobCategory}
                        onChange={(e) => setNewJobCategory(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer transition-all"
                      >
                        {POPULAR_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Orari i Punës *</label>
                      <select
                        value={newJobType}
                        onChange={(e) => setNewJobType(e.target.value as any)}
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer transition-all"
                      >
                        <option value="Kohë e plotë">Kohë e plotë (Full-Time)</option>
                        <option value="Kohë e pjesshme">Kohë e pjesshme (Part-Time)</option>
                        <option value="Punë nga shtëpia">Punë nga shtëpia (Remote)</option>
                        <option value="Praktikë">Praktikë (Internship)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-xs font-sans">Paga Mujore / Kompensimi *</label>
                      <input
                        type="text"
                        required
                        value={newJobSalary}
                        onChange={(e) => setNewJobSalary(e.target.value)}
                        placeholder="p.sh. 1,200€ - 1,500€"
                        className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center pt-5.5 font-sans">
                      <Icons.Info className="w-5 h-5 text-blue-600 shrink-0 mr-2" />
                      Paga do të shfaqet në mënyrë transparente tek të gjithë kandidatët për rritje të konfidencës.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold text-xs font-sans">Përshkrimi i detajuar i Punës *</label>
                    <textarea
                      required
                      value={newJobDescription}
                      onChange={(e) => setNewJobDescription(e.target.value)}
                      placeholder="Shkruani një përmbledhje apo përshkrim rreth detyrave kryesore..."
                      rows={4}
                      className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold text-xs font-sans">Requirements (Kualifikimet - Një për rresht)</label>
                    <textarea
                      value={newJobRequirements}
                      onChange={(e) => setNewJobRequirements(e.target.value)}
                      placeholder="Mbi 2 vite përvojë me React&#10;Zotërim i gjuhës Angleze&#10;Diplomë Fakulteti"
                      rows={3}
                      className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all text-xs resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold text-xs font-sans">Responsibilities (Përgjegjësitë - Një për rresht)</label>
                    <textarea
                      value={newJobResponsibilities}
                      onChange={(e) => setNewJobResponsibilities(e.target.value)}
                      placeholder="Zhvillimi i kodeve të ripërdorshme&#10;Bashkëpunimi me dizajnuesit&#10;Pjesëmarrja në mbledhje ditore"
                      rows={3}
                      className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-[#FF5E00] rounded-xl p-3 font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all text-xs resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF5E00] hover:bg-[#E05200] text-white font-display font-semibold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md shadow-orange-100 cursor-pointer"
                  >
                    Krijo Pozitën e Punës
                  </button>

                </form>
              </div>
            )}

          </div>
        )}

        {/* ==================== 4. APPLICANT PROFILE VIEW ==================== */}
        {currentTab === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="applicant-profile">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: CANDIDATE BIO & PREFERENCES PANEL */}
              <div className="lg:col-span-5 bg-white p-6 md:p-7 rounded-3xl border border-slate-100 shadow-sm text-left space-y-6">
                
                {/* Visual Avatar */}
                <div className="text-center pb-6 border-b border-slate-50">
                  <div className="w-16 h-16 bg-[#0B2545] text-white rounded-full mx-auto flex items-center justify-center font-display font-bold text-lg shadow-md border-2 border-white ring-4 ring-slate-50">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 mt-3.5 leading-none">{profile.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-[#FF5E00] uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-100 inline-block mt-2.5">
                    {profile.title}
                  </span>
                </div>

                {/* Candidate Info Edit Form */}
                <div className="space-y-4 text-xs">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">
                    Detajet Personale
                  </h4>
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold font-sans">Emri Plotë</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold font-sans">Titulli Profesional</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold font-sans">Email adresa</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold font-sans">Nr. Telefonit</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 font-bold font-sans">Përmbledhja (Bio)</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] focus:bg-white transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* JOB PREFERENCES SECTION - TRIGGERS SMART MATCH NOTIF */}
                <div className="space-y-4 text-xs pt-5 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Preferencat e Punës
                    </h4>
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Smart Match Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed -mt-1">
                    Përditësimi i këtyre preferencave do të skanojë automatikisht shpalljet e reja për t'ju njoftuar menjëherë!
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold font-sans">Qyteti i preferuar</label>
                      <select
                        value={profile.preferredCity}
                        onChange={(e) => handleProfileUpdate({ ...profile, preferredCity: e.target.value })}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] cursor-pointer"
                      >
                        {POPULAR_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold font-sans">Sektori i preferuar</label>
                      <select
                        value={profile.preferredCategory}
                        onChange={(e) => handleProfileUpdate({ ...profile, preferredCategory: e.target.value })}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 font-semibold text-slate-800 focus:outline-none focus:border-[#FF5E00] cursor-pointer"
                      >
                        {POPULAR_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleProfileUpdate(profile)}
                  className="w-full bg-[#0B2545] hover:bg-[#123054] text-white font-display font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl block text-center shadow-md transition-all cursor-pointer"
                >
                  Ruaj Ndryshimet & Sinkronizo
                </button>

              </div>

              {/* RIGHT COLUMN: CANDIDATE HISTORY (SAVED & APPLICATIONS SUBTABS) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Sub-Tabs Nav */}
                <div className="bg-slate-100/65 p-1.5 rounded-2xl border border-slate-200/50 flex gap-1.5">
                  <button
                    onClick={() => setActiveProfileSubTab('saved')}
                    className={`flex-grow py-3 px-4 font-display font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeProfileSubTab === 'saved'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/30'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icons.Star className="w-3.5 h-3.5 text-[#FF5E00] fill-current" /> Punët e Ruajtura ({bookmarks.length})
                  </button>
                  <button
                    onClick={() => setActiveProfileSubTab('applications')}
                    className={`flex-grow py-3 px-4 font-display font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeProfileSubTab === 'applications'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/30'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Icons.Send className="w-3.5 h-3.5 text-blue-600" /> Aplikimet e mia ({applications.length})
                  </button>
                </div>

                {/* SUBTAB CONTENT 1: BOOKMARKED SAVED JOBS */}
                {activeProfileSubTab === 'saved' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.length === 0 ? (
                      <div className="col-span-2 bg-white p-12 text-center rounded-3xl border border-slate-100 text-slate-400">
                        <Icons.Star className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#FF5E00]" />
                        <p className="font-display font-bold text-slate-800">Nuk keni asnjë punë të ruajtur</p>
                        <p className="text-xs mt-1.5 font-sans text-slate-400">Shtoni lëshues të thjeshtë kërkimi duke klikuar yllin tek cilado pozitë.</p>
                      </div>
                    ) : (
                      jobs
                        .filter((job) => bookmarks.includes(job.id))
                        .map((job) => (
                          <div
                            key={job.id}
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setCurrentTab('jobs');
                            }}
                            className="bg-white border border-slate-100 hover:border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer relative flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3.5">
                                <span className="text-[9px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                  {job.city}
                                </span>
                                <button
                                  onClick={(e) => toggleBookmark(job.id, e)}
                                  className="text-[#FF5E00] cursor-pointer"
                                >
                                  <Icons.Star className="w-4 h-4 fill-current" />
                                </button>
                              </div>
                              <h4 className="font-display font-bold text-sm text-slate-900 truncate leading-none mt-1">{job.title}</h4>
                              <span className="text-xs text-slate-400 font-semibold block mt-2">{job.company}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4.5">
                              <span className="text-emerald-700 font-mono font-bold text-xs">{job.salary}</span>
                              <span className="text-[10px] bg-[#0B2545] text-white font-mono font-bold px-2.5 py-1 rounded-md">
                                {job.type}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* SUBTAB CONTENT 2: PERSONAL SENT APPLICATIONS */}
                {activeProfileSubTab === 'applications' && (
                  <div className="space-y-4">
                    {applications.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 text-slate-400">
                        <Icons.Send className="w-10 h-10 mx-auto mb-3 opacity-30 text-blue-600" />
                        <p className="font-display font-bold text-slate-800">Nuk keni aplikuar ende në asnjë pozitë</p>
                        <p className="text-xs mt-1.5 font-sans text-slate-400">Eksploroni shpalljet tona dhe aplikoni drejtpërdrejt brenda sekondave.</p>
                      </div>
                    ) : (
                      applications.map((app) => (
                        <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono font-bold block uppercase tracking-wide">Statusi i Shqyrtimit</span>
                            <h4 className="font-display font-bold text-slate-900 text-sm mt-1 leading-none">{app.jobTitle}</h4>
                            <span className="text-xs text-slate-400 font-semibold block mt-1.5">{app.company}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-mono font-bold">
                              Aplikuar: {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                              app.status === 'Pranuar'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : app.status === 'Refuzuar'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- PREMIUM FOOTER --- */}
      <footer id="punetani-footer" className="bg-[#0B2545] text-slate-400 py-12 border-t border-slate-800/20 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 bg-[#FF5E00] rounded-xl flex items-center justify-center shadow-md">
                  <Icons.Search className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">
                  Punë<span className="text-[#FF5E00]">Tani</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300 font-sans">
                Gjej mundësinë tënde të rradhës profesionale në Kosovë me lehtësi dhe shpejtësi të pashembullt.
              </p>
              <div className="text-[9px] font-mono font-bold text-slate-400">
                PUNËTANI V3.5 — BUILT WITH PRECISION
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-4">Navigimi i shpejtë</h4>
              <ul className="space-y-2 text-xs font-semibold font-sans">
                <li><button onClick={() => setCurrentTab('home')} className="hover:text-[#FF5E00] cursor-pointer">Ballina kryesore</button></li>
                <li><button onClick={() => { setCurrentTab('jobs'); setShowBookmarksOnly(false); }} className="hover:text-[#FF5E00] cursor-pointer">Kërko vende pune</button></li>
                <li><button onClick={() => setCurrentTab('recruiter')} className="hover:text-[#FF5E00] cursor-pointer">Paneli i Recruiter-it</button></li>
                <li><button onClick={() => setCurrentTab('profile')} className="hover:text-[#FF5E00] cursor-pointer">Profili kandidatit</button></li>
              </ul>
            </div>

            {/* Popular Cities Column */}
            <div>
              <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-4">Qytetet në Kosovë</h4>
              <ul className="space-y-2 text-xs font-semibold font-sans">
                <li><button onClick={() => handleCitySelect('Prishtinë')} className="hover:text-[#FF5E00] cursor-pointer">Punë në Prishtinë</button></li>
                <li><button onClick={() => handleCitySelect('Prizren')} className="hover:text-[#FF5E00] cursor-pointer">Punë në Prizren</button></li>
                <li><button onClick={() => handleCitySelect('Pejë')} className="hover:text-[#FF5E00] cursor-pointer">Punë në Pejë</button></li>
                <li><button onClick={() => handleCitySelect('Gjakovë')} className="hover:text-[#FF5E00] cursor-pointer">Punë në Gjakovë</button></li>
              </ul>
            </div>

            {/* Contact Support Column */}
            <div>
              <h4 className="text-white font-display font-bold text-xs uppercase tracking-wider mb-4">Rreth nesh & Mbështetja</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                Keni pyetje apo kërkoni asistencë për integrimin e llogarisë së kompanisë suaj?
              </p>
              <a href="mailto:support@punetani.com" className="text-xs font-semibold text-[#FF5E00] hover:underline flex items-center gap-1.5 font-mono">
                <Icons.Send className="w-3.5 h-3.5 text-[#FF5E00]" /> support@punetani.com
              </a>
            </div>

          </div>

          <div className="border-t border-slate-800/30 mt-10 pt-6 text-center text-xs text-slate-400">
            <p className="font-sans">© {new Date().getFullYear()} PunëTani. Të gjitha të drejtat e rezervuara.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
