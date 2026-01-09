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

// Smooth page transition
function createSmoothTransition(link, href) {
  // Create transition overlay if it doesn't exist
  let transition = document.getElementById('page-transition');
  if (!transition) {
    transition = document.createElement('div');
    transition.id = 'page-transition';
    document.body.appendChild(transition);
  }
  
  const rect = link.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Set origin point for smooth expansion
  transition.style.transformOrigin = `${centerX}px ${centerY}px`;
  transition.style.left = '0';
  transition.style.top = '0';
  transition.style.opacity = '0';
  transition.style.transform = 'scale(0)';
  
  // Force reflow to ensure initial state
  transition.offsetHeight;
  
  // Activate transition with smooth animation
  requestAnimationFrame(() => {
    transition.classList.add('active');
  });
  
  // Navigate after animation completes
  setTimeout(() => {
    window.location.href = href;
  }, 500);
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

  // Smooth click animations for week cards
  const weekCards = document.querySelectorAll('.week-card');
  weekCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      // Immediate feedback with smooth scale
      this.style.transform = 'scale(0.96)';
      this.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Start transition after brief delay for tactile feedback
      requestAnimationFrame(() => {
        setTimeout(() => {
          createSmoothTransition(this, href);
        }, 80);
      });
    });
  });

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
