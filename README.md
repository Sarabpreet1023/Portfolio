# 🚀 Sarabpreet Singh — Personal Portfolio

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

> A high-end, dark-themed personal portfolio for **Sarabpreet Singh** — Full Stack Developer & .NET Specialist. Built with vanilla HTML, CSS, and JavaScript with GSAP-powered animations.

🌐 **Live Site:** [sarabpreet.github.io](https://sarabpreet.github.io)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Particle Canvas Hero** | Interactive particle field that reacts to mouse movement |
| 🎬 **GSAP Scroll Animations** | Smooth section reveal animations via ScrollTrigger |
| ⌨️ **Typewriter Tagline** | Animated cycling text in the hero |
| 🖱️ **Custom Cursor** | Magnetic cursor with hover glow effects |
| 🃏 **3D Tilt Cards** | Project cards with perspective tilt on hover |
| 🧲 **Magnetic Buttons** | Buttons that subtly follow the cursor |
| 🔢 **Animated Counters** | Stats count up on page load |
| 📊 **Skill Progress Bars** | Animated proficiency bars on scroll |
| 📬 **Working Contact Form** | Powered by Formspree — messages go straight to Gmail |
| 📱 **Fully Responsive** | Optimized for all screen sizes |
| 🌑 **Dark Glassmorphism** | Premium dark aesthetic with glow effects |

---

## 📁 Project Structure

```
sarabpreet-portfolio/
├── index.html          # Main HTML — all sections & structure
├── style.css           # Core styles & CSS custom properties
├── css/
│   └── style.css       # Additional styles
├── js/
│   └── main.js         # GSAP animations, particle canvas, form logic
├── assets/             # Images (profile photo, project screenshots)
└── README.md
```

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup with SEO meta tags
- **Vanilla CSS** — Custom properties, animations, grid & flexbox
- **Vanilla JavaScript** — Zero framework dependencies
- **GSAP 3** — ScrollTrigger & TextPlugin (via CDN)
- **Formspree** — Contact form email delivery
- **Google Fonts** — Outfit + Space Grotesk

---

## 🖥 Running Locally

No build step needed — it's plain HTML/CSS/JS.

```bash
# Option 1: npx serve (recommended)
npx serve .
# Then open http://localhost:3000

# Option 2: Python
python -m http.server 8080
# Then open http://localhost:8080

# Option 3: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

---

## 🌐 Deployment

### GitHub Pages *(Recommended)*
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set branch to `main`, folder to `/ (root)`
4. Live at: `https://<username>.github.io`

### Netlify / Vercel
Drag and drop the project folder at [netlify.com](https://netlify.com) or connect your GitHub repo — zero config needed.

---

## ✏️ Customization

All design tokens live in `style.css` under `:root {}`:

```css
--clr-accent:   #5eead4;   /* Teal  */
--clr-accent-2: #818cf8;   /* Indigo */
--clr-accent-3: #f472b6;   /* Pink  */
```

To update personal info, edit the relevant sections in `index.html`.  
To change the contact form email, replace the Formspree endpoint in `js/main.js`.

---

## 📬 Contact Form Setup

This portfolio uses [Formspree](https://formspree.io) to forward contact form submissions to email.  
The endpoint is already configured. To use your own:
1. Sign up at formspree.io
2. Create a new form → copy your endpoint URL
3. Replace the URL in `js/main.js` → `handleFormSubmit` function

---

© 2025 Sarabpreet Singh. All rights reserved.
