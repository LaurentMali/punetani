// Demo Daten für Kosovo Städte
const kosovoLocations = [
    'Prishtinë',
    'Prizren',
    'Pejë',
    'Gjakovë',
    'Ferizaj',
    'Gjilan',
    'Mitrovicë',
    'Podujëve',
    'Vushtrri',
    'Suharekë',
    'Rahovec',
    'Drenas',
    'Lipjan',
    'Malishevë',
    'Kamenicë',
    'Viti',
    'Deçan',
    'Istog',
    'Klinë',
    'Skenderaj'
];

// Demo Job Titles
const jobTitles = [
    'Software Developer',
    'Web Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'UI/UX Designer',
    'Graphic Designer',
    'Marketing Manager',
    'Sales Manager',
    'Project Manager',
    'Accountant',
    'Human Resources Manager',
    'Customer Service Representative',
    'Data Analyst',
    'Business Analyst',
    'Content Writer',
    'Social Media Manager',
    'Restaurant Manager',
    'Chef',
    'Waiter/Waitress',
    'Barista',
    'Hotel Receptionist',
    'Cleaning Staff',
    'Driver',
    'Electrician',
    'Plumber',
    'Construction Worker',
    'Mechanic',
    'Nurse',
    'Doctor',
    'Pharmacist',
    'Teacher',
    'English Teacher',
    'Math Teacher'
];

// Demo Jobs Data
const demoJobs = [
    {
        id: 1,
        title: 'Software Developer',
        company: 'TechKS',
        location: 'Prishtinë',
        jobType: 'Kohë e plotë',
        salary: '800-1200€',
        description: 'Ne jemi duke kërkuar një zhvillues software me përvojë në Java, JavaScript dhe React. Mundësi për rritje profesionale dhe ambiente pune moderne.',
        postedDate: '2024-12-28'
    },
    {
        id: 2,
        title: 'Marketing Manager',
        company: 'Digital Solutions',
        location: 'Prishtinë',
        jobType: 'Kohë e plotë',
        salary: '600-900€',
        description: 'Kemi nevojë për një menaxher marketingu me përvojë në social media dhe digital marketing. Puno me ekipin tonë dinamik.',
        postedDate: '2024-12-29'
    },
    {
        id: 3,
        title: 'Web Developer',
        company: 'WebStudio KS',
        location: 'Prizren',
        jobType: 'Kohë e plotë',
        salary: '700-1000€',
        description: 'Kërkojmë web developer me njohuri të HTML, CSS, JavaScript dhe PHP. Projeket janë të ndryshme dhe interesante.',
        postedDate: '2024-12-27'
    },
    {
        id: 4,
        title: 'UI/UX Designer',
        company: 'Creative Agency',
        location: 'Prishtinë',
        jobType: 'Kohë e pjesshme',
        salary: '400-600€',
        description: 'Designer me sy për detaje dhe eksperiencë në Figma/Adobe XD. Punë fleksibile dhe projekte kreative.',
        postedDate: '2024-12-30'
    },
    {
        id: 5,
        title: 'Customer Service Representative',
        company: 'CallCenter Pro',
        location: 'Pejë',
        jobType: 'Kohë e plotë',
        salary: '350-500€',
        description: 'Përfaqësues shërbimi ndaj klientit me gjuhë të huaja (Anglisht/Gjermanisht). Trajnim i plotë do të sigurohet.',
        postedDate: '2024-12-26'
    },
    {
        id: 6,
        title: 'Restaurant Manager',
        company: 'Gourmet Restaurant',
        location: 'Prizren',
        jobType: 'Kohë e plotë',
        salary: '500-700€',
        description: 'Menaxher për restorantin tonë të ri në Prizren. Eksperiencë në menaxhim dhe shërbim klienti e nevojshme.',
        postedDate: '2024-12-25'
    },
    {
        id: 7,
        title: 'Graphic Designer',
        company: 'Print Studio',
        location: 'Gjakovë',
        jobType: 'Kohë e plotë',
        salary: '400-650€',
        description: 'Designer grafik për print dhe digital media. Njohuri të Adobe Creative Suite dhe kreativitet.',
        postedDate: '2024-12-29'
    },
    {
        id: 8,
        title: 'Frontend Developer',
        company: 'StartupKS',
        location: 'Prishtinë',
        jobType: 'Punë nga shtëpia',
        salary: '900-1300€',
        description: 'Remote frontend developer për startup ndërkombëtar. React, TypeScript, dhe përvojë me APIs.',
        postedDate: '2024-12-31'
    },
    {
        id: 9,
        title: 'English Teacher',
        company: 'Language Academy',
        location: 'Podujëve',
        jobType: 'Kohë e pjesshme',
        salary: '300-450€',
        description: 'Mësues i gjuhës angleze për shkollën tonë të gjuhëve. Certifikata TEFL/TESOL është plus.',
        postedDate: '2024-12-28'
    },
    {
        id: 10,
        title: 'Data Analyst',
        company: 'Analytics Pro',
        location: 'Prishtinë',
        jobType: 'Kohë e plotë',
        salary: '700-1100€',
        description: 'Analist të dhënash me njohuri të Excel, SQL, dhe Python. Mundësi për zhvillim profesional.',
        postedDate: '2024-12-30'
    }
];

// Autocomplete Functionality
function setupAutocomplete(inputElement, suggestions, onSelect) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'autocomplete-results';
    inputElement.parentElement.style.position = 'relative';
    inputElement.parentElement.appendChild(resultsContainer);

    inputElement.addEventListener('input', function() {
        const value = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (value.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        const filtered = suggestions.filter(item =>
            item.toLowerCase().includes(value)
        ).slice(0, 5);

        if (filtered.length > 0) {
            resultsContainer.style.display = 'block';
            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.textContent = item;
                div.addEventListener('click', function() {
                    inputElement.value = item;
                    resultsContainer.style.display = 'none';
                    if (onSelect) onSelect(item);
                });
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.style.display = 'none';
        }
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        if (!inputElement.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

// Search and Filter Jobs
function searchJobs() {
    const jobTitle = document.getElementById('job-title').value.toLowerCase().trim();
    const location = document.getElementById('location').value.toLowerCase().trim();

    // Get selected job types
    const fullTime = document.getElementById('filter-fulltime')?.checked;
    const partTime = document.getElementById('filter-parttime')?.checked;
    const remote = document.getElementById('filter-remote')?.checked;
    const internship = document.getElementById('filter-internship')?.checked;

    let filtered = demoJobs.filter(job => {
        const matchesTitle = !jobTitle || job.title.toLowerCase().includes(jobTitle);
        const matchesLocation = !location || job.location.toLowerCase().includes(location);

        let matchesType = true;
        if (fullTime || partTime || remote || internship) {
            matchesType =
                (fullTime && job.jobType === 'Kohë e plotë') ||
                (partTime && job.jobType === 'Kohë e pjesshme') ||
                (remote && job.jobType === 'Punë nga shtëpia') ||
                (internship && job.jobType === 'Praktikë');
        }

        return matchesTitle && matchesLocation && matchesType;
    });

    displayJobs(filtered);
}

// Display Jobs
function displayJobs(jobs) {
    let resultsSection = document.getElementById('search-results');

    if (!resultsSection) {
        resultsSection = document.createElement('section');
        resultsSection.id = 'search-results';
        resultsSection.className = 'search-results-section';
        document.querySelector('.search-section').after(resultsSection);
    }

    if (jobs.length === 0) {
        resultsSection.innerHTML = `
            <div class="results-container">
                <div class="no-results">
                    <h2>😔 Nuk u gjetën rezultate</h2>
                    <p>Provoni të ndryshoni filtrat ose fjalët kyçe të kërkimit.</p>
                </div>
            </div>
        `;
        return;
    }

    const jobsHtml = jobs.map(job => `
        <div class="job-card" onclick="showJobDetails(${job.id})">
            <div class="job-card-header">
                <h3>${job.title}</h3>
                <span class="job-type-badge">${job.jobType}</span>
            </div>
            <div class="job-card-company">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                ${job.company}
            </div>
            <div class="job-card-location">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                ${job.location}
            </div>
            <div class="job-card-salary">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                </svg>
                ${job.salary}
            </div>
            <p class="job-card-description">${job.description.substring(0, 120)}...</p>
            <div class="job-card-footer">
                <span class="job-posted-date">${formatDate(job.postedDate)}</span>
                <button class="btn-apply" onclick="event.stopPropagation(); applyForJob(${job.id})">Apliko Tani</button>
            </div>
        </div>
    `).join('');

    resultsSection.innerHTML = `
        <div class="results-container">
            <div class="results-header">
                <h2>U gjetën ${jobs.length} punë</h2>
            </div>
            <div class="jobs-grid">
                ${jobsHtml}
            </div>
        </div>
    `;

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show Job Details
function showJobDetails(jobId) {
    const job = demoJobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="job-modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <div class="job-detail-header">
                <h2>${job.title}</h2>
                <span class="job-type-badge">${job.jobType}</span>
            </div>
            <div class="job-detail-meta">
                <div><strong>Kompania:</strong> ${job.company}</div>
                <div><strong>Lokacioni:</strong> ${job.location}</div>
                <div><strong>Paga:</strong> ${job.salary}</div>
                <div><strong>Postuar:</strong> ${formatDate(job.postedDate)}</div>
            </div>
            <div class="job-detail-description">
                <h3>Përshkrimi i Punës</h3>
                <p>${job.description}</p>
                <h3>Kërkesat</h3>
                <ul>
                    <li>Përvojë të provuar në fushën përkatëse</li>
                    <li>Aftësi të shkëlqyera komunikuese</li>
                    <li>Gatishmëri për të mësuar dhe zhvilluar</li>
                    <li>Qasje profesionale dhe përkushtim</li>
                </ul>
                <h3>Çfarë ofrojmë</h3>
                <ul>
                    <li>Pagë konkurruese</li>
                    <li>Mundësi për zhvillim profesional</li>
                    <li>Ambiente pune moderne</li>
                    <li>Ekip dinamik dhe mbështetës</li>
                </ul>
            </div>
            <div class="job-detail-actions">
                <button class="btn-apply-large" onclick="applyForJob(${job.id})">Apliko për këtë Punë</button>
                <button class="btn-save">Ruaj për më vonë</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Apply for Job
// Apply for Job
function applyForJob(jobId) {
    const job = demoJobs.find(j => j.id === jobId);

    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="job-modal-content application-form">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2>Apliko për: ${job.title}</h2>
            <p class="form-subtitle">Kompania: ${job.company} | Lokacioni: ${job.location}</p>
            
            <form id="application-form" onsubmit="submitApplication(event, ${jobId})">
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="app-name">Emri dhe Mbiemri *</label>
                        <input type="text" id="app-name" required placeholder="p.sh. Laurent Mali">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-half">
                        <label for="app-email">Email *</label>
                        <input type="email" id="app-email" required placeholder="laurent@example.com">
                    </div>
                    <div class="form-group-half">
                        <label for="app-phone">Telefoni *</label>
                        <input type="tel" id="app-phone" required placeholder="+383 44 123 456">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-half">
                        <label for="app-city">Qyteti *</label>
                        <input type="text" id="app-city" required placeholder="Prishtinë">
                    </div>
                    <div class="form-group-half">
                        <label for="app-experience">Vite Përvojë</label>
                        <select id="app-experience">
                            <option value="">Zgjedh...</option>
                            <option value="0-1">0-1 vit</option>
                            <option value="1-3">1-3 vjet</option>
                            <option value="3-5">3-5 vjet</option>
                            <option value="5+">5+ vjet</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="app-cv">CV (PDF, DOC, DOCX) *</label>
                        <div class="file-upload-wrapper">
                            <input type="file" id="app-cv" accept=".pdf,.doc,.docx" required>
                            <span class="file-upload-label">Kliko për të ngarkuar CV-në</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="app-cover-letter">Letra Motivuese (opsionale)</label>
                        <textarea id="app-cover-letter" rows="5" placeholder="Shkruaj pse je kandidati ideal për këtë pozitë..."></textarea>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label class="checkbox-label">
                            <input type="checkbox" required>
                            Pranoj <a href="#" onclick="event.preventDefault()">Kushtet dhe Politikën e Privatësisë</a> *
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="this.closest('.job-modal').remove()">Anulo</button>
                    <button type="submit" class="btn-submit">Dërgo Aplikimin</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // File upload label update
    const fileInput = modal.querySelector('#app-cv');
    const fileLabel = modal.querySelector('.file-upload-label');
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileLabel.textContent = this.files[0].name;
            fileLabel.style.color = '#10b981';
        }
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function submitApplication(event, jobId) {
    event.preventDefault();
    const job = demoJobs.find(j => j.id === jobId);
    const name = document.getElementById('app-name').value;

    // Close the form
    event.target.closest('.job-modal').remove();

    // Show success message
    showSuccessMessage(`Faleminderit ${name}! 🎉\n\nAplikimi juaj për pozitën "${job.title}" në ${job.company} u dërgua me sukses!\n\nKjo është versioni demo - në versionin final, aplikimi do të ruhet në databazë dhe punëdhënësi do të njoftohet.`);
}

function showSuccessMessage(message) {
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">✓</div>
            <h2>Aplikimi u Dërgua!</h2>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <button class="btn-submit" onclick="this.closest('.job-modal').remove()">Në rregull</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Sot';
    if (diffDays === 1) return 'Dje';
    if (diffDays < 7) return `${diffDays} ditë më parë`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} javë më parë`;
    return date.toLocaleDateString('sq-AL');
}

// Stats Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent.replace(/[^\d]/g, ''));
                animateNumber(target, finalNumber);
                observer.unobserve(target);
            }
        });
    });

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        const suffix = element.textContent.includes('+') ? '+' : '';
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Setup autocomplete for location
    const locationInput = document.getElementById('location');
    if (locationInput) {
        setupAutocomplete(locationInput, kosovoLocations);
    }

    // Setup autocomplete for job title
    const jobTitleInput = document.getElementById('job-title');
    if (jobTitleInput) {
        setupAutocomplete(jobTitleInput, jobTitles);
    }

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchJobs();
        });
    }

    // Enter key to search
    [locationInput, jobTitleInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchJobs();
                }
            });
        }
    });

    // Filter checkboxes - real-time search
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Only search if there are already results displayed
            if (document.getElementById('search-results')) {
                searchJobs();
            }
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize animations
    animateStats();

    // Show some jobs by default (optional)
    // displayJobs(demoJobs.slice(0, 6));
});

// Post Job Form
function openPostJobForm() {
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="job-modal-content post-job-form">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2>Posto një Punë të Re</h2>
            <p class="form-subtitle">Plotëso të dhënat për pozitën e punës</p>
            
            <form id="post-job-form" onsubmit="submitJobPost(event)">
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="job-post-title">Titulli i Punës *</label>
                        <input type="text" id="job-post-title" required placeholder="p.sh. Software Developer">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-half">
                        <label for="job-post-company">Emri i Kompanisë *</label>
                        <input type="text" id="job-post-company" required placeholder="Kompania Juaj">
                    </div>
                    <div class="form-group-half">
                        <label for="job-post-location">Lokacioni *</label>
                        <input type="text" id="job-post-location" required placeholder="Prishtinë">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-half">
                        <label for="job-post-type">Lloji i Punës *</label>
                        <select id="job-post-type" required>
                            <option value="">Zgjedh...</option>
                            <option value="FULL_TIME">Kohë e plotë</option>
                            <option value="PART_TIME">Kohë e pjesshme</option>
                            <option value="REMOTE">Punë nga shtëpia</option>
                            <option value="INTERNSHIP">Praktikë</option>
                        </select>
                    </div>
                    <div class="form-group-half">
                        <label for="job-post-salary">Paga (opsionale)</label>
                        <input type="text" id="job-post-salary" placeholder="p.sh. 800-1200€">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="job-post-description">Përshkrimi i Punës *</label>
                        <textarea id="job-post-description" rows="6" required placeholder="Përshkruaj pozitën, përgjegjësitë, kërkesat..."></textarea>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-half">
                        <label for="job-post-email">Email Kontakti *</label>
                        <input type="email" id="job-post-email" required placeholder="hr@kompania.com">
                    </div>
                    <div class="form-group-half">
                        <label for="job-post-phone">Telefoni (opsionale)</label>
                        <input type="tel" id="job-post-phone" placeholder="+383 44 123 456">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label for="job-post-deadline">Data e Fundit për Aplikim</label>
                        <input type="date" id="job-post-deadline">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group-full">
                        <label class="checkbox-label">
                            <input type="checkbox" required>
                            Konfirmoj që informatat janë të sakta dhe pranoj kushtet *
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="this.closest('.job-modal').remove()">Anulo</button>
                    <button type="submit" class="btn-submit">Publiko Punën</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function submitJobPost(event) {
    event.preventDefault();
    const title = document.getElementById('job-post-title').value;
    const company = document.getElementById('job-post-company').value;

    event.target.closest('.job-modal').remove();

    showSuccessMessage(`Faleminderit! 🎉\n\nPuna "${title}" në ${company} u postua me sukses!\n\nKjo është versioni demo - në versionin final, puna do të shfaqet në platformë dhe kandidatët do të mund të aplikojnë.`);
}

// About Us Page
function showAboutPage() {
    const modal = document.createElement('div');
    modal.className = 'job-modal';
    modal.innerHTML = `
        <div class="about-page-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            
            <div class="about-hero">
                <h1>Rreth PunaKS</h1>
                <p class="about-subtitle">Platforma më e madhe e punëve në Kosovë</p>
            </div>
            
            <div class="about-section">
                <h2>🎯 Misioni Ynë</h2>
                <p>PunaKS ka për qëllim të lidhë talentet më të mira të Kosovës me mundësitë më të mira të punës. Ne besojmë se çdo person meriton një karrierë që e frymëzon dhe një punë që i përshtatet talenteve të tij.</p>
            </div>
            
            <div class="about-section">
                <h2>👁️ Vizioni Ynë</h2>
                <p>Të bëhemi platforma kryesore e rekrutimit në Kosovë, duke ofruar zgjidhje moderne dhe efikase për punëkërkuesit dhe punëdhënësit. Ne synojmë të transformojmë mënyrën se si njerëzit gjejnë punë në Kosovë.</p>
            </div>
            
            <div class="about-stats-mini">
                <div class="stat-mini">
                    <div class="stat-mini-number">5,000+</div>
                    <div class="stat-mini-label">Punë të Postuara</div>
                </div>
                <div class="stat-mini">
                    <div class="stat-mini-number">1,200+</div>
                    <div class="stat-mini-label">Kompani</div>
                </div>
                <div class="stat-mini">
                    <div class="stat-mini-number">25,000+</div>
                    <div class="stat-mini-label">Kandidatë</div>
                </div>
            </div>
            
            <div class="about-section">
                <h2>💼 Çfarë Ofrojmë</h2>
                <div class="about-features">
                    <div class="about-feature">
                        <div class="feature-icon">🔍</div>
                        <h3>Kërkim i Avancuar</h3>
                        <p>Gjej punën perfekte me filtra të detajuar dhe kërkime të personalizuara.</p>
                    </div>
                    <div class="about-feature">
                        <div class="feature-icon">⚡</div>
                        <h3>Aplikim i Shpejtë</h3>
                        <p>Apliko për punë me vetëm disa klikime dhe menaxho aplikimet e tua lehtësisht.</p>
                    </div>
                    <div class="about-feature">
                        <div class="feature-icon">🤝</div>
                        <h3>Lidhje të Drejtpërdrejta</h3>
                        <p>Lidhu direkt me punëdhënësit dhe merr përgjigje më të shpejta.</p>
                    </div>
                    <div class="about-feature">
                        <div class="feature-icon">📊</div>
                        <h3>Për Kompanitë</h3>
                        <p>Gjej kandidatët më të mirë me një platformë të thjeshtë dhe efikase.</p>
                    </div>
                </div>
            </div>
            
            <div class="about-section">
                <h2>🌟 Pse PunaKS?</h2>
                <ul class="about-list">
                    <li><strong>Lokal:</strong> E krijuar nga kosovarë, për kosovarët</li>
                    <li><strong>Besnik:</strong> Platforma më e besueshme për punë në Kosovë</li>
                    <li><strong>Moderne:</strong> Teknologji e fundit dhe design intuitiv</li>
                    <li><strong>Mbështetje:</strong> Ekip i dedikuar për të ndihmuar përdoruesit</li>
                    <li><strong>Falas:</strong> Pa kosto për punëkërkuesit</li>
                </ul>
            </div>
            
            <div class="about-section about-team">
                <h2>👥 Ekipi Ynë</h2>
                <p>Ne jemi një ekip i apasionuar profesionistësh që besojnë në fuqinë e teknologjisë për të ndryshuar jetët. Ekipi ynë punon çdo ditë për të përmirësuar platformën dhe për të ofruar përvojën më të mirë të mundshme.</p>
            </div>
            
            <div class="about-cta">
                <h2>Gati për të Filluar?</h2>
                <p>Bashkohu me mijëra kosovarë që tashmë kanë gjetur punën e ëndrrave përmes PunaKS</p>
                <div class="about-cta-buttons">
                    <button class="btn-primary-large" onclick="this.closest('.job-modal').remove(); searchJobs();">Kërko Punë</button>
                    <button class="btn-secondary-large" onclick="this.closest('.job-modal').remove(); openPostJobForm();">Posto Punë</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}