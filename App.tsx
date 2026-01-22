import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  Globe, 
  Package, 
  Users, 
  LayoutDashboard,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Zap,
  Bot,
  ShoppingCart,
  TrendingUp,
  Warehouse,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

// --- System Instruction for SIS AI Agent ---
const SIS_SYSTEM_PROMPT = `
Та бол "SIS Agent" (Smart Information System) компанийн албан ёсны ухаалаг туслах юм. 
Байгууллагын үндсэн мэдээлэл:
- Туршлага: 10 жил тасралтгүй ERP, агуулахын систем болон цахим худалдааны платформ хөгжүүлсэн.
- Давуу тал: Facebook Messenger AI Agent (захиалга автоматаар авдаг), Comment-to-Order AI (комментоор дугаар бүртгэж захиалга үүсгэдэг), CallPro интеграц, POS систем, Агуулахын бүрэн удирдлага.
- Хүргэлт: "Очлоо" хүргэлтийн сүлжээ. Хотыг 87 бүсэд хуваасан, 110 гаруй хүргэлтийн ажилтантай. Хүргэлтийн амжилт 97%.
- Үнийн санал (4 шатлалт): 
  1. Үнэгүй - Хүргэлтийн үйлчилгээ авах хэрэглэгчдэд.
  2. Үндсэн - Хүргэлтийн модуль + Бараа бүртгэл + Санхүү.
  3. Дижитал - Вэб сайт + Линк захиалгын систем.
  4. Про - AI Chat + CallPro + Оператор хяналтын цогц систем.

Хэрэглэгч асуулт асуухад найрсаг, мэргэжлийн түвшинд, Монгол хэлээр хариулна уу. Хэрэв үнэ болон бүртгэлийн талаар асуувал "Үнийн санал" болон "Холбоо барих" хэсгээс дэлгэрэнгүй харахыг зөвлөөрэй.
`;

// --- UI Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const NavItem = ({ label, href, onClick }: { label: string, href: string, onClick: () => void }) => (
  <a 
    href={href} 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="text-slate-600 hover:text-brand-600 font-semibold transition-colors text-sm uppercase tracking-wide cursor-pointer"
  >
    {label}
  </a>
);

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: { icon: any, title: string, desc: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
  >
    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm font-medium">{desc}</p>
  </motion.div>
);

const PricingCard = ({ stage, title, features, isPopular, priceInfo, onAction }: { stage: string, title: string, features: string[], isPopular?: boolean, priceInfo: string, onAction: () => void }) => (
  <div className={`relative p-10 rounded-[2.5rem] border ${isPopular ? 'border-brand-500 shadow-brand-100 shadow-2xl scale-105 z-10' : 'border-slate-200 shadow-sm'} bg-white flex flex-col h-full transition-all duration-300`}>
    {isPopular && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-400 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
        Хамгийн эрэлттэй
      </div>
    )}
    <div className="mb-8">
      <span className="text-brand-600 font-extrabold text-xs uppercase tracking-[0.2em]">{stage}</span>
      <h3 className="text-3xl font-black text-slate-900 mt-2">{title}</h3>
      <p className="text-slate-500 text-sm mt-3 font-medium">{priceInfo}</p>
    </div>
    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-4 text-sm text-slate-600 font-medium">
          <div className="mt-1 bg-brand-50 rounded-full p-1 shrink-0">
            <CheckCircle2 size={16} className="text-brand-600" />
          </div>
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onAction}
      className={`w-full py-5 rounded-[1.25rem] font-bold text-lg transition-all ${isPopular ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-200 active:scale-95' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'}`}
    >
      Эхлэх
    </button>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [demoMessages, setDemoMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    {role: 'ai', text: 'Сайн байна уу? Би SIS AI туслах байна. Танд манай системийн талаар асуух зүйл байна уу?'}
  ]);
  const [demoInput, setDemoInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [demoMessages, isTyping]);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleDemoSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!demoInput.trim() || isTyping) return;

    const userText = demoInput;
    setDemoMessages(prev => [...prev, { role: 'user', text: userText }]);
    setDemoInput('');
    setIsTyping(true);

    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setTimeout(() => {
        setDemoMessages(prev => [...prev, { role: 'ai', text: "Уучлаарай, системийн тохиргоо (API Key) дутуу байна. Та Vercel Settings хэсэгт API_KEY тохируулна уу." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...demoMessages.slice(-10).map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: SIS_SYSTEM_PROMPT,
          maxOutputTokens: 800,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "Уучлаарай, систем хариу өгөхөд алдаа гарлаа. Та дахин бичнэ үү.";
      setDemoMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setDemoMessages(prev => [...prev, { role: 'ai', text: "Холболтонд алдаа гарлаа. Та дараа дахин оролдоно уу." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-700 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'glass-nav shadow-lg py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-brand-200 group-hover:rotate-6 transition-transform">S</div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SIS <span className="text-brand-600">Agent</span></span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Enterprise Solution</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <NavItem label="Нүүр" href="#home" onClick={() => scrollTo('home')} />
            <NavItem label="Давуу тал" href="#features" onClick={() => scrollTo('features')} />
            <NavItem label="Үнийн санал" href="#pricing" onClick={() => scrollTo('pricing')} />
            <NavItem label="Туршиж үзэх" href="#demo" onClick={() => scrollTo('demo')} />
            <NavItem label="Түншлэл" href="#partner" onClick={() => scrollTo('partner')} />
            <button 
              onClick={() => setActiveModal('contact')}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-slate-200 text-sm active:scale-95"
            >
              Холбоо барих
            </button>
          </div>

          <button className="lg:hidden p-2 text-slate-900 bg-white shadow-sm rounded-xl border border-slate-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[150] bg-white flex flex-col p-8 pt-32 gap-8"
          >
            <NavItem label="Нүүр" href="#home" onClick={() => scrollTo('home')} />
            <NavItem label="Давуу тал" href="#features" onClick={() => scrollTo('features')} />
            <NavItem label="Үнийн санал" href="#pricing" onClick={() => scrollTo('pricing')} />
            <NavItem label="Туршиж үзэх" href="#demo" onClick={() => scrollTo('demo')} />
            <button onClick={() => setActiveModal('contact')} className="bg-brand-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg">Холбоо барих</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <Modal isOpen={!!activeModal && activeModal !== 'success'} onClose={() => setActiveModal(null)} title={activeModal === 'contact' ? 'Холбоо барих' : 'Эхлэх хүсэлт'}>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Таны нэр</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Овог нэр..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Утасны дугаар</label>
            <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="9911..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Мэдээлэл</label>
            <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all h-32 resize-none" placeholder="Таны хүсэлт эсвэл сонирхож буй үйлчилгээ..."></textarea>
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all">Илгээх</button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'success'} onClose={() => setActiveModal(null)} title="Амжилттай">
        <div className="text-center space-y-6 py-10">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-slate-900">Хүсэлт хүлээн авлаа</h4>
            <p className="text-slate-500 font-medium">Манай ажилтан тантай 24 цагийн дотор холбогдох болно. Баярлалаа!</p>
          </div>
          <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">Хаах</button>
        </div>
      </Modal>

      {/* Hero Section */}
      <section id="home" className="relative pt-40 pb-20 lg:pt-56 lg:pb-36 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-gradient-to-bl from-brand-50/50 via-transparent to-transparent rounded-bl-[200px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.03] select-none text-[25rem] font-black flex items-center justify-center text-slate-900 overflow-hidden leading-none uppercase">SIS</div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-100/80 border border-brand-200 text-brand-700 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
                <Sparkles size={16} className="text-brand-500 animate-pulse" /> ТАНЫ БИЗНЕСИЙН ҮНЭТ ТУСЛАГЧ
              </div>
              <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 leading-[1.05] tracking-tight">
                Бизнесийн үнэнч <span className="text-brand-600">SIS</span> туслагч
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                10 жил тасралтгүй ажиллаж туршигдсан чанар. Шинэ технологи болгоныг цаг алдалгүй нэвтрүүлдэг хүчирхэг баг хамт олон таны бизнест шууд үр дүн амлаж байна.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button 
                  onClick={() => scrollTo('demo')}
                  className="bg-brand-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-200 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Үнэгүй туршиж үзэх <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveModal('contact')}
                  className="bg-white text-slate-900 border-2 border-slate-100 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-100"
                >
                  Зөвлөгөө авах
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
               <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.25)] border-[12px] border-white ring-1 ring-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2426" 
                    alt="SIS ERP Dashboard" 
                    className="w-full h-auto" 
                  />
               </div>
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-8 -left-8 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-5"
               >
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Өдөр тутмын өсөлт</div>
                    <div className="text-2xl font-black text-slate-900">+124%</div>
                  </div>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
            <span className="text-brand-600 font-black text-sm uppercase tracking-[0.3em]">Шийдлүүд</span>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Бид юу санал болгодог вэ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Bot} title="Facebook AI Agent" desc="Facebook Messenger дээр хэрэглэгчтэй харилцаж, шууд захиалга үүсгэж өгөх ухаалаг туслагч." />
            <FeatureCard icon={MessageSquare} title="Comment-to-Order AI" desc="Постны комментонд AI хариулт өгөх ба дугаар бүртгэгдсэн бол системд шууд захиалга үүсгэнэ." />
            <FeatureCard icon={PhoneCall} title="CallPro Интеграц" desc="Хэн залгасан, ямар яриа өрнөсөн зэрэг бүх мэдээллийг системээсээ шууд хянах боломж." />
            <FeatureCard icon={Warehouse} title="Агуулахын хяналт" desc="Барааны үлдэгдэл, санхүүгийн тооцоолол, агуулахын бүрэн хяналтыг системээр удирдах." />
            <FeatureCard icon={Truck} title="Хүргэлтийн нэгдсэн шийдэл" desc="Манай 'Очлоо' хүргэлтийн сүлжээг ашиглан 97%-ийн амжилттай хүргэлт хийлгэх." />
            <FeatureCard icon={Package} title="COD - Төлбөрийн шийдэл" desc="Барааг хүргэж өгөөд төлбөрийг бэлнээр болон картаар авч таны дансанд шуурхай шилжүүлнэ." />
          </div>
        </div>
      </section>

      {/* AI Simulation / Demo Section */}
      <section id="demo" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-10">
              <span className="text-brand-400 font-black text-sm uppercase tracking-[0.4em]">Туршиж үзэх</span>
              <h2 className="text-5xl lg:text-7xl font-black leading-[1.1]">SIS AI-тай <br/><span className="text-brand-500">харилцаад</span> үз</h2>
              <p className="text-slate-400 text-xl font-medium">Манай AI таны бизнесийн мэдээллийг сурч, хэрэглэгчдэд 24/7 хариулахад бэлэн болсон.</p>
              <div className="flex items-start gap-5">
                 <div className="w-14 h-14 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center shrink-0 border border-brand-500/30">
                   <Headphones size={28} />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold mb-2">Монголоор чөлөөтэй ярьдаг</h4>
                   <p className="text-slate-400 leading-relaxed">Монгол хэлний зүй тогтол, ярианы хэв маягийг бүрэн ойлгож, зөв хариулт өгнө.</p>
                 </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-700 shadow-2xl h-[600px] flex flex-col">
                <div className="flex-grow overflow-y-auto space-y-6 px-2 custom-scrollbar">
                  {demoMessages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`p-5 rounded-2xl max-w-[85%] font-medium ${msg.role === 'ai' ? 'bg-slate-700/50 rounded-tl-none border border-slate-600' : 'bg-brand-600 rounded-tr-none shadow-lg'}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 p-4 rounded-2xl rounded-tl-none border border-slate-600 flex gap-2 items-center">
                        <Loader2 className="animate-spin text-brand-400" size={16} />
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">SIS Agent хариулж байна...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleDemoSend} className="mt-8 flex gap-4">
                  <input 
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="flex-grow h-16 bg-slate-900/50 rounded-2xl border border-slate-700 flex items-center px-6 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-white placeholder-slate-500" 
                    placeholder="Системийн талаар асуух зүйлээ бичнэ үү..." 
                  />
                  <button type="submit" disabled={isTyping} className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all disabled:opacity-50">
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
            <span className="text-brand-600 font-black text-sm uppercase tracking-[0.3em]">Үйлчилгээ</span>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">ERP Хөгжүүлэлтийн шатууд</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PricingCard 
              stage="1-р ШАТ"
              title="Үнэгүй"
              priceInfo="Хүргэлт хэрэглэгчдэд зориулсан"
              onAction={() => setActiveModal('signup')}
              features={["Хүргэлтийн үйлчилгээ", "Системийн үндсэн эрх", "Үнэгүй туршиж үзэх"]}
            />
            <PricingCard 
              stage="2-р ШАТ"
              title="Үндсэн"
              isPopular
              onAction={() => setActiveModal('signup')}
              priceInfo="Захиалгын хэмжээнээс хамаарна"
              features={["Хүргэлтийн модуль", "Бараа бүртгэл", "Санхүүгийн удирдлага", "Цаг бүртгэл"]}
            />
            <PricingCard 
              stage="3-р ШАТ"
              title="Дижитал"
              onAction={() => setActiveModal('signup')}
              priceInfo="2-р шат дээр нэмэлтээр"
              features={["Вэб хуудастай болох", "Линк захиалгын систем", "Custom Домейн"]}
            />
            <PricingCard 
              stage="4-р ШАТ"
              title="Про"
              onAction={() => setActiveModal('signup')}
              priceInfo="Цогц ухаалаг шийдэл"
              features={["AI Чатбот үйлчилгээ", "CallPro интеграц", "24/7 VIP дэмжлэг"]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 pt-32 pb-16 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 pb-24 border-b border-slate-800">
            <div className="lg:col-span-1 space-y-8">
               <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">S</div>
                <span className="text-2xl font-black tracking-tighter uppercase">SIS <span className="text-brand-600">Agent</span></span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                10 жилийн туршлагатай хамт олон таны бизнест шинэ үеийн технологийн шийдлүүдийг санал болгож байна.
              </p>
            </div>
            
            <div className="space-y-8">
               <h4 className="text-xl font-black">Үйлчилгээ</h4>
               <ul className="space-y-4 text-slate-400 font-medium">
                 <li><button onClick={() => scrollTo('features')} className="hover:text-brand-400 transition-colors">ERP Систем</button></li>
                 <li><button onClick={() => scrollTo('demo')} className="hover:text-brand-400 transition-colors">AI Чат туслах</button></li>
                 <li><button onClick={() => scrollTo('pricing')} className="hover:text-brand-400 transition-colors">Үнийн санал</button></li>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-xl font-black">Бүтээгдэхүүн</h4>
               <ul className="space-y-4 text-slate-400 font-medium">
                 <li><a href="https://emall.mn" target="_blank" className="flex items-center gap-2 hover:text-brand-400 transition-colors">Emall.mn <ExternalLink size={14} /></a></li>
                 <li><button onClick={() => setActiveModal('contact')} className="hover:text-brand-400 transition-colors">Очлоо Апп</button></li>
                 <li><button onClick={() => setActiveModal('contact')} className="hover:text-brand-400 transition-colors">Drive Апп</button></li>
               </ul>
            </div>

            <div className="space-y-8">
               <h4 className="text-xl font-black">Холбоо барих</h4>
               <ul className="space-y-6 text-slate-400 font-medium">
                 <li className="flex gap-4 items-center">
                   <Phone size={20} className="text-brand-500" />
                   <span>+976 7700-XXXX</span>
                 </li>
                 <li className="flex gap-4 items-center">
                   <Mail size={20} className="text-brand-500" />
                   <span>info@sis.mn</span>
                 </li>
                 <li className="flex gap-4 items-center">
                   <MapPin size={20} className="text-brand-500" />
                   <span>Улаанбаатар, Монгол улс</span>
                 </li>
               </ul>
            </div>
          </div>
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">© 2024 SIS AGENT. БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.</p>
            <div className="text-slate-400 font-bold text-sm">brosoft.space дээр байршуулсан</div>
          </div>
        </div>
      </footer>

      {/* Floating Messenger FAB */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        <button 
          onClick={() => scrollTo('demo')}
          className="w-16 h-16 bg-brand-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all animate-bounce"
        >
          <MessageSquare size={32} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .glass-nav {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(241, 245, 249, 1);
        }
      `}} />
    </div>
  );
};

export default App;
