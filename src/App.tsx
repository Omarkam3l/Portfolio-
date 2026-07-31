import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-scroll';
import {
  Github, Linkedin, Mail, ExternalLink, Download, Upload,
  Plus, Calendar, Building2, GraduationCap, Award, Send,
  Trash2, Edit, Save, Menu, X, Code2, Server, Database,
  Cloud, GitBranch, Terminal, ChevronDown, Check, Eye, Copy, FileText, Cpu, Sparkles
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
interface Skill      { id: string; name: string; category: string; }
interface Experience { id: string; company: string; title: string; duration: string; responsibilities: string[]; }
interface Project    { id: string; title: string; description: string; technologies: string[]; github: string; demo: string; image: string; }
interface Education  { id: string; institution: string; degree: string; years: string; highlights: string; }
interface Certificate{ id: string; title: string; organization: string; date: string; image: string; pdf: string; caption: string; }

/* ─── Skill category colours ────────────────────────────── */
const categoryColor: Record<string, string> = {
  'Languages':     'from-violet-500 to-purple-600',
  'AI & ML':       'from-blue-500 to-cyan-500',
  'LLM & Agents':  'from-teal-500 to-emerald-600',
  'Backend & DB':  'from-emerald-500 to-teal-600',
  'Data & MLOps':  'from-orange-500 to-amber-500',
  'Cloud & DevOps': 'from-pink-500 to-rose-500',
};
const categoryBg: Record<string, string> = {
  'Languages':     'bg-violet-950/60 text-violet-300 border-violet-800/50',
  'AI & ML':       'bg-blue-950/60 text-blue-300 border-blue-800/50',
  'LLM & Agents':  'bg-teal-950/60 text-teal-300 border-teal-800/50',
  'Backend & DB':  'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
  'Data & MLOps':  'bg-orange-950/60 text-orange-300 border-orange-800/50',
  'Cloud & DevOps': 'bg-pink-950/60 text-pink-300 border-pink-800/50',
};

/* ─── useInView hook for scroll animations ──────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── useTyping hook ────────────────────────────────────── */
function useTyping(words: string[], speed = 80, pause = 1800) {
  const [text, setText] = useState('');
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wi];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWi((wi + 1) % words.length); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wi, words, speed, pause]);
  return text;
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function App() {
  /* ─── State ────────────────────────────────────────── */
  const [skills, setSkills] = useState<Skill[]>(() => {
    if (localStorage.getItem('skills_version') !== '6') {
      localStorage.removeItem('skills');
      localStorage.setItem('skills_version', '6');
    }
    const s = localStorage.getItem('skills');
    return s ? JSON.parse(s) : [
      { id:'1', name:'Python',          category:'Languages' },
      { id:'2', name:'SQL',             category:'Languages' },
      { id:'3', name:'TypeScript',      category:'Languages' },
      { id:'4', name:'Bash',            category:'Languages' },

      { id:'5', name:'PyTorch',         category:'AI & ML' },
      { id:'6', name:'TensorFlow',      category:'AI & ML' },
      { id:'7', name:'Scikit-learn',    category:'AI & ML' },
      { id:'8', name:'Hugging Face',    category:'AI & ML' },
      { id:'9', name:'Computer Vision', category:'AI & ML' },
      { id:'10',name:'MMPose',          category:'AI & ML' },

      { id:'11',name:'LangChain',       category:'LLM & Agents' },
      { id:'12',name:'LangGraph',       category:'LLM & Agents' },
      { id:'13',name:'RAG Systems',     category:'LLM & Agents' },
      { id:'14',name:'Multi-Agent',     category:'LLM & Agents' },
      { id:'15',name:'Vector DBs',      category:'LLM & Agents' },
      { id:'16',name:'Semantic Search', category:'LLM & Agents' },

      { id:'17',name:'FastAPI',         category:'Backend & DB' },
      { id:'18',name:'Apache Kafka',    category:'Backend & DB' },
      { id:'19',name:'Temporal',        category:'Backend & DB' },
      { id:'20',name:'PostgreSQL',      category:'Backend & DB' },
      { id:'21',name:'SQLAlchemy 2.0',  category:'Backend & DB' },
      { id:'22',name:'Supabase',        category:'Backend & DB' },

      { id:'23',name:'Apache Spark',    category:'Data & MLOps' },
      { id:'24',name:'Hive',            category:'Data & MLOps' },
      { id:'25',name:'Databricks',      category:'Data & MLOps' },
      { id:'26',name:'Pandas & NumPy',  category:'Data & MLOps' },
      { id:'27',name:'OpenTelemetry',   category:'Data & MLOps' },
      { id:'28',name:'MLflow',          category:'Data & MLOps' },

      { id:'29',name:'Docker',          category:'Cloud & DevOps' },
      { id:'30',name:'AWS (App Runner)',category:'Cloud & DevOps' },
      { id:'31',name:'Azure',           category:'Cloud & DevOps' },
      { id:'32',name:'CI/CD',           category:'Cloud & DevOps' },
      { id:'33',name:'Prometheus',      category:'Cloud & DevOps' },
      { id:'34',name:'Git',             category:'Cloud & DevOps' },
    ];
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    if (localStorage.getItem('exp_version') !== '6') {
      localStorage.removeItem('experiences');
      localStorage.setItem('exp_version', '6');
    }
    const s = localStorage.getItem('experiences');
    return s ? JSON.parse(s) : [
      {
        id:'1', company:'Digital Egypt Pioneers Initiative (DEPI)', title:'AI & Data Science Trainee',
        duration:'April 2024 – October 2024',
        responsibilities:[
          'Completed intensive training in Artificial Intelligence, Machine Learning, and Microsoft Data Engineering.',
          'Built end-to-end machine learning models and automated data engineering pipelines using Python and SQL.',
          'Developed robust ETL pipelines, data warehouses, and interactive business intelligence dashboards.',
          'Applied advanced machine learning techniques to real-world datasets and deployed analytical production solutions.',
        ]
      }
    ];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    if (localStorage.getItem('projects_version') !== '6') {
      localStorage.removeItem('projects');
      localStorage.setItem('projects_version', '6');
    }
    const s = localStorage.getItem('projects');
    return s ? JSON.parse(s) : [
      {
        id:'1',
        title:'ForgeAI – Autonomous AI Software Engineer Platform',
        description:'Production-hardened, asynchronous multi-agent platform that autonomously plans, architects, generates, reviews, and tests software from natural-language requests. Features a 9-phase agent pipeline coordinated by Temporal workflows with transactional outbox and self-correcting LangGraph compilation loops.',
        technologies:['Python','FastAPI','LangGraph','Temporal','Apache Kafka','PostgreSQL','Gemini API','OpenTelemetry','Docker'],
        github:'https://github.com/Omarkam3l/ForgeAI',
        demo:'https://github.com/Omarkam3l/ForgeAI',
        image:''
      },
      {
        id:'2',
        title:'Kathir – AI-Powered Food Rescue Platform',
        description:'AI-driven marketplace connecting restaurants, consumers, and NGOs to reduce food waste. Features a multi-agent AI assistant built with LangGraph for meal search, cart generation, and session-aware conversational memory with hybrid vector/keyword search.',
        technologies:['Python','FastAPI','LangGraph','LangChain','PostgreSQL','Supabase','Flutter'],
        github:'https://github.com/Omarkam3l/Kathir_final',
        demo:'https://github.com/Omarkam3l/Kathir_final',
        image:''
      },
      {
        id:'3',
        title:'MotionIQ – AI Sports Analytics Assessment Platform',
        description:'Automated athlete movement assessment platform replacing manual evaluation. Combines RTMDet human detection and RTMPose keypoint tracking with a biomechanics rule engine. Achieved 850+ req/sec throughput and 91% test coverage on AWS App Runner.',
        technologies:['Python 3.11','FastAPI','MMPose','MMDetection','PyTorch','OpenCV','Docker','AWS','Prometheus'],
        github:'https://github.com/Omarkam3l/MotionIQ',
        demo:'https://github.com/Omarkam3l/MotionIQ',
        image:''
      },
      {
        id:'4',
        title:'Big Data Analytics Pipeline',
        description:'Distributed analytics pipeline streaming and processing large-scale flight data end-to-end. Real-time Kafka ingestion, PySpark transformation, and bucketed Apache Hive warehousing on Databricks File System (DBFS) for BI querying.',
        technologies:['Apache Spark','PySpark','Apache Kafka','Apache Hive','Databricks','Pandas','NumPy'],
        github:'https://github.com/Omarkam3l/Big-Data-Analytics',
        demo:'https://github.com/Omarkam3l/Big-Data-Analytics',
        image:''
      },
      {
        id:'5',
        title:'AdventureWorks2022 ETL & BI Pipeline',
        description:'Comprehensive ETL and Business Intelligence solution. Designed star-schema dimensional models, automated SSIS extraction workflows, and created interactive Power BI executive dashboards for enterprise sales performance.',
        technologies:['SQL Server','SSIS','Power BI','T-SQL','Data Warehousing'],
        github:'https://github.com/SalmaElgezawy/AdventureWork2022_SSIS_Project',
        demo:'https://github.com/SalmaElgezawy/AdventureWork2022_SSIS_Project',
        image:''
      }
    ];
  });

  const [education, setEducation] = useState<Education[]>(() => {
    if (localStorage.getItem('edu_version') !== '6') {
      localStorage.removeItem('education');
      localStorage.setItem('edu_version', '6');
    }
    const s = localStorage.getItem('education');
    return s ? JSON.parse(s) : [{
      id:'1',
      institution:'Monufia National University',
      degree:'Bachelor of Computer & Artificial Intelligence Engineering',
      years:'2022 – 2026 (Expected)',
      highlights:'Specializing in Artificial Intelligence, Multi-Agent Engineering, and Production Machine Learning Systems.'
    }];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    if (localStorage.getItem('certs_version') !== '8') {
      localStorage.removeItem('certificates');
      localStorage.setItem('certs_version', '8');
    }
    const s = localStorage.getItem('certificates');
    return s ? JSON.parse(s) : [
      {
        id:'1',
        title:'Generative AI & Building RAG Agents (Advanced Level - 100 hrs)',
        organization:'NVIDIA Deep Learning Institute (DLI) via ITI',
        date:'2025 – 2026',
        image:'/certificates/nvidia_adv.jpg',
        pdf:'/certificates/nvidia_adv.pdf',
        caption:'Deep Learning Basics, Building RAG Agents with LLMs, Multi-Agent Capstone Project'
      },
      {
        id:'2',
        title:'Generative AI & Prompt Engineering (Beginner Level - 35 hrs)',
        organization:'NVIDIA Deep Learning Institute (DLI) via ITI',
        date:'2025',
        image:'/certificates/nvidia_beg.jpg',
        pdf:'',
        caption:'Prompt Engineering, Augmenting LLMs with RAG & Vector Embeddings'
      },
      {
        id:'3',
        title:'Huawei Certified ICT Associate – HCIA-AI V3.5',
        organization:'Huawei / NTI - Artificial Intelligence Track',
        date:'March 2025',
        image:'/certificates/hcia_ai.png',
        pdf:'/certificates/hcia_ai.pdf',
        caption:'Huawei Certified ICT Associate – Artificial Intelligence & Deep Neural Networks'
      },
      {
        id:'4',
        title:'Digital Egypt Pioneers Initiative (DEPI) - AI & Data Science',
        organization:'Ministry of Communications & Information Technology',
        date:'October 2024',
        image:'/certificates/depi_cert1.png',
        pdf:'/certificates/depi_cert1.pdf',
        caption:'Artificial Intelligence, Machine Learning & Analytical Pipelines'
      },
      {
        id:'5',
        title:'DEPI Certification - Microsoft Data Engineering Profile',
        organization:'Digital Egypt Pioneers Initiative (DEPI)',
        date:'October 2024',
        image:'/certificates/depi_cert2.png',
        pdf:'/certificates/depi_cert2.pdf',
        caption:'Microsoft Data Engineering, Data Warehousing & Business Intelligence Dashboards'
      },
      {
        id:'6',
        title:'Artificial Intelligence & Application Systems',
        organization:'Zewail City of Science and Technology',
        date:'August 2025',
        image:'/certificates/zewail.jpg',
        pdf:'',
        caption:'Advanced Workshop in Artificial Intelligence & Robotics Applications'
      },
      {
        id:'7',
        title:'Full-Stack Systems & Cloud Architecture',
        organization:'Online Engineering Academy',
        date:'2025',
        image:'',
        pdf:'/certificates/course_cert.pdf',
        caption:'Scalable Backend Architecture & Microservices Design'
      },
      {
        id:'8',
        title:'Advanced Data Structures & Technology Certification',
        organization:'Tech Institute',
        date:'2025',
        image:'',
        pdf:'/certificates/technology.pdf',
        caption:'Modern Algorithmic Excellence & High-Performance Computing'
      },
    ];
  });

  const [profileImage, setProfileImage] = useState(() =>
    localStorage.getItem('profileImage') ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300'
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ name:'', email:'', message:'' });
  const [formSent, setFormSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [modalMode, setModalMode] = useState<'pdf' | 'image'>('pdf');
  const [projectFilter, setProjectFilter] = useState<string>('All');

  const openCertModal = (cert: Certificate, initialMode?: 'pdf' | 'image') => {
    setSelectedCert(cert);
    if (initialMode) {
      setModalMode(initialMode);
    } else if (cert.pdf) {
      setModalMode('pdf');
    } else {
      setModalMode('image');
    }
  };

  const typedRole = useTyping([
    'AI Engineer',
    'LLM & Agentic Developer',
    'Backend Engineer',
    'Distributed Systems Developer',
    'MLOps Enthusiast'
  ]);

  const [editMode, setEditMode] = useState({ skills:false, experiences:false, projects:false, education:false, certificates:false });
  const [savedStates, setSavedStates] = useState({ skills, experiences, projects, education, certificates });

  /* ─── Persist ──────────────────────────────────────── */
  useEffect(() => { localStorage.setItem('skills',       JSON.stringify(skills));       }, [skills]);
  useEffect(() => { localStorage.setItem('experiences',  JSON.stringify(experiences));  }, [experiences]);
  useEffect(() => { localStorage.setItem('projects',     JSON.stringify(projects));     }, [projects]);
  useEffect(() => { localStorage.setItem('education',    JSON.stringify(education));    }, [education]);
  useEffect(() => { localStorage.setItem('certificates', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem('profileImage', profileImage);                }, [profileImage]);

  /* ─── Active section tracker ───────────────────────── */
  useEffect(() => {
    const sections = ['home','about','experience','projects','education','certificates','contact'];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  /* ─── Keyboard ESC close modal ──────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ─── Handlers ─────────────────────────────────────── */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCertImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => setCertificates(cs => cs.map(c => c.id===id ? {...c, pdf: reader.result as string, image: ''} : c));
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => setCertificates(cs => cs.map(c => c.id===id ? {...c, image: reader.result as string, pdf: ''} : c));
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProjects(ps => ps.map(p => p.id===id ? {...p,image:reader.result as string}:p));
    reader.readAsDataURL(file);
  };

  type Section = keyof typeof editMode;

  const toggleEdit = (s: Section) => {
    if (!editMode[s]) setSavedStates(prev => ({...prev, [s]: s==='skills'?skills:s==='experiences'?experiences:s==='projects'?projects:s==='education'?education:certificates}));
    setEditMode(em => ({...em, [s]: !em[s]}));
  };

  const handleSave = (s: Section) => {
    setSavedStates(prev => ({...prev, [s]: s==='skills'?skills:s==='experiences'?experiences:s==='projects'?projects:s==='education'?education:certificates}));
    setEditMode(em => ({...em, [s]: false}));
  };

  const handleCancel = (s: Section) => {
    if (s==='skills')        setSkills(savedStates.skills);
    if (s==='experiences')   setExperiences(savedStates.experiences);
    if (s==='projects')      setProjects(savedStates.projects);
    if (s==='education')     setEducation(savedStates.education);
    if (s==='certificates')  setCertificates(savedStates.certificates);
    setEditMode(em => ({...em, [s]: false}));
  };

  const addItem = (s: Section) => {
    const id = Date.now().toString();
    if (s==='skills')       setSkills([...skills, {id,name:'New Skill',category:'Languages'}]);
    if (s==='experiences')  setExperiences([...experiences, {id,company:'Company Name',title:'AI / Backend Engineer',duration:'Start–End',responsibilities:['Key achievement or responsibility']}]);
    if (s==='projects')     setProjects([...projects, {id,title:'New AI Project',description:'Project description highlighting architecture and AI models.',technologies:['Python','FastAPI','LangGraph'],github:'https://github.com/Omarkam3l',demo:'https://github.com/Omarkam3l',image:''}]);
    if (s==='education')    setEducation([...education, {id,institution:'University Name',degree:'Bachelor Degree',years:'2022–2026',highlights:'Specialization & Achievements'}]);
    if (s==='certificates') setCertificates([...certificates, {id,title:'Certificate Title',organization:'Issuing Org',date:'2025',image:'',pdf:'',caption:'Certification details'}]);
  };

  const deleteItem = (s: Section, id: string) => {
    if (s==='skills')       setSkills(skills.filter(x=>x.id!==id));
    if (s==='experiences')  setExperiences(experiences.filter(x=>x.id!==id));
    if (s==='projects')     setProjects(projects.filter(x=>x.id!==id));
    if (s==='education')    setEducation(education.filter(x=>x.id!==id));
    if (s==='certificates') setCertificates(certificates.filter(x=>x.id!==id));
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:omarkamel.dev@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AReply to: ${formData.email}`;
    setFormSent(true);
    setTimeout(()=>setFormSent(false), 4000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('omarkamel.dev@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSafeLink = (url: string, e: React.MouseEvent) => {
    if (!url || url === '#') {
      e.preventDefault();
    }
  };

  /* ─── Edit button strip (Admin only) ────────────────── */
  const isAdmin = typeof window !== 'undefined' && (window.location.search.includes('admin=true') || window.location.search.includes('edit=true'));

  const EditButtons = ({ s }: { s: Section }) => {
    if (!isAdmin) return null;
    return (
      <div className="flex gap-2">
        {editMode[s] ? (
          <>
            <button onClick={()=>handleSave(s)} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm">
              <Save size={14}/> Save
            </button>
            <button onClick={()=>handleCancel(s)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium transition">
              <X size={14}/> Cancel
            </button>
          </>
        ) : (
          <button onClick={()=>toggleEdit(s)} className="flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition">
            <Edit size={14}/> Edit
          </button>
        )}
      </div>
    );
  };

  const navItems = ['home','about','experience','projects','education','certificates','contact'];

  // Project categories for filter
  const allTechs = ['All', ...Array.from(new Set(projects.flatMap(p => p.technologies)))];
  const filteredProjects = projectFilter === 'All' 
    ? projects 
    : projects.filter(p => p.technologies.includes(projectFilter));

  /* ─── Render ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 selection:text-blue-200">

      {/* ── Navigation ── */}
      <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent cursor-pointer">
              Omar.dev
            </span>
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link key={item} to={item} spy smooth offset={-64} duration={500}
                  className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition capitalize ${activeSection===item ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
                  {item}
                </Link>
              ))}
            </div>
            {/* Mobile toggle */}
            <button className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900" onClick={()=>setMenuOpen(m=>!m)}>
              {menuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 border-t border-slate-800 px-4 py-3 space-y-1 backdrop-blur-lg">
            {navItems.map(item => (
              <Link key={item} to={item} spy smooth offset={-64} duration={500}
                onClick={()=>setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition capitalize ${activeSection===item ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"/>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl"/>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
            {/* Text */}
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs mb-4 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"/>
                NVIDIA DLI-Trained AI Engineer
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                Omar Kamel<br/>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">Sayed</span>
              </h1>
              <div className="h-8 mb-6">
                <span className="text-xl md:text-2xl text-slate-300 font-mono">
                  {typedRole}<span className="animate-pulse text-blue-400">|</span>
                </span>
              </div>
              <p className="text-slate-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                Specialized in building production-grade AI systems powered by LLMs, multi-agent orchestration (LangGraph), RAG pipelines, FastAPI, Kafka & Temporal.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a 
                  href="/certificates/hcia-ai.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-600/25 active:scale-95"
                >
                  <Download size={18}/> View Credentials / Resume
                </a>
                <Link to="contact" spy smooth offset={-64} duration={500}
                  className="flex items-center gap-2 border border-slate-700 hover:border-blue-400 text-slate-300 hover:text-blue-400 px-6 py-3 rounded-xl font-semibold transition cursor-pointer bg-slate-900/50 hover:bg-slate-900 active:scale-95">
                  <Mail size={18}/> Contact Me
                </Link>
              </div>
              {/* Social row */}
              <div className="flex gap-4 mt-8 justify-center md:justify-start">
                <a href="https://www.linkedin.com/in/omar-kamel-8645b5268/" target="_blank" rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition">
                  <Linkedin size={20}/>
                </a>
                <a href="https://github.com/Omarkam3l" target="_blank" rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition">
                  <Github size={20}/>
                </a>
                <button onClick={handleCopyEmail} title="Copy email address"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition flex items-center gap-1.5 text-xs">
                  {copiedEmail ? <Check size={18} className="text-emerald-400"/> : <Copy size={18}/>}
                </button>
              </div>
            </div>
            {/* Photo */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="w-60 h-60 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 p-1 shadow-2xl shadow-blue-500/30">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    <img src={profileImage} alt="Omar Kamel" className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                  </div>
                </div>
                {isAdmin && (
                  <>
                    <button onClick={()=>fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition hover:scale-110 active:scale-95"
                      title="Upload custom photo">
                      <Upload size={16}/>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                  </>
                )}
                {/* Decoration ring */}
                <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-spin pointer-events-none" style={{animationDuration:'16s'}}/>
              </div>
            </div>
          </div>
          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-600 animate-bounce">
            <span className="text-xs mb-1 font-mono uppercase tracking-widest">scroll</span>
            <ChevronDown size={16}/>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="about" className="py-24 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex justify-between items-center mb-14">
            <div>
              <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">What I work with</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Technical Skills</h2>
            </div>
            <EditButtons s="skills"/>
          </FadeIn>

          {/* Grouped by category */}
          {Object.keys(categoryColor).map((cat, ci) => {
            const group = skills.filter(s => s.category === cat);
            if (group.length === 0 && !editMode.skills) return null;
            return (
              <FadeIn key={cat} delay={ci * 80} className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 font-mono">{cat}</h3>
                <div className="flex flex-wrap gap-3">
                  {group.map(skill => (
                    <div key={skill.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${categoryBg[cat] || 'bg-slate-800 text-slate-200 border-slate-700'} hover:scale-105 transition-transform duration-200 shadow-sm`}>
                      {editMode.skills ? (
                        <>
                          <input value={skill.name} onChange={e=>setSkills(ss=>ss.map(s=>s.id===skill.id?{...s,name:e.target.value}:s))}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-400 w-28"/>
                          <select value={skill.category} onChange={e=>setSkills(ss=>ss.map(s=>s.id===skill.id?{...s,category:e.target.value}:s))}
                            className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-400">
                            {Object.keys(categoryColor).map(c=><option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
                          </select>
                          <button onClick={()=>deleteItem('skills',skill.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={12}/></button>
                        </>
                      ) : skill.name}
                    </div>
                  ))}
                </div>
              </FadeIn>
            );
          })}
          {editMode.skills && (
            <button onClick={()=>addItem('skills')} className="mt-4 flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium transition">
              <Plus size={16}/> Add New Skill
            </button>
          )}
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex justify-between items-center mb-14">
            <div>
              <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">Where I've trained & worked</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Professional Experience</h2>
            </div>
            <EditButtons s="experiences"/>
          </FadeIn>

          <div className="relative border-l-2 border-slate-800/80 ml-4 space-y-10">
            {experiences.map((exp, i) => (
              <FadeIn key={exp.id} delay={i*100} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/40 ring-4 ring-slate-950"/>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-300 shadow-xl">
                  {editMode.experiences ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <input value={exp.company} onChange={e=>setExperiences(es=>es.map(x=>x.id===exp.id?{...x,company:e.target.value}:x))}
                          className="bg-slate-950 text-xl font-bold border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full mr-4 text-white"/>
                        <button onClick={()=>deleteItem('experiences',exp.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
                      </div>
                      <input value={exp.title} onChange={e=>setExperiences(es=>es.map(x=>x.id===exp.id?{...x,title:e.target.value}:x))}
                        className="bg-slate-950 text-blue-400 font-semibold border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full"/>
                      <input value={exp.duration} onChange={e=>setExperiences(es=>es.map(x=>x.id===exp.id?{...x,duration:e.target.value}:x))}
                        className="bg-slate-950 text-slate-400 text-sm border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full"/>
                      {exp.responsibilities.map((r,ri)=>(
                        <div key={ri} className="flex items-center gap-2">
                          <span className="text-blue-400 shrink-0">▸</span>
                          <input value={r} onChange={e=>{const nr=[...exp.responsibilities];nr[ri]=e.target.value;setExperiences(es=>es.map(x=>x.id===exp.id?{...x,responsibilities:nr}:x));}}
                            className="bg-slate-950 text-slate-300 border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full text-sm"/>
                          <button onClick={()=>{const nr=exp.responsibilities.filter((_,i)=>i!==ri);setExperiences(es=>es.map(x=>x.id===exp.id?{...x,responsibilities:nr}:x));}} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      <button onClick={()=>setExperiences(es=>es.map(x=>x.id===exp.id?{...x,responsibilities:[...x.responsibilities,'New accomplishment']}:x))} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm pt-2">
                        <Plus size={14}/> Add Bullet Point
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="text-blue-400 shrink-0" size={20}/>
                          <h3 className="text-xl font-bold">{exp.company}</h3>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full">
                          <Calendar size={13}/> {exp.duration}
                        </span>
                      </div>
                      <p className="text-blue-400 font-semibold mb-4">{exp.title}</p>
                      <ul className="space-y-2.5">
                        {exp.responsibilities.map((r,ri)=>(
                          <li key={ri} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
                            <span className="text-blue-400 mt-1 shrink-0">▸</span>{r}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
          {editMode.experiences && (
            <button onClick={()=>addItem('experiences')} className="mt-8 ml-4 flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium transition">
              <Plus size={16}/> Add Experience
            </button>
          )}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-24 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex justify-between items-center mb-8">
            <div>
              <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">What I've built</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Projects</h2>
            </div>
            <EditButtons s="projects"/>
          </FadeIn>

          {/* Technology Filter Pills */}
          {!editMode.projects && (
            <FadeIn className="flex flex-wrap gap-2 mb-10">
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => setProjectFilter(tech)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 border ${
                    projectFilter === tech
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </FadeIn>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, i) => (
              <FadeIn key={project.id} delay={i*100}>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group h-full flex flex-col shadow-xl">
                  {/* Image Header */}
                  <div className="relative h-52 bg-slate-900 flex items-center justify-center overflow-hidden">
                    {project.image
                      ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                      : <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600 p-6 text-center">
                          <Cpu size={44} className="text-slate-700 group-hover:text-blue-400/60 transition duration-300"/>
                          <span className="text-xs text-slate-500 font-mono">{project.title.split('–')[0]}</span>
                          {editMode.projects && (
                            <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                              <Upload size={14}/> Upload Cover Image
                              <input type="file" accept="image/*" onChange={e=>handleProjectImageUpload(project.id,e)} className="hidden"/>
                            </label>
                          )}
                        </div>
                    }
                    {editMode.projects && (
                      <button onClick={()=>deleteItem('projects',project.id)} className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full shadow-lg">
                        <Trash2 size={14}/>
                      </button>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"/>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {editMode.projects ? (
                      <div className="space-y-3 flex-1">
                        <input value={project.title} onChange={e=>setProjects(ps=>ps.map(p=>p.id===project.id?{...p,title:e.target.value}:p))}
                          className="bg-slate-900 text-xl font-bold border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full text-white"/>
                        <textarea value={project.description} rows={4} onChange={e=>setProjects(ps=>ps.map(p=>p.id===project.id?{...p,description:e.target.value}:p))}
                          className="bg-slate-900 text-slate-300 text-sm border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full resize-none"/>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((t,ti)=>(
                            <div key={ti} className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-xs">
                              <input value={t} onChange={e=>{const nt=[...project.technologies];nt[ti]=e.target.value;setProjects(ps=>ps.map(p=>p.id===project.id?{...p,technologies:nt}:p));}}
                                className="bg-transparent border-none focus:ring-0 w-24 text-xs text-blue-300"/>
                              <button onClick={()=>{const nt=project.technologies.filter((_,i)=>i!==ti);setProjects(ps=>ps.map(p=>p.id===project.id?{...p,technologies:nt}:p));}} className="text-red-400 p-0.5"><Trash2 size={10}/></button>
                            </div>
                          ))}
                          <button onClick={()=>setProjects(ps=>ps.map(p=>p.id===project.id?{...p,technologies:[...p.technologies,'Tech']}:p))} className="text-blue-400 text-xs flex items-center gap-1 border border-blue-500/30 px-2 py-1 rounded-lg"><Plus size={12}/>Add</button>
                        </div>
                        <div className="flex gap-3 text-sm pt-2">
                          <input value={project.github} placeholder="GitHub Repository URL" onChange={e=>setProjects(ps=>ps.map(p=>p.id===project.id?{...p,github:e.target.value}:p))}
                            className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none flex-1 text-xs"/>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.map((t,ti)=>(
                            <span key={ti} className="bg-blue-950/60 text-blue-300 border border-blue-800/50 px-2.5 py-1 rounded-full text-xs font-mono">{t}</span>
                          ))}
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-slate-800/80">
                          <a href={project.github} target="_blank" rel="noreferrer" onClick={(e)=>handleSafeLink(project.github,e)}
                            className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition text-sm font-semibold">
                            <Github size={16}/> View GitHub Repository
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {editMode.projects && (
            <button onClick={()=>addItem('projects')} className="mt-8 w-full border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl h-24 flex items-center justify-center text-slate-500 hover:text-blue-400 transition">
              <Plus size={24}/> <span className="ml-2 text-sm font-medium">Add New Project</span>
            </button>
          )}
        </div>
      </section>

      {/* ── Education ── */}
      <section id="education" className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex justify-between items-center mb-14">
            <div>
              <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">My background</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Education</h2>
            </div>
            <EditButtons s="education"/>
          </FadeIn>

          <div className="space-y-6">
            {education.map((edu, i) => (
              <FadeIn key={edu.id} delay={i*100}>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition duration-300 flex gap-5 shadow-xl">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <GraduationCap size={24} className="text-white"/>
                  </div>
                  <div className="flex-1">
                    {editMode.education ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <input value={edu.institution} onChange={e=>setEducation(es=>es.map(x=>x.id===edu.id?{...x,institution:e.target.value}:x))}
                            className="bg-slate-950 text-lg font-bold border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full mr-4 text-white"/>
                          <button onClick={()=>deleteItem('education',edu.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
                        </div>
                        <input value={edu.degree} onChange={e=>setEducation(es=>es.map(x=>x.id===edu.id?{...x,degree:e.target.value}:x))}
                          className="bg-slate-950 text-blue-400 font-semibold border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full"/>
                        <input value={edu.years} onChange={e=>setEducation(es=>es.map(x=>x.id===edu.id?{...x,years:e.target.value}:x))}
                          className="bg-slate-950 text-slate-400 text-sm border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full"/>
                        <textarea value={edu.highlights} rows={2} onChange={e=>setEducation(es=>es.map(x=>x.id===edu.id?{...x,highlights:e.target.value}:x))}
                          className="bg-slate-950 text-slate-300 text-sm border border-slate-700 rounded px-3 py-1 focus:border-blue-400 focus:outline-none w-full resize-none"/>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <h3 className="text-lg font-bold">{edu.institution}</h3>
                          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700/50">
                            <Calendar size={12}/> {edu.years}
                          </span>
                        </div>
                        <p className="text-blue-400 font-semibold mb-2">{edu.degree}</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{edu.highlights}</p>
                      </>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {editMode.education && (
            <button onClick={()=>addItem('education')} className="mt-6 flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium transition">
              <Plus size={16}/> Add Education
            </button>
          )}
        </div>
      </section>

      {/* ── Certificates ── */}
      <section id="certificates" className="py-24 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex justify-between items-center mb-14">
            <div>
              <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">My achievements</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Verified Certifications</h2>
            </div>
            <EditButtons s="certificates"/>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, i) => (
              <FadeIn key={cert.id} delay={i*80}>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/40 transition duration-300 group flex flex-col h-full shadow-xl">
                  {/* Certificate Header / Preview Box */}
                  <div 
                    onClick={() => !editMode.certificates && openCertModal(cert)}
                    className={`relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-800/50 ${!editMode.certificates ? 'cursor-pointer group' : ''}`}
                  >
                    {cert.image ? (
                      <img src={cert.image} alt={cert.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"/>
                    ) : cert.pdf ? (
                      <div className="flex flex-col items-center gap-3 text-slate-400 p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition duration-300">
                          <FileText size={32}/>
                        </div>
                        <span className="text-xs font-mono bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <FileText size={12}/> PDF Document
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600">
                        <Award size={40}/>
                      </div>
                    )}

                    {/* Hover Overlay trigger */}
                    {!editMode.certificates && (
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <span className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-medium shadow-lg transition">
                          <Eye size={14}/> View Document
                        </span>
                      </div>
                    )}

                    {editMode.certificates && (
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-blue-400 p-2 rounded-full shadow-md">
                          <Upload size={14}/>
                          <input type="file" accept="image/*,application/pdf" onChange={e=>handleCertImageUpload(cert.id,e)} className="hidden"/>
                        </label>
                        <button onClick={()=>deleteItem('certificates',cert.id)} className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full shadow-md">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {editMode.certificates ? (
                      <div className="space-y-2.5">
                        <input value={cert.title} onChange={e=>setCertificates(cs=>cs.map(c=>c.id===cert.id?{...c,title:e.target.value}:c))}
                          className="bg-slate-900 text-white font-bold border border-slate-700 rounded px-2.5 py-1 w-full text-sm focus:border-blue-400 focus:outline-none"/>
                        <input value={cert.organization} onChange={e=>setCertificates(cs=>cs.map(c=>c.id===cert.id?{...c,organization:e.target.value}:c))}
                          className="bg-slate-900 text-slate-300 text-sm border border-slate-700 rounded px-2.5 py-1 w-full focus:border-blue-400 focus:outline-none"/>
                        <input value={cert.date} onChange={e=>setCertificates(cs=>cs.map(c=>c.id===cert.id?{...c,date:e.target.value}:c))}
                          className="bg-slate-900 text-slate-400 text-xs border border-slate-700 rounded px-2.5 py-1 w-full focus:border-blue-400 focus:outline-none"/>
                        <textarea value={cert.caption} rows={2} onChange={e=>setCertificates(cs=>cs.map(c=>c.id===cert.id?{...c,caption:e.target.value}:c))}
                          className="bg-slate-900 text-slate-300 text-xs border border-slate-700 rounded px-2.5 py-1 w-full resize-none focus:border-blue-400 focus:outline-none"/>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-base mb-1 group-hover:text-blue-400 transition leading-snug">{cert.title}</h3>
                        {cert.organization && <p className="text-blue-400 text-xs font-semibold mb-2">{cert.organization}</p>}
                        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3 font-mono">
                          <Calendar size={12}/> {cert.date}
                        </div>
                        {cert.caption && <p className="text-slate-400 text-xs leading-relaxed flex-1">{cert.caption}</p>}
                        <div className="pt-4 mt-auto border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button 
                            onClick={() => openCertModal(cert, cert.image ? 'image' : 'pdf')}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg transition"
                          >
                            <Eye size={12}/> Preview
                          </button>
                          {cert.pdf && (
                            <button 
                              onClick={() => openCertModal(cert, 'pdf')}
                              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg transition"
                            >
                              <FileText size={12}/> PDF Viewer
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
            {editMode.certificates && (
              <button onClick={()=>addItem('certificates')} className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl h-48 flex items-center justify-center text-slate-500 hover:text-blue-400 transition">
                <Plus size={24}/> <span className="ml-2 text-sm">Add Certification</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Certificate Lightbox / PDF Viewer Modal ── */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6" onClick={() => setSelectedCert(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex flex-wrap justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950 gap-3">
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">{selectedCert.title}</h3>
                <p className="text-xs text-blue-400 font-mono mt-0.5">{selectedCert.organization} • {selectedCert.date}</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Tab Switcher if both PDF & Image exist */}
                {selectedCert.pdf && selectedCert.image && (
                  <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                    <button 
                      onClick={() => setModalMode('pdf')} 
                      className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${modalMode === 'pdf' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      <FileText size={13}/> PDF Viewer
                    </button>
                    <button 
                      onClick={() => setModalMode('image')} 
                      className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${modalMode === 'image' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Eye size={13}/> Image View
                    </button>
                  </div>
                )}

                <button onClick={() => setSelectedCert(null)} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition">
                  <X size={20}/>
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto flex items-center justify-center bg-slate-950/60 min-h-[60vh]">
              {modalMode === 'pdf' && selectedCert.pdf ? (
                <div className="w-full h-[72vh] flex flex-col">
                  <iframe 
                    src={`${selectedCert.pdf}#toolbar=1`} 
                    className="w-full h-full rounded-xl border border-slate-800/80 bg-slate-950 shadow-inner" 
                    title={selectedCert.title}
                  />
                </div>
              ) : selectedCert.image ? (
                <img src={selectedCert.image} alt={selectedCert.title} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-slate-800"/>
              ) : selectedCert.pdf ? (
                <div className="w-full h-[72vh] flex flex-col">
                  <iframe 
                    src={`${selectedCert.pdf}#toolbar=1`} 
                    className="w-full h-full rounded-xl border border-slate-800/80 bg-slate-950 shadow-inner" 
                    title={selectedCert.title}
                  />
                </div>
              ) : (
                <div className="text-slate-500 py-12 text-center">No document or image available</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap justify-between items-center gap-3">
              <p className="text-xs text-slate-400 max-w-md">{selectedCert.caption}</p>
              <div className="flex items-center gap-2">
                {selectedCert.pdf && (
                  <>
                    <a 
                      href={selectedCert.pdf} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <ExternalLink size={14}/> Open in New Tab
                    </a>
                    <a 
                      href={selectedCert.pdf} 
                      target="_blank" 
                      rel="noreferrer" 
                      download 
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md"
                    >
                      <Download size={14}/> Download PDF
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <p className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-2">Get in touch</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Let's Connect</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm md:text-base">
              Have an exciting AI project, LLM pipeline challenge, or engineering role? My inbox is open.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Info */}
            <FadeIn className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-400" size={18}/>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">Email</p>
                  <div className="flex items-center justify-between">
                    <a href="mailto:omarkamel.dev@gmail.com" className="text-slate-200 hover:text-blue-400 transition text-sm font-medium">omarkamel.dev@gmail.com</a>
                    <button onClick={handleCopyEmail} className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 ml-2">
                      {copiedEmail ? <Check size={14} className="text-emerald-400"/> : <Copy size={14}/>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Linkedin className="text-blue-400" size={18}/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">LinkedIn</p>
                  <a href="https://www.linkedin.com/in/omar-kamel-8645b5268/" target="_blank" rel="noreferrer" className="text-slate-200 hover:text-blue-400 transition text-sm font-medium">linkedin.com/in/omar-kamel</a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Github className="text-blue-400" size={18}/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">GitHub</p>
                  <a href="https://github.com/Omarkam3l" target="_blank" rel="noreferrer" className="text-slate-200 hover:text-blue-400 transition text-sm font-medium">github.com/Omarkam3l</a>
                </div>
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn delay={150}>
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest font-mono mb-1.5">Name</label>
                  <input type="text" required value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Your Name"/>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest font-mono mb-1.5">Email</label>
                  <input type="email" required value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition"
                    placeholder="your.email@domain.com"/>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 uppercase tracking-widest font-mono mb-1.5">Message</label>
                  <textarea required rows={4} value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
                    placeholder="Tell me about your project or opportunity..."/>
                </div>
                <button type="submit"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition shadow-lg ${formSent ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'}`}>
                  <Send size={16}/> {formSent ? 'Opening mail client…' : 'Send Message'}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Omar.dev</span>
            <p className="text-slate-500 text-xs mt-1">© {new Date().getFullYear()} Omar Kamel Sayed. All rights reserved.</p>
          </div>
          <div className="flex gap-5">
            <a href="https://www.linkedin.com/in/omar-kamel-8645b5268/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition"><Linkedin size={20}/></a>
            <a href="https://github.com/Omarkam3l" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition"><Github size={20}/></a>
            <button onClick={handleCopyEmail} className="text-slate-500 hover:text-cyan-400 transition"><Mail size={20}/></button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
