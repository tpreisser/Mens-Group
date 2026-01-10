// Same Battles - Men's Bible Study Web App
// Main JavaScript functionality

// Audio Player with Media Session API for Lock Screen
class AudioPlayer {
  constructor(container) {
    this.container = container;
    this.audio = container.querySelector('audio');
    this.playButton = container.querySelector('.play-button');
    this.progressBar = container.querySelector('.progress-bar');
    this.progressFill = container.querySelector('.progress-fill');
    this.timeDisplay = container.querySelector('.time-display');
    this.isPlaying = false;
    
    // Get metadata from page
    this.metadata = this.getMetadata();
    
    this.init();
    this.setupMediaSession();
  }

  getMetadata() {
    // Extract week number from page title or URL
    const titleMatch = document.title.match(/Week (\d+):\s*(.+?)\s*-/);
    const weekNumber = titleMatch ? titleMatch[1] : '1';
    const weekTitle = titleMatch ? titleMatch[2].trim() : 'Same Battles';
    
    // Get image path from week image on page - use absolute URL for lock screen
    const weekImage = document.querySelector('.week-image');
    let artworkUrl = weekImage ? weekImage.src : `/assets/images/${weekNumber}.png`;
    
    // Convert relative URL to absolute URL for lock screen
    if (artworkUrl.startsWith('/')) {
      artworkUrl = window.location.origin + artworkUrl;
    } else if (!artworkUrl.startsWith('http')) {
      artworkUrl = window.location.origin + '/' + artworkUrl;
    }
    
    // Get audio filename and convert to readable title
    const audioSrc = this.audio ? this.audio.src : '';
    const audioFileName = audioSrc.split('/').pop().replace('.m4a', '');
    
    // Convert audio filename to readable title
    const audioTitle = this.formatAudioTitle(audioFileName);
    
    return {
      title: audioTitle || weekTitle,
      artist: 'Same Battles - Men\'s Bible Study',
      album: `Week ${weekNumber}: ${weekTitle}`,
      artwork: [
        { src: artworkUrl, sizes: '512x512', type: 'image/png' },
        { src: artworkUrl, sizes: '1024x1024', type: 'image/png' },
        { src: artworkUrl, sizes: '256x256', type: 'image/png' }
      ]
    };
  }

  formatAudioTitle(filename) {
    // Convert underscore-separated filename to readable title
    const titles = {
      'Elijah_s_Post-Victory_Crash_and_Burnout': 'Elijah\'s Post-Victory Crash and Burnout',
      'Facing_Jacob_to_Become_Israel': 'Facing Jacob to Become Israel',
      'The_Powerful_General_Who_Refused_Simple_Cure': 'The Powerful General Who Refused Simple Cure',
      'The_Cost_of_Always_Doing_Right': 'The Cost of Always Doing Right',
      'I_Am_Doing_A_Great_Work': 'I Am Doing A Great Work',
      'Jonathan_Gives_Up_the_Crown_For_David': 'Jonathan Gives Up the Crown For David',
      'Jonah_s_Anger_Over_a_Plant': 'Jonah\'s Anger Over a Plant',
      'The_Whisper_Did_Not_Break_Elijah_s_Script': 'The Whisper Did Not Break Elijah\'s Script',
      'Joseph_s_Thirteen_Years_of_Silent_Preparation': 'Joseph\'s Thirteen Years of Silent Preparation',
      'David_s_Radical_Restraint_in_the_Cave': 'David\'s Radical Restraint in the Cave',
      'Why_King_Solomon_Called_Success_Vapor': 'Why King Solomon Called Success Vapor',
      'Moses\'s_Five_Objections_to_Leadership': 'Moses\'s Five Objections to Leadership'
    };
    
    if (titles[filename]) {
      return titles[filename];
    }
    
    // Fallback: replace underscores with spaces and capitalize
    return filename.replace(/_/g, ' ')
                   .replace(/\s+/g, ' ')
                   .replace(/\b\w/g, char => char.toUpperCase())
                   .replace(/ s /g, '\'s ');
  }

  setupMediaSession() {
    if ('mediaSession' in navigator && this.audio) {
      // Update metadata when audio loads
      const updateMetadata = () => {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.metadata.title,
            artist: this.metadata.artist,
            album: this.metadata.album,
            artwork: this.metadata.artwork
          });
        } catch (e) {
          console.log('Media Session metadata update:', e);
        }
      };

      // Set initial metadata
      updateMetadata();

      // Update metadata when audio is loaded
      this.audio.addEventListener('loadedmetadata', () => {
        this.metadata = this.getMetadata();
        updateMetadata();
      });

      // Handle play/pause from lock screen
      navigator.mediaSession.setActionHandler('play', () => {
        this.audio.play().catch(e => console.log('Play error:', e));
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        this.audio.pause();
      });

      // Handle seek from lock screen
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        const skipTime = details.seekOffset || 10;
        this.audio.currentTime = Math.max(0, this.audio.currentTime - skipTime);
        this.updatePositionState();
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        const skipTime = details.seekOffset || 10;
        this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + skipTime);
        this.updatePositionState();
      });

      // Handle seekto from lock screen (scrubbing)
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== null && !isNaN(details.seekTime)) {
          this.audio.currentTime = details.seekTime;
          this.updatePositionState();
        }
      });

      // Prevent default action handlers if not available
      try {
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      } catch (e) {
        // Some actions may not be supported
      }

      // Update position state when audio metadata loads
      this.audio.addEventListener('loadedmetadata', () => {
        this.updatePositionState();
      });
    }
  }

  updatePositionState() {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
      if (this.audio.duration) {
        navigator.mediaSession.setPositionState({
          duration: this.audio.duration,
          playbackRate: this.audio.playbackRate,
          position: this.audio.currentTime
        });
      }
    }
  }

  init() {
    if (!this.audio) return;

    // Event listeners
    this.playButton.addEventListener('click', () => this.togglePlay());
    
    // Skip back button (skip backward 10 seconds)
    const skipBackButton = this.container.querySelector('.skip-back-button');
    if (skipBackButton) {
      skipBackButton.addEventListener('click', () => {
        if (this.audio.duration) {
          this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
          this.updatePositionState();
        }
      });
    }
    
    // Skip forward button (skip forward 10 seconds)
    const skipButton = this.container.querySelector('.skip-button');
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        if (this.audio.duration) {
          this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
          this.updatePositionState();
        }
      });
    }
    
    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => this.seek(e));
    }
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateTime();
      // Update metadata after audio loads
      if ('mediaSession' in navigator) {
        this.metadata = this.getMetadata();
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.metadata.title,
            artist: this.metadata.artist,
            album: this.metadata.album,
            artwork: this.metadata.artwork
          });
        } catch (e) {
          console.log('Media Session error:', e);
        }
      }
    });
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('play', () => this.onPlay());
    this.audio.addEventListener('pause', () => this.onPause());
    
    // Set audio attributes for better mobile support
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');
    this.audio.setAttribute('controls', 'false');

    // Touch events for mobile progress bar
    if (this.progressBar) {
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
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      // Ensure metadata is set before playing for lock screen
      this.updateMetadata();
      this.audio.play().catch(e => {
        console.log('Play error:', e);
      });
    }
  }

  updateMetadata() {
    if ('mediaSession' in navigator) {
      // Refresh metadata in case image loaded after page load
      this.metadata = this.getMetadata();
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.metadata.title,
          artist: this.metadata.artist,
          album: this.metadata.album,
          artwork: this.metadata.artwork
        });
      } catch (e) {
        console.log('Media Session metadata update error:', e);
      }
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
      
      // Update position state every second for lock screen scrubbing
      if (this.isPlaying && Math.floor(this.audio.currentTime) % 1 === 0) {
        this.updatePositionState();
      }
    }
  }

  updateTime() {
    if (this.timeDisplay && this.audio.duration) {
      const current = this.formatTime(this.audio.currentTime);
      const total = this.formatTime(this.audio.duration);
      
      // Handle separate left and right time displays
      const timeDisplays = this.container.querySelectorAll('.time-display');
      if (timeDisplays.length >= 2) {
        const leftDisplay = this.container.querySelector('.time-display.left');
        const rightDisplay = this.container.querySelector('.time-display.right');
        if (leftDisplay) leftDisplay.textContent = current;
        if (rightDisplay) rightDisplay.textContent = total;
      } else {
        // Fallback for single time display
        this.timeDisplay.textContent = `${current} / ${total}`;
      }
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
    this.container.querySelector('.audio-controls')?.classList.add('playing');
    
    // Update media session for lock screen
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';
      this.updatePositionState();
    }
  }

  onPause() {
    this.isPlaying = false;
    this.playButton.innerHTML = '▶';
    this.playButton.setAttribute('aria-label', 'Play');
    this.container.querySelector('.audio-controls')?.classList.remove('playing');
    
    // Update media session for lock screen
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
      this.updatePositionState();
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.playButton.innerHTML = '▶';
    this.playButton.setAttribute('aria-label', 'Play');
    this.progressFill.style.width = '0%';
    this.audio.currentTime = 0;
    this.container.querySelector('.audio-controls')?.classList.remove('playing');
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
  
  // Set origin point for smooth expansion (center of clicked card)
  transition.style.transformOrigin = `${centerX}px ${centerY}px`;
  transition.style.left = '0';
  transition.style.top = '0';
  transition.style.width = '100%';
  transition.style.height = '100%';
  transition.style.opacity = '0';
  transition.style.transform = 'scale(0)';
  transition.style.display = 'block';
  
  // Remove active class if present from previous transition
  transition.classList.remove('active');
  
  // Force reflow to ensure initial state is applied
  void transition.offsetHeight;
  
  // Activate transition with smooth animation (use double RAF for better timing)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      transition.classList.add('active');
    });
  });
  
  // Navigate after animation completes
  setTimeout(() => {
    window.location.href = href;
  }, 500);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set base path for GitHub Pages
  var basePath = window.BASE_PATH || '/';
  if (!window.BASE_PATH) {
    var path = window.location.pathname;
    basePath = path.includes('/Mens-Group/') ? '/Mens-Group/' : '/';
    window.BASE_PATH = basePath;
  }
  
  // Fix background images from data-bg attributes
  const bgImages = document.querySelectorAll('[data-bg]');
  bgImages.forEach(function(img) {
    var bgPath = img.getAttribute('data-bg');
    if (bgPath) {
    var fullPath = basePath + bgPath;
    img.style.backgroundImage = 'url(' + fullPath + ')';
  }
  });
  
  // Initialize audio players
  const audioContainers = document.querySelectorAll('.audio-player-container');
  audioContainers.forEach(container => {
    new AudioPlayer(container);
  });

  // Initialize collapsible reading sections
  const readingToggles = document.querySelectorAll('.reading-toggle');
  readingToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const readingText = this.nextElementSibling;
      
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        if (readingText) {
          readingText.style.maxHeight = '0';
          readingText.style.paddingTop = '0';
          readingText.style.paddingBottom = '0';
        }
      } else {
        this.setAttribute('aria-expanded', 'true');
        if (readingText) {
          const fullHeight = readingText.scrollHeight;
          readingText.style.maxHeight = fullHeight + 'px';
          readingText.style.paddingTop = '2rem';
          readingText.style.paddingBottom = '2rem';
        }
      }
    });
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
    // Register service worker with correct path
    var swPath = (window.BASE_PATH || '/') + 'sw.js';
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
