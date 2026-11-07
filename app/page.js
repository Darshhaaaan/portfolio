'use client'

import { useEffect, useRef, useState } from 'react'
import CursorDrivenParticleTypography from './CursorDrivenParticleTypography'
import ScrollSplitSkills from '../components/ScrollSplitSkills'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────────────────────────────────── */
function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const trail = document.getElementById('cursor-trail')
    if (!cursor || !trail) return

    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
      trail.style.left = e.clientX + 'px'
      trail.style.top = e.clientY + 'px'
    }

    const expand = () => {
      cursor.style.width = '20px'
      cursor.style.height = '20px'
    }
    const shrink = () => {
      cursor.style.width = '12px'
      cursor.style.height = '12px'
    }

    document.addEventListener('mousemove', onMove)

    const targets = document.querySelectorAll('a, button, .proj-item, .stat-card, .chip')
    targets.forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', expand)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   WELCOME
───────────────────────────────────────────────────────────────────────── */
function Welcome() {
  const [entered, setEntered] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.classList.add('welcome-active')

    const enterTimer = setTimeout(() => {
      setEntered(true)
    }, 50)

    const exitTimer = setTimeout(() => {
      setExiting(true)
    }, 2300)

    const removeTimer = setTimeout(() => {
      setGone(true)
      document.body.classList.remove('welcome-active')
    }, 3400)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
      document.body.classList.remove('welcome-active')
    }
  }, [])

  if (gone) return null

  return (
    <div className={`welcome-screen ${exiting ? 'exit' : ''}`}>

      <div className={`welcome-panel ${entered ? 'entered' : ''}`}>

        <div className={`welcome-stamp ${entered ? 'show' : ''}`}>

          <h1>DARSHAN<span>.</span></h1>

          <div className="welcome-stamp-line" />

          <p>FULL STACK DEVELOPER · BANGALORE</p>

        </div>

      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">D<span>.</span></div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Work</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────── */
const MARQUEE_TEXT = 'NEXT.JS · REACT · NODE.JS · EXPRESS · MONGODB · POSTGRESQL · MYSQL · CSS MODULES · '

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />

      <div className="hero-content">
        <p className="hero-welcome-small">welcome to</p>

        <p className="hero-welcome-large">
          Darshan<em>&apos;s</em> Portfolio
        </p>

        <p className="hero-eyebrow">Available for projects</p>

        <div
          className="hero-h1 hero-particle-heading"
          role="heading"
          aria-level="1"
        >
          <CursorDrivenParticleTypography
            text={'Full Stack\nDeveloper.'}
            fontSize={160}
            letterSpacing={5}
            particleSize={1.8}
            particleDensity={5}
            dispersionStrength={15}
            returnSpeed={0.08}
          />
        </div>

        <p className="hero-sub">
          I&apos;m Darshan — I build fast, scalable web experiences from pixel to server.
          React, Next.js, Node.js — I do it all, end to end.
        </p>

        <div className="hero-ctas">
          <a href="#projects" className="btn-primary">
            View my work
          </a>
          <a href="#contact" className="btn-ghost">
            Let&apos;s collaborate →
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-text">scroll</span>
      </div>

      <div className="hero-marquee-wrap">
        <div className="hero-marquee">
          {MARQUEE_TEXT}{MARQUEE_TEXT}
        </div>
      </div>
    </section>
  )
}
function ScrollRevealText({ text }) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.2, 1]
  )

  return (
    <motion.p
      ref={ref}
      className="about-para scroll-reveal-text"
      style={{ opacity }}
    >
      {text}
    </motion.p>
  )
}
/* ─────────────────────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section className="about" id="about">
      <div className="about-grid reveal">

        {/* LEFT SIDE — ABOUT TEXT */}
        <div className="about-text">
          <p className="section-label">About me</p>

          <h2 className="about-h2">
            Building the <span>web</span>,<br />
            one layer at a time.
          </h2>

          <ScrollRevealText
            text="I'm a full-stack web developer with ~1.5 years of hands-on experience crafting digital products from the ground up. I work across the entire stack — from pixel-perfect frontends to robust, optimized backends."
          />

          <ScrollRevealText
            text="My approach: write clean, scalable code that performs under pressure. I've built and optimized systems designed for thousands of concurrent users, making sure performance never becomes a bottleneck."
          />

          <span className="about-badge">
            Open to freelance &amp; full-time roles
          </span>
        </div>

        {/* RIGHT SIDE — THREE STAT CARDS */}
        <div className="about-stats sticky-stat-stack">

          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <div>
              <span className="stat-num">1.5+</span>
              <span className="stat-label">Developing experience</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🚀</span>
            <div>
              <span className="stat-num">
                Building<span className="accent-dot">.</span>
              </span>
              <span className="stat-label">
                Dynamic and optimized solutions
              </span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🛠</span>
            <div>
              <span className="stat-num">Full.</span>
              <span className="stat-label">
                End-to-end stack coverage — nothing outsourced
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
/* ─────────────────────────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: '01',
    name: 'ByThePound',
    tags: ['Next.js', 'Node.js', 'Express', 'MongoDB'],
    desc: 'Experimental full-stack ecommerce platform with user & admin panel.',
    detail:
      'ByThePound is a full-stack experimental ecommerce site built with Next.js on the frontend and Node.js + Express on the backend, with MongoDB as the database. It features a complete shopping experience including a product catalogue, cart system, checkout flow, and a fully separate admin panel for managing products, orders, and users. Built to explore the end-to-end complexity of ecommerce architecture.',
    stack: [
      { tech: 'Next.js', role: 'Frontend framework + SSR' },
      { tech: 'Node.js + Express', role: 'REST API server' },
      { tech: 'MongoDB', role: 'NoSQL database for products/orders/users' },
      { tech: 'CSS Modules', role: 'Styling' },
    ],
  },
  {
    num: '02',
    name: 'HerSpace',
    tags: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'AI API'],
    desc: 'A safe global forum for women and young girls, powered by AI.',
    detail:
      'HerSpace is a full-stack community platform built to connect women across the world and give young girls going through puberty a safe, judgment-free space to ask questions that are considered taboo in many cultures. It integrates a third-party AI API to assist with responses and content moderation. Built with Next.js and Node.js + Express, backed by MongoDB. The platform features a forum system, threaded discussions, and AI-assisted Q&A.',
    stack: [
      { tech: 'Next.js', role: 'Frontend + SSR' },
      { tech: 'Node.js + Express', role: 'Backend API' },
      { tech: 'MongoDB', role: 'Database' },
      { tech: 'Third-party AI API', role: 'Intelligent Q&A and moderation' },
    ],
  },
  {
    num: '03',
    name: 'Book Recommender',
    tags: ['React', 'Node.js', 'Web Scraping'],
    desc: 'Dynamic personality quiz that web-scrapes and recommends books tailored to you.',
    detail:
      'A full-stack web scraping application that recommends books based on a dynamic personality quiz. The quiz questions adapt based on your previous answers — branching logic that narrows down your reading personality. The backend scrapes book data in real time and returns personalised recommendations. Built with React on the frontend and Node.js on the backend, with dynamic question trees powering the quiz engine.',
    stack: [
      { tech: 'React', role: 'Frontend UI + quiz engine' },
      { tech: 'Node.js', role: 'Backend + scraping logic' },
      { tech: 'Dynamic branching quiz', role: 'Questions change based on prior answers' },
      { tech: 'Web Scraping', role: 'Real-time book data retrieval' },
    ],
  },
]
const SKILL_CATS = [
  {
    num: '01',
    title: 'Frontend / UI & Rendering',
    chips: [
      { label: 'Next.js', hot: true },
      { label: 'React', hot: true },
      { label: 'CSS Modules', hot: true },
      { label: 'Tailwind', hot: false },
      { label: 'HTML5', hot: false },
      { label: 'Animations', hot: false },
    ],
  },
  {
    num: '02',
    title: 'Backend / Server & API',
    chips: [
      { label: 'Node.js', hot: true },
      { label: 'Express.js', hot: true },
      { label: 'REST APIs', hot: false },
      { label: 'Auth & JWT', hot: false },
      { label: 'Middleware', hot: false },
    ],
  },
  {
    num: '03',
    title: 'Database / Data & Storage',
    chips: [
      { label: 'PostgreSQL', hot: true },
      { label: 'MySQL', hot: true },
      { label: 'MongoDB', hot: true },
      { label: 'Mongoose', hot: false },
      { label: 'SQL Queries', hot: false },
      { label: 'Indexing', hot: false },
    ],
  },
  {
    num: '04',
    title: 'Perf & Tools / Optimization',
    chips: [
      { label: 'Code Splitting', hot: true },
      { label: 'Caching', hot: true },
      { label: 'Git & GitHub', hot: false },
      { label: 'Query Tuning', hot: false },
      { label: 'Load Testing', hot: false },
      { label: 'SSR/SSG', hot: false },
    ],
  },
]
function Projects() {
  const [openProject, setOpenProject] = useState(null)

  return (
    <section className="projects" id="projects">
      <div className="projects-header reveal">
        <p className="section-label">Selected work</p>
        <h2 className="projects-h2">
          Projects <em>&amp;</em> experiments.
        </h2>
      </div>

      <div className="project-stack">
        {PROJECTS.map((proj, index) => (
          <div
            key={proj.num}
            className="project-stack-card"
            style={{ '--card-index': index }}
            onClick={() => setOpenProject(proj)}
          >
            <div className="project-card-top">
              <span className="proj-num">{proj.num} / 03</span>
              <span className="proj-arrow">↗</span>
            </div>

            <div className="project-card-content">
              <h3 className="project-card-title">{proj.name}</h3>

              <p className="project-card-desc">{proj.desc}</p>

              <div className="proj-tags">
                {proj.tags.map(t => (
                  <span key={t} className="proj-tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="project-card-bottom">
              <span>EXPLORE PROJECT</span>
              <span>CLICK TO VIEW DETAILS ↗</span>
            </div>
          </div>
        ))}
      </div>

      {openProject && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenProject(null)
          }}
        >
          <div className="modal-card">
            <button
              className="modal-close"
              onClick={() => setOpenProject(null)}
            >
              ×
            </button>

            <h3 className="modal-title">{openProject.name}</h3>

            <div className="modal-chips">
              {openProject.tags.map(t => (
                <span key={t} className="modal-chip">{t}</span>
              ))}
            </div>

            <p className="modal-desc">{openProject.detail}</p>

            <p className="modal-stack-title">Stack breakdown</p>

            {openProject.stack.map((s) => (
              <div key={s.tech} className="modal-stack-item">
                <span className="modal-stack-dot" />
                <span>
                  <span className="modal-stack-tech">{s.tech}</span>
                  — {s.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
/* ─────────────────────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (data.success) {
      alert('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } else {
      alert(data.error || 'Something went wrong')
    }
  } catch (err) {
    console.error(err)
    alert('Server error')
  }
}

  return (
    <section className="contact" id="contact">
      <span className="contact-ghost" aria-hidden>TALK</span>

      <div className="contact-grid">
        <div className="reveal">
          <p className="section-label">Get in touch</p>
          <h2 className="contact-h2">
            Got a project<br />in <em>mind?</em>
          </h2>
          <p className="contact-blurb">
            Whether it&apos;s a freelance project, a full-time role, or just a chat about
            tech — I&apos;m open. Let&apos;s build something great together.
          </p>
          <div className="contact-socials">
            {/* <a href="mailto:darshan@example.com" className="contact-social-link">
              <span className="contact-social-dot" />
              darshan@example.com
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <span className="contact-social-dot" />
              github.com/darshan
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <span className="contact-social-dot" />
              linkedin.com/in/darshan
            </a>*/}
          </div>
        </div>

        <div className="reveal">
          <div className="contact-form">
            <div className="form-field">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              className="btn-submit"
              onClick={handleSubmit}
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <span>
        © 2026 <span className="footer-name">Darshan</span>. All rights reserved.
      </span>
      <span>
        Designed &amp; built with <span className="footer-heart">❤</span>
      </span>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGE (ROOT)
───────────────────────────────────────────────────────────────────────── */
export default function Page() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const revealEls = document.querySelectorAll('.reveal')
    revealEls.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Cursor />
      <Welcome />
      <Nav />
      <main>
  <Hero />
  <About />

  {/* New animated Tech Stack */}
  <ScrollSplitSkills cards={SKILL_CATS} />

  {/* Original sections — preserve these */}
  <Projects />
  <Contact />
</main>
      <Footer />
    </>
  )
}
