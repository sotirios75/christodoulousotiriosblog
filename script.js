// Κώδικας για αλλαγή θέματος (dark/light)
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

// Κώδικας για το κουμπί 'Επιστροφή στην κορυφή'
const backToTopBtn = document.getElementById('back-to-top-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Εμφάνιση τρέχουσας ημερομηνίας και ώρας
const datetimeElement = document.getElementById('current-datetime');

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

// Λειτουργία αναζήτησης άρθρων
const searchInput = document.getElementById('search-input');
const articles = document.querySelectorAll('.posts-section article');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        article.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Υποβολή σχολίων
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments-container');

if (commentForm && commentsContainer) {
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('comment-name').value;
        const text = document.getElementById('comment-text').value;

        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const nameHeading = document.createElement('h4');
        nameHeading.textContent = name;

        const textParagraph = document.createElement('p');
        textParagraph.textContent = text;

        commentDiv.appendChild(nameHeading);
        commentDiv.appendChild(textParagraph);
        commentsContainer.appendChild(commentDiv);

        commentForm.reset();
    });
}

// Λογική για το news panel (Τελευταίες Ειδήσεις)
document.addEventListener('DOMContentLoaded', () => {
    const newsPanel = document.getElementById('news-panel');
    const API_KEY = '18bd6e142b986aa12b716d303f7fabea'; // Βάλτε το δικό σας κλειδί

    async function fetchNews() {
        // Χρησιμοποιούμε το Top Headlines ως παράδειγμα
        const url = `https://gnews.io/api/v4/top-headlines?lang=el&token=${apiKey}`;

        try {
            // 1. Κάνουμε την κλήση και περιμένουμε την απάντηση (Response)
            const response = await fetch(url);
            
            // 2. Ελέγχουμε αν η απάντηση ήταν επιτυχής (π.χ. Status 200)
            if (!response.ok) {
                // Εάν το API επιστρέψει σφάλμα (π.χ. 429 Too Many Requests), πετάμε error
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            // 3. Μετατρέπουμε την απάντηση σε JSON και περιμένουμε τα δεδομένα (Data)
            const data = await response.json();

            // 4. Ελέγχουμε την κατάσταση του API (NewsAPI)
            if (data.status !== 'ok') {
                throw new Error(`NewsAPI Error: ${data.message}`);
            }

            // 5. ΤΩΡΑ τα δεδομένα (data) είναι διαθέσιμα και μπορούμε να τα χρησιμοποιήσουμε.
            const newsList = document.createElement('ul');
            
            // Εάν δεν υπάρχουν άρθρα, εμφανίζουμε ένα μήνυμα
            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(article => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = article.url;
                    link.textContent = article.title;
                    link.target = '_blank';
                    listItem.appendChild(link);
                    newsList.appendChild(listItem);
                });
                newsPanel.innerHTML = '';
                newsPanel.appendChild(newsList);
            } else {
                newsPanel.innerHTML = `<p>Δεν βρέθηκαν άρθρα για εμφάνιση.</p>`;
            }

        } catch (error) {
            console.error('Σφάλμα κατά τη φόρτωση ειδήσεων:', error);
            // Εμφάνιση του σφάλματος στο panel
            newsPanel.innerHTML = `<p>Αδύνατη η φόρτωση ειδήσεων: ${error.message}</p>`;
        }
    }

    fetchNews();
});

// Weather API
const weatherPanel = document.getElementById('weather-panel');
const city = 'Athens';
const weatherApiKey = '5cb5d79b861c0b974d64235108e0258b';

async function getWeatherData() {
    if (!weatherApiKey) {
        weatherPanel.innerHTML = '<p>Το κλειδί API δεν έχει ρυθμιστεί.</p>';
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},gr&units=metric&lang=el&appid=${weatherApiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Δεν βρέθηκαν δεδομένα καιρού');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Σφάλμα κατά τη λήψη δεδομένων καιρού:', error);
        weatherPanel.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { main, weather } = data;
    const temp = Math.round(main.temp);
    const description = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    weatherPanel.innerHTML = `
        <div class="weather-info">
            <img src="${iconUrl}" alt="${description}">
            <div>
                <span class="temp">${temp}°C</span>
                <p class="description">${description}</p>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', getWeatherData);

// NASA APOD API - Φωτογραφία της Ημέρας
const apodContainer = document.getElementById('apod-container');
const apodApiKey = 'A7TJqR1Gt8ul54EfMKpyb0ltazHIEUNvBo6smK8J';

async function fetchApod() {
    try {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apodApiKey}`);
        if (!res.ok) throw new Error('Αποτυχία φόρτωσης φωτογραφίας');
        const data = await res.json();

        apodContainer.innerHTML = `
            <img src="${data.url}" alt="${data.title}" class="apod-image">
            <div class="apod-content">
                <h4>${data.title}</h4>
                <p class="apod-explanation">${data.explanation}</p>
            </div>
        `;
    } catch (err) {
        console.error(err);
        apodContainer.innerHTML = `<p>Η φωτογραφία δεν είναι διαθέσιμη.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchApod);
const apiKey = "DEMO_KEY"; // βάλτο με το δικό σου API Key
fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("title").innerText = data.title;
        document.getElementById("explanation").innerText = data.explanation;
        if (data.media_type === "image") {
            document.getElementById("apod").src = data.url;
        } else {
            document.getElementById("apod").alt = "Η Φωτογραφία της Ημέρας είναι βίντεο σήμερα.";
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("title").innerText = "Δεν ήταν δυνατή η φόρτωση της εικόνας σήμερα.";
    });
