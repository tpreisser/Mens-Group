// Same Battles - Men's Bible Study Web App
// Main JavaScript functionality

// Audio Player
class AudioPlayer {
  constructor(container) {
    this.container = container;
    this.audio = container.querySelector('audio');
    this.playButton = container.querySelector('.play-button');
    this.progressBar = container.querySelector('.progress-bar');
    this.progressFill = container.querySelector('.progress-fill');
    this.timeDisplay = container.querySelector('.time-display');
    this.isPlaying = false;
    
    this.init();
  }

  init() {
    if (!this.audio) return;

    // Event listeners
    this.playButton.addEventListener('click', () => this.togglePlay());
    this.progressBar.addEventListener('click', (e) => this.seek(e));
    this.audio.addEventListener('loadedmetadata', () => this.updateTime());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('play', () => this.onPlay());
    this.audio.addEventListener('pause', () => this.onPause());

    // Touch events for mobile
    let touchStartX = 0;
    this.progressBar.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    this.progressBar.addEventListener('touchend', (e) => {
      if (Math.abs(e.changedTouches[0].clientX - touchStartX) < 10) {
        this.seek(e);
      }
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  seek(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX) || (e.changedTouches && e.changedTouches[0].clientX);
    const clickX = x - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    this.audio.currentTime = percentage * this.audio.duration;
  }

  updateProgress() {
    if (this.audio.duration) {
      const percentage = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressFill.style.width = percentage + '%';
      this.updateTime();
    }
  }

  updateTime() {
    if (this.timeDisplay && this.audio.duration) {
      const current = this.formatTime(this.audio.currentTime);
      const total = this.formatTime(this.audio.duration);
      this.timeDisplay.textContent = `${current} / ${total}`;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onPlay() {
    this.isPlaying = true;
    this.playButton.innerHTML = '⏸';
    this.playButton.setAttribute('aria-label', 'Pause');
  }

  onPause() {
    this.isPlaying = false;
    this.playButton.innerHTML = '▶';
    this.playButton.setAttribute('aria-label', 'Play');
  }

  onEnded() {
    this.isPlaying = false;
    this.playButton.innerHTML = '▶';
    this.playButton.setAttribute('aria-label', 'Play');
    this.progressFill.style.width = '0%';
    this.audio.currentTime = 0;
  }
}

// Lazy Loading Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.add('loaded');
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize audio players
  const audioContainers = document.querySelectorAll('.audio-player-container');
  audioContainers.forEach(container => {
    new AudioPlayer(container);
  });

  // Initialize lazy loading
  initLazyLoading();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
