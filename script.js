const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');
const backgroundVideo = document.getElementById('backgroundVideo');

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
        backgroundVideo.querySelector('source').src = 'img/Night.mp4';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
        backgroundVideo.querySelector('source').src = 'img/Clouds.mp4';
    }
    backgroundVideo.load(); // Reload the video with the new source
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    backgroundVideo.querySelector('source').src = 'img/Night.mp4';
    backgroundVideo.load();
}