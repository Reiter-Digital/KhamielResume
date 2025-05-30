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
    console.log('Starting to load experience data');
    
    // Force cache reload - IMPORTANT: This might be the issue with stale data
    const cacheBuster = new Date().getTime();
    
    // Get the base URL for assets based on environment
    const baseURL = window.location.pathname.includes('/KhamielResume/') ? '/KhamielResume' : '';
    console.log('Base URL determined as:', baseURL);
    
    // Try multiple paths to handle both development and production environments
    let response;
    const paths = [
      `/data/experience.json?t=${cacheBuster}`,              // Try this first for npm run dev
      `/src/data/experience.json?t=${cacheBuster}`,          // Development path
      `${baseURL}/data/experience.json?t=${cacheBuster}`,    // Production path with base
      `./data/experience.json?t=${cacheBuster}`,             // Relative path
      `data/experience.json?t=${cacheBuster}`                // Another relative path
    ];
    
    // Try each path until one works
    let error;
    let successPath;
    for (const path of paths) {
      try {
        console.log(`Attempting to fetch from ${path}`);
        response = await fetch(path, {
          priority: 'high',
          cache: 'no-store' // Force fresh data
        });
        if (response.ok) {
          successPath = path;
          console.log(`Successfully fetched from ${path}`);
          break;
        }
      } catch (e) {
        error = e;
        console.log(`Failed to fetch from ${path}:`, e);
      }
    }
    
    if (!response || !response.ok) {
      throw error || new Error('Failed to fetch experience data from all paths');
    }
    const data = await response.json();
    console.log("Loaded data from", successPath, ":", data);
    console.log("Data has research?", Boolean(data.research));
    console.log("Data has references?", Boolean(data.references));
    
    // Prioritize above-the-fold content first
    if (data.experiences) {
      console.log("Rendering timeline with", data.experiences.length, "experiences");
      renderTimeline(data.experiences);
    } else {
      console.error("No experiences data found");
    }
    
    // Clear all containers first (in case they have stale content)
    document.getElementById('skills-container').innerHTML = '';
    document.getElementById('research-container').innerHTML = '';
    document.getElementById('certifications-container').innerHTML = '';
    document.getElementById('references-container').innerHTML = '';
    
    // Defer below-the-fold content rendering
    setTimeout(() => {
      if (data.skills) {
        console.log("Rendering skills:", data.skills);
        renderSkills(data.skills);
      }
      
      requestAnimationFrame(() => {
        if (data.research) {
          console.log("Rendering research:", data.research);
          renderResearch(data.research);
        } else {
          console.error("No research data found");
        }
        
        if (data.certifications) {
          console.log("Rendering certifications:", data.certifications);
          renderCertifications(data.certifications);
        } else {
          console.error("No certifications data found");
        }
        
        if (data.references) {
          console.log("Rendering references:", data.references);
          renderReferences(data.references);
        } else {
          console.error("No references data found");
        }
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
    const sideClass = isEven ? 'md:pr-10 md:text-left' : 'md:pl-10 md:text-left md:col-start-3';
    const iconClass = exp.type === 'education' ? 'academic-cap' : 'briefcase';
    
    return `
      <div class="relative ${sideClass} mb-12" data-aos="fade-${isEven ? 'right' : 'left'}" data-aos-delay="${index * 100}">
        <div class="glass-card p-6 h-full min-h-[320px] flex flex-col">
          <div class="flex items-center ${isEven ? 'md:justify-start' : 'md:justify-start'} mb-3">
            <svg class="w-5 h-5 text-accent ${isEven ? 'md:order-2 md:ml-2' : 'mr-2'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${iconClass === 'briefcase' ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0v8a2 2 0 01-2 2H10a2 2 0 01-2-2v-8"></path>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"></path>'
              }
            </svg>
            <span class="text-accent font-medium">${exp.startDate} - ${exp.endDate}</span>
          </div>
          
          <div class="flex-grow">
            <h3 class="text-xl font-bold mb-2">${exp.title}</h3>
            <h4 class="text-accent font-medium mb-3">${exp.company} • ${exp.location}</h4>
            <p class="text-gray-300 mb-4">${exp.description}</p>
            
            <div class="mb-4">
              <h5 class="font-medium mb-2">Key Achievements:</h5>
              <ul class="text-sm text-gray-300 space-y-1">
                ${exp.achievements.map(achievement => `<li class="flex items-start"><span class="text-accent mr-2">•</span>${achievement}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="mt-auto flex flex-wrap gap-2">
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

// Render research section
const renderResearch = (research) => {
  console.log('Render research called with:', research);
  const researchContainer = document.getElementById('research-container');
  console.log('Research container found:', researchContainer);
  if (!researchContainer) return;
  if (!research || !Array.isArray(research)) {
    console.error('Research data is not valid:', research);
    return;
  }

  console.log('Generating research HTML for', research.length, 'items');
  const researchHTML = research.map(item => {
    console.log('Processing research item:', item);
    return `
      <div class="glass-card p-6 hover:shadow-accent-glow transition-all duration-300" data-aos="fade-up">
        <div class="flex flex-col gap-4">
          <div class="flex-grow">
            <h3 class="text-xl font-bold mb-2">${item.title}</h3>
            <p class="text-gray-400 mb-2 italic">${item.organization} | ${item.date}</p>
            <p class="text-gray-300 mb-4">${item.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              ${item.technologies.map(tech => `<span class="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">${tech}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');


  console.log('Setting research HTML:', researchHTML.substring(0, 100) + '...');
  researchContainer.innerHTML = researchHTML;
  console.log('Research HTML set');
};

// Render certifications section
const renderCertifications = (certifications) => {
  const certificationsContainer = document.getElementById('certifications-container');
  if (!certificationsContainer || !certifications) return;

  console.log('Rendering certifications:', certifications);

  // Remove ISO certification if present (only show first one)
  const filteredCertifications = certifications.length > 1 ? [certifications[0]] : certifications;
  console.log('Filtered certifications:', filteredCertifications);

  const certificationsHTML = filteredCertifications.map(cert => {
    return `
      <div class="glass-card overflow-hidden" data-aos="fade-up">
        <div class="p-6">
          <div class="mb-4 flex items-center justify-center bg-accent/20 w-12 h-12 rounded-full">
            <span class="text-accent font-bold text-2xl">✓</span>
          </div>
          <h3 class="text-xl font-bold mb-2">${cert.title}</h3>
          <p class="text-gray-400 mb-4">${cert.organization}</p>
          <p class="text-gray-300 mb-4">${cert.description}</p>
          <p class="text-gray-400 text-sm italic">Issued: ${cert.date}</p>
        </div>
      </div>
    `;
  }).join('');



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
// Render references section
const renderReferences = (references) => {
  console.log('Render references called with:', references);
  const referencesContainer = document.getElementById('references-container');
  console.log('References container found:', referencesContainer);
  if (!referencesContainer) return;
  if (!references || !Array.isArray(references)) {
    console.error('References data is not valid:', references);
    return;
  }

  console.log('Generating references HTML for', references.length, 'items');
  const referencesHTML = references.map(reference => {
    console.log('Processing reference item:', reference);
    return `
      <div class="glass-card p-6 hover:shadow-accent-glow transition-all duration-300" data-aos="fade-up">
        <div class="flex flex-col gap-2">
          <h3 class="text-xl font-bold">${reference.name}</h3>
          <p class="text-gray-300">${reference.title}</p>
          <a href="mailto:${reference.email}" class="text-accent hover:text-accent-dark transition-colors break-all">
            ${reference.email}
          </a>
        </div>
      </div>
    `;
  }).join('');

  console.log('Setting references HTML:', referencesHTML.substring(0, 100) + '...');
  referencesContainer.innerHTML = referencesHTML;
  console.log('References HTML set');
};

export { initAOS, loadExperienceData };
