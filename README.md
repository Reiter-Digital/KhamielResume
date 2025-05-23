# Shuet Khamiel Apoyon - Resume Website

A production-ready static resume timeline site built with modern web technologies and optimized for GitHub Pages deployment.

## 🚀 Quick Start (90 seconds)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/KhamielResume.git
cd KhamielResume

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Tech Stack

- **HTML5 + Tailwind CSS v3.4** - Utility-first styling with JIT compilation
- **Vanilla ES6 JavaScript** - Lightweight, no framework dependencies
- **AOS v2.3.4** - Scroll-driven animations with accessibility support
- **Vite** - Fast build tool with asset optimization
- **GitHub Pages** - Static site hosting

## 📁 Project Structure

```
/
├── index.html                 # Main HTML file
├── vite.config.js            # Vite configuration
├── tailwind.config.cjs       # Tailwind CSS configuration
├── postcss.config.cjs        # PostCSS configuration
├── src/
│   ├── assets/
│   │   ├── pdf/resume.pdf    # Resume PDF file
│   │   ├── img/              # Images directory
│   │   └── icons/            # Icons directory
│   ├── styles/main.css       # Main stylesheet
│   ├── data/experience.json  # Timeline and content data
│   └── main.js               # JavaScript functionality
└── package.json              # Dependencies and scripts
```

## 🎨 Features

- **Responsive Design** - Mobile-first approach with smooth desktop scaling
- **Dark Theme** - Modern dark UI with accent colors
- **Scroll Animations** - AOS-powered reveal animations with reduced motion support
- **Glass Morphism** - Modern card designs with backdrop blur effects
- **Timeline Layout** - Alternating left/right timeline on desktop, stacked on mobile
- **Performance Optimized** - < 200kB first load, lazy loading, critical CSS inlining
- **SEO Ready** - Complete meta tags, Open Graph, and Twitter cards
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

## 📝 Customization

### 1. Update Personal Information

Edit the main content in `index.html`:
- Name and title in the hero section
- Contact links in the footer
- Meta tags for SEO

### 2. Update Experience Data

Modify `src/data/experience.json`:
- Add/remove timeline entries
- Update skills and technologies
- Modify project information

### 3. Replace Resume PDF

Replace `src/assets/pdf/resume.pdf` with your actual resume (max 4MB recommended).

### 4. Add Images

Place images in `src/assets/img/` and update references in:
- Project thumbnails in `experience.json`
- Open Graph image in `index.html`

### 5. Customize Styling

Modify colors and styling in `tailwind.config.cjs`:
- Update color palette
- Adjust fonts and spacing
- Add custom animations

## 🚀 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Run `npm run deploy` to build and deploy to `gh-pages` branch
3. Enable GitHub Pages in repository settings
4. Your site will be available at `https://yourusername.github.io/repositoryname`

### Manual Deployment

1. Run `npm run build`
2. Upload the `dist/` folder contents to your hosting provider
3. Ensure `.nojekyll` file is included for GitHub Pages compatibility

## 📋 NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with optimizations
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

## 🎯 Performance

- **Bundle Size**: < 20kB JavaScript
- **First Load**: < 200kB total
- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience

## 🔧 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - feel free to use this template for your own resume!

## 🤝 Contributing

Issues and pull requests are welcome! Please feel free to contribute improvements.

---

Built with ❤️ using modern web technologies
