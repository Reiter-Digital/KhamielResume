import AOS from 'aos';
import 'aos/dist/aos.css';

// Handle DOM initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile menu (should be first as it's critical for navigation)
  initMobileMenu();
  
  // Load content
  loadExperienceData();

  // Defer AOS initialization slightly with fallback for browsers without requestIdleCallback
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      initAOS();
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      initAOS();
    }, 200);
  }
});

// Make sure these are defined before DOMContentLoaded for proper initialization
window.toggleMobileMenu = () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.classList.toggle('mobile-menu-btn-open');
    mobileMenu.classList.toggle('mobile-menu-open');
    document.body.style.overflow = mobileMenu.classList.contains('mobile-menu-open') ? 'hidden' : '';
  }
};

// Initialize AOS with reduced motion support
const initAOS = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 100
    });
  }
};

// Intersection Observer fallback for browsers that don't support AOS
const initIntersectionObserver = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
};

// Load and render experience data with performance optimizations
const loadExperienceData = async () => {
  try {
    // Get the base URL for assets based on environment
    const baseURL = window.location.pathname.includes('/KhamielResume/') ? '/KhamielResume' : '';
    
    // Try multiple paths to handle both development and production environments
    let response;
    const paths = [
      '/src/data/experience.json',          // Development path
      '/data/experience.json',              // Production path without base
      `${baseURL}/data/experience.json`,    // Production path with base
      './data/experience.json',             // Relative path
      'data/experience.json'                // Another relative path
    ];
    
    // Try each path until one works
    let error;
    for (const path of paths) {
      try {
        response = await fetch(path, {
          priority: 'high',
          cache: 'force-cache'
        });
        if (response.ok) break;
      } catch (e) {
        error = e;
        console.log(`Failed to fetch from ${path}:`, e);
      }
    }
    
    if (!response || !response.ok) {
      throw error || new Error('Failed to fetch experience data from all paths');
    }
    const data = await response.json();
    
    // Prioritize above-the-fold content first
    renderTimeline(data.experiences);
    
    // Defer below-the-fold content rendering
    setTimeout(() => {
      renderSkills(data.skills);
      requestAnimationFrame(() => {
        renderProjects(data.projects);
        renderCertifications(data.certifications);
      });
    }, 0);
  } catch (error) {
    console.error('Error loading experience data:', error);
  }
};

// Render timeline section
const renderTimeline = (experiences) => {
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) return;

  const timelineHTML = experiences.map((exp, index) => {
    const isEven = index % 2 === 0;
    const sideClass = isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left md:col-start-3';
    const iconClass = exp.type === 'education' ? 'academic-cap' : 'briefcase';
    
    return `
      <div class="relative ${sideClass} mb-12" data-aos="fade-${isEven ? 'right' : 'left'}" data-aos-delay="${index * 100}">
        <div class="glass-card p-6">
          <div class="flex items-center ${isEven ? 'md:justify-end' : 'justify-start'} mb-3">
            <svg class="w-5 h-5 text-accent ${isEven ? 'md:order-2 md:ml-2' : 'mr-2'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${iconClass === 'briefcase' ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8"></path>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"></path>'
              }
            </svg>
            <span class="text-accent font-medium">${exp.startDate} - ${exp.endDate}</span>
          </div>
          
          <h3 class="text-xl font-bold mb-2">${exp.title}</h3>
          <h4 class="text-accent font-medium mb-3">${exp.company} • ${exp.location}</h4>
          <p class="text-gray-300 mb-4">${exp.description}</p>
          
          <div class="mb-4">
            <h5 class="font-medium mb-2">Key Achievements:</h5>
            <ul class="text-sm text-gray-300 space-y-1">
              ${exp.achievements.map(achievement => `<li class="flex items-start"><span class="text-accent mr-2">•</span>${achievement}</li>`).join('')}
            </ul>
          </div>
          
          <div class="flex flex-wrap gap-2">
            ${exp.technologies.map(tech => `<span class="skill-pill text-xs">${tech}</span>`).join('')}
          </div>
        </div>
        <div class="timeline-dot"></div>
      </div>
    `;
  }).join('');

  timelineContainer.innerHTML = timelineHTML;
};

// Render skills section
const renderSkills = (skills) => {
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;

  const skillsHTML = `
    <div class="skill-category-box mb-12" data-aos="fade-up"> 
      <h3 class="text-2xl font-semibold mb-6 text-center text-white">Technical Skills</h3>
      <ul class="skill-list grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        ${skills.technical.map(skill => `<li class="skill-list-item bg-accent bg-opacity-10 p-4 rounded-lg text-center text-accent border border-accent border-opacity-20 hover:bg-accent hover:bg-opacity-15 transition-all duration-200 shadow-lg">${skill}</li>`).join('')}
      </ul>
    </div>
    
    <div class="skill-category-box" data-aos="fade-up" data-aos-delay="100">
      <h3 class="text-2xl font-semibold mb-6 text-center text-white">Soft Skills</h3>
      <ul class="skill-list grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        ${skills.soft.map(skill => `<li class="skill-list-item bg-accent bg-opacity-10 p-4 rounded-lg text-center text-accent border border-accent border-opacity-20 hover:bg-accent hover:bg-opacity-15 transition-all duration-200 shadow-lg">${skill}</li>`).join('')}
      </ul>
    </div>
  `;

  skillsContainer.innerHTML = skillsHTML;
};

// Render projects section
const renderProjects = (projects) => {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;

  // Function to fix image paths to work in both development and production
  const fixImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    // Get the base URL for assets based on environment
    const baseURL = window.location.pathname.includes('/KhamielResume/') ? '/KhamielResume' : '';
    
    // If we're in production (GitHub Pages), prepend the base URL
    if (baseURL && imagePath.startsWith('/')) {
      // For paths that start with /assets or /src/assets
      if (imagePath.includes('/assets/')) {
        // Normalize the path to remove /src if present
        const normalizedPath = imagePath.replace(/^\/src\/assets/, '/assets');
        return `${baseURL}${normalizedPath}`;
      }
    }
    
    // For development environment
    if (imagePath.startsWith('/assets/')) {
      return `/src${imagePath}`;
    }
    
    // Default case - return the path as is
    return imagePath;
  };

  const projectsHTML = projects.map((project, index) => `
    <div class="glass-card overflow-hidden" data-aos="fade-up" data-aos-delay="${index * 100}">
      <div class="aspect-video bg-slate-800 bg-opacity-50 flex items-center justify-center">
        ${project.image ? `<img src="${fixImagePath(project.image)}" alt="${project.title}" class="w-full h-full object-contain p-4" loading="lazy">` :
          `<svg class="w-16 h-16 text-accent opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>`
        }
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-3">${project.title}</h3>
        <p class="text-gray-300 mb-4">${project.description}</p>
        <div class="flex flex-wrap gap-2">
          ${project.technologies.map(tech => `<span class="skill-pill text-xs">${tech}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  projectsContainer.innerHTML = projectsHTML;
};

// Render certifications section
const renderCertifications = (certifications) => {
  const certificationsContainer = document.getElementById('certifications-container');
  if (!certificationsContainer || !certifications) return;

  const certificationsHTML = certifications.map((cert, index) => `
    <div class="glass-card p-6" data-aos="fade-up" data-aos-delay="${index * 100}">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold">${cert.title}</h3>
      </div>
      <div class="ml-13">
        <p class="text-accent font-medium mb-2">${cert.organization}</p>
        <p class="text-gray-300 mb-3">${cert.description}</p>
        <p class="text-gray-400 text-sm">Issued: ${cert.date}</p>
      </div>
    </div>
  `).join('');

  certificationsContainer.innerHTML = certificationsHTML;
};

// Mobile menu functionality
const initMobileMenu = () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('mobile-menu-btn-open');
      mobileMenu.classList.toggle('mobile-menu-open');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = mobileMenu.classList.contains('mobile-menu-open') ? 'hidden' : '';
    });
    
    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('mobile-menu-btn-open');
        mobileMenu.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenuBtn.classList.remove('mobile-menu-btn-open');
        mobileMenu.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mobileMenuBtn.classList.remove('mobile-menu-btn-open');
        mobileMenu.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      }
    });
  }
};

// Optimize touch interactions for mobile
const optimizeTouchInteractions = () => {
  // Add touch feedback for buttons
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .skill-pill');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', () => {
      button.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('touchend', () => {
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  });
  
  // Improve scroll behavior on mobile
  if ('scrollBehavior' in document.documentElement.style) {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

// Smooth scroll for navigation links
const initSmoothScroll = () => {
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
};

// Add floating animation to hero elements
const initFloatingAnimation = () => {
  const heroElements = document.querySelectorAll('.float-animation');
  heroElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.5}s`;
  });
};

// Initialize scroll indicator functionality
const initScrollIndicator = () => {
  const scrollIndicator = document.querySelector('.scroll-indicator-container');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const timelineSection = document.getElementById('timeline');
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    // Add hover effect
    scrollIndicator.addEventListener('mouseenter', () => {
      scrollIndicator.style.transform = 'translateY(-5px) translateX(-50%)';
      scrollIndicator.style.opacity = '1';
    });
    
    scrollIndicator.addEventListener('mouseleave', () => {
      scrollIndicator.style.transform = 'translateY(0) translateX(-50%)';
      scrollIndicator.style.opacity = '0.8';
    });
  }
};

// Mobile touch improvements
const addMobileTouchFeedback = () => {
  // Add touch feedback for buttons
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .mobile-nav-link');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.transition = 'transform 0.1s ease';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    button.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Prevent 300ms click delay on mobile
  document.addEventListener('touchstart', function() {}, true);
};

// Performance optimization for mobile
const optimizeForMobile = () => {
  // Disable animations on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-motion');
  }
  
  // Optimize scroll performance
  let ticking = false;
  
  const optimizedScrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Handle scroll events here if needed
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initIntersectionObserver();
  loadExperienceData();
  initSmoothScroll();
  initFloatingAnimation();
  initScrollIndicator();
  initMobileMenu();
  optimizeTouchInteractions();
  addMobileTouchFeedback();
  optimizeForMobile();
  
  // Add some interactive effects
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
});

// Export for potential external use
export { initAOS, loadExperienceData };
