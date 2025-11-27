document.addEventListener('DOMContentLoaded', () => {
    loadAllData();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });

                // Update active link
                document.querySelectorAll('.main-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Highlight active section on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});

async function loadAllData() {
    try {
        const timestamp = new Date().getTime();
        const [profile, about, education, news, publications, teaching, service] = await Promise.all([
            fetch(`contents/profile.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/about.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/education.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/news.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/publications.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/teaching.json?t=${timestamp}`).then(res => res.json()),
            fetch(`contents/service.json?t=${timestamp}`).then(res => res.json())
        ]);

        renderProfile(profile);
        renderAbout(about);
        renderEducation(education);
        renderNews(news);
        renderPublications(publications);
        renderTeaching(teaching);
        renderService(service);
        renderContact(profile); // Contact uses profile data
        renderFooter(profile);  // Footer uses profile data

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderProfile(profile) {
    const container = document.getElementById('profile-container');

    let photoHtml = '';
    if (profile.photoUrl) {
        photoHtml = `<img src="${profile.photoUrl}" alt="${profile.name}" class="profile-photo">`;
    } else {
        photoHtml = `
            <div class="profile-photo-placeholder">
                <i class="fas fa-user-graduate"></i>
            </div>`;
    }

    container.innerHTML = `
        <div class="profile-photo-container">
            ${photoHtml}
        </div>
        <h1 class="name">${profile.name}</h1>
        <h1 class="name_chinese">${profile.name_Chinese}</h1>
        <p class="institution">${profile.institution}</p>
        
        <div class="social-links">
            ${profile.social.email ? `<a href="${profile.social.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
            ${profile.social.googleScholar ? `<a href="${profile.social.googleScholar}" aria-label="Google Scholar"><i class="fas fa-graduation-cap"></i></a>` : ''}
            ${profile.social.github ? `<a href="${profile.social.github}" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
            ${profile.social.twitter ? `<a href="${profile.social.twitter}" aria-label="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
            ${profile.social.linkedin ? `<a href="${profile.social.linkedin}" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
        </div>
    `;
}

function renderAbout(about) {
    const container = document.getElementById('about-container');

    const bioHtml = about.bio.map(paragraph => `<p class="bio-text">${paragraph}</p>`).join('');
    const interestsHtml = about.interests.map(interest => `<span class="tag">${interest}</span>`).join('');

    container.innerHTML = `
        ${bioHtml}
        <div class="interests-tags">
            ${interestsHtml}
        </div>
    `;
}

function renderEducation(education) {
    const container = document.getElementById('education-container');

    if (!education || education.length === 0) {
        document.getElementById('education').style.display = 'none';
        return;
    }

    container.innerHTML = education.map(edu => `
        <div class="education-item">
            <div class="edu-header">
                <h3 class="edu-degree">${edu.degree}</h3>
                <span class="edu-period">${edu.period}</span>
            </div>
            <p class="edu-institution">${edu.institution}</p>
            ${edu.details ? `<p class="edu-details">${edu.details}</p>` : ''}
        </div>
    `).join('');
}

function renderNews(news) {
    const container = document.getElementById('news-container');

    container.innerHTML = news.map(item => `
        <div class="news-item">
            <span class="date">${item.date}</span>
            <div class="news-content">
                ${item.content}
            </div>
        </div>
    `).join('');
}

function renderPublications(publications) {
    const container = document.getElementById('publications-container');

    container.innerHTML = publications.map(pub => {

        const linksHtml = pub.links.map(link => `
            <a href="${link.url}" class="pub-link"><i class="${link.icon}"></i> ${link.name}</a>
        `).join('');

        return `
            <div class="publication-item">
                <div class="pub-details">
                    <h3 class="pub-title">${pub.title}</h3>
                    <p class="pub-authors">${pub.authors}</p>
                    <p class="pub-venue">${pub.venue}</p>
                    <div class="pub-links">
                        ${linksHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTeaching(teaching) {
    const container = document.getElementById('teaching-container');

    if (!teaching || teaching.length === 0) {
        document.getElementById('teaching').style.display = 'none';
        return;
    }

    container.innerHTML = `
        <ul class="teaching-list">
            ${teaching.map(item => `
                <li>
                    <strong>${item.course}</strong>, ${item.role}, ${item.institution}, ${item.period}
                </li>
            `).join('')}
        </ul>
    `;
}

function renderService(service) {
    const container = document.getElementById('service-container');

    if (!service || service.length === 0) {
        document.getElementById('service').style.display = 'none';
        return;
    }

    container.innerHTML = `
        <ul class="service-list">
            ${service.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
}

function renderContact(profile) {
    const container = document.getElementById('contact-container');

    container.innerHTML = `
        <p>
            <strong>Email:</strong> ${profile.email}<br>
        </p>
    `;
}

function renderFooter(profile) {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = profile.name;
}
