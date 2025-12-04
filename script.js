document.addEventListener('DOMContentLoaded', function () {

    /* ==============================
       THEME TOGGLE (Dark / Light)
    ============================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    /* ==============================
        BACK TO TOP BUTTON
    ============================== */
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 200);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==============================
        CURRENT DATE & TIME
    ============================== */
    const datetimeElement = document.getElementById('current-datetime');
    if (datetimeElement) {
        function updateDatetime() {
            const now = new Date();
            const options = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            datetimeElement.textContent = now.toLocaleString('el-GR', options);
        }
        updateDatetime();
        setInterval(updateDatetime, 1000);
    }

    /* ==============================
        SEARCH FILTER
    ============================== */
    const searchInput = document.getElementById('search-input');
    const articles = document.querySelectorAll('.posts-section article');
    if (searchInput && articles.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            articles.forEach(article => {
                const title = article.querySelector('h3')?.textContent.toLowerCase() || "";
                article.style.display = title.includes(term) ? 'block' : 'none';
            });
        });
    }

    /* ==============================
        COMMENTS
    ============================== */
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');
    if (commentForm && commentsContainer) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('comment-name')?.value || "Ανώνυμος";
            const text = document.getElementById('comment-text')?.value || "";
            if (!text.trim()) return;

            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            const nameHeading = document.createElement('h4');
            nameHeading.textContent = name;
            const textParagraph = document.createElement('p');
            textParagraph.textContent = text;
            commentDiv.append(nameHeading, textParagraph);
            commentsContainer.appendChild(commentDiv);
            commentForm.reset();
        });
    }

    /* ==============================
        NEWS PANEL
    ============================== */
    const newsPanel = document.getElementById('news-panel');
    async function fetchNews() {
        const apiKey = "119545ef17ea149e6283e0a899686387";
        const url = `https://gnews.io/api/v4/top-headlines?lang=el&token=${apiKey}`;
        if (!newsPanel) return;
        newsPanel.innerHTML = '<p>Φόρτωση ειδήσεων...</p>';
        try {
            const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
            const data = await response.json();
            if (!data.articles || data.articles.length === 0) {
                newsPanel.innerHTML = '<p>Δεν βρέθηκαν ειδήσεις.</p>';
                return;
            }
            const newsList = document.createElement('ul');
            data.articles.slice(0,5).forEach(article => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = article.url;
                a.textContent = article.title;
                a.target = '_blank';
                li.appendChild(a);
                newsList.appendChild(li);
            });
            newsPanel.innerHTML = '';
            newsPanel.appendChild(newsList);
        } catch (err) {
            console.error('Σφάλμα ειδήσεων:', err);
            newsPanel.innerHTML = '<p>Αδύνατη η φόρτωση ειδήσεων.</p>';
        }
    }
    fetchNews();

    /* ==============================
        WEATHER PANEL
    ============================== */
    const weatherPanel = document.getElementById('weather-panel');
    const city = 'Athens';
    const weatherApiKey = '5cb5d79b861c0b974d64235108e0258b';
    async function getWeatherData() {
        if (!weatherPanel) return;
        weatherPanel.innerHTML = '<p>Φόρτωση καιρού...</p>';
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},gr&units=metric&lang=el&appid=${weatherApiKey}`);
            if (!res.ok) throw new Error("Αποτυχία δεδομένων καιρού");
            const data = await res.json();
            const { main, weather } = data;
            const temp = Math.round(main.temp);
            const desc = weather[0].description;
            const icon = weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            weatherPanel.innerHTML = `
                <div class="weather-info">
                    <img src="${iconUrl}" alt="${desc}">
                    <div>
                        <span class="temp">${temp}°C</span>
                        <p class="description">${desc}</p>
                    </div>
                </div>
            `;
        } catch (err) {
            console.error('Σφάλμα καιρού:', err);
            weatherPanel.innerHTML = '<p>Δεν ήταν δυνατή η φόρτωση καιρού</p>';
        }
    }
    getWeatherData();

    /* ==============================
        NASA APOD
    ============================== */
    const apodContainer = document.getElementById('apod-container');
    const apodApiKey = "A7TJqR1Gt8ul54EfMKpyb0ltazHIEUNvBo6smK8J";
    async function fetchApod() {
        if (!apodContainer) return;
        apodContainer.innerHTML = '<p>Φόρτωση φωτογραφίας...</p>';
        try {
            const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apodApiKey}`);
            if (!res.ok) throw new Error('NASA error');
            const data = await res.json();
            apodContainer.innerHTML = "";
            if (data.media_type === "image") {
                apodContainer.innerHTML = `
                    <img src="${data.url}" alt="${data.title}" class="apod-image">
                    <h4>${data.title}</h4>
                    <p>${data.explanation}</p>
                `;
            } else {
                apodContainer.innerHTML = '<p>Η φωτογραφία σήμερα είναι βίντεο.</p>';
            }
        } catch (err) {
            console.error(err);
            apodContainer.innerHTML = '<p>Η φωτογραφία δεν είναι διαθέσιμη.</p>';
        }
    }
    fetchApod();
