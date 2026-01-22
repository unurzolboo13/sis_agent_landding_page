
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  Globe, 
  Package, 
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
  ExternalLink,
  ChevronRight
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
- Үнийн санал: 
  1. Үнэгүй - Хүргэлт хэрэглэгчдэд.
  2. Үндсэн - Хүргэлт + Бараа бүртгэл + Санхүү.
  3. Дижитал - Вэб сайт + Линк захиалга.
  4. Про - AI Chat + CallPro + Цогц систем.

Хэрэглэгчийн асуултанд Монгол хэлээр, найрсаг хариулна уу. "brosoft.space" бол манай компанийн албан ёсны технологийн домайн юм.
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
    className="text-slate-600 hover:text-brand-600 font-bold transition-colors text-sm uppercase tracking-wide cursor-pointer"
  >
    {label}
  </a>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
  >
    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
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
          <CheckCircle2 size={18} className="text-brand-600 shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    <button 
      onClick={onAction}
      className={`w-full py-5 rounded-[1.25rem] font-black text-lg transition-all ${isPopular ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-200 active:scale-95' : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'}`}
    >
      Сонгох
    </button>
  </div>
);

// --- Main App ---

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
      window.scrollTo({
        top: el.offsetTop - 80,
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
        setDemoMessages(prev => [...prev, { role: 'ai', text: "Уучлаарай, API түлхүүр тохируулагдаагүй байна. Та Vercel Settings хэсэгт API_KEY нэмнэ үү." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...demoMessages.slice(-6).map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: SIS_SYSTEM_PROMPT,
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "Уучлаарай, систем хариу өгөхөд алдаа гарлаа.";
      setDemoMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      setDemoMessages(prev => [...prev, { role: 'ai', text: "Уучлаарай, холболтонд алдаа гарлаа." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-700">
      
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'glass-nav shadow-lg py-3' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-brand-200">S</div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black text-slate-900">SIS <span className="text-brand-600 tracking-tighter">AGENT</span></span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Enterprise Solution</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <NavItem label="Нүүр" href="#home" onClick={() => scrollTo('home')} />
            <NavItem label="Давуу тал" href="#features" onClick={() => scrollTo('features')} />
            <NavItem label="Үнийн санал" href="#pricing" onClick={() => scrollTo('pricing')} />
            <NavItem label="Туршиж үзэх" href="#demo" onClick={() => scrollTo('demo')} />
            <button onClick={() => setActiveModal('contact')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-brand-600 transition-all active:scale-95 shadow-xl shadow-slate-200">Холбоо барих</button>
          </div>

          <button className="lg:hidden p-2 bg-white rounded-xl shadow-sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[150] bg-white p-8 pt-32 flex flex-col gap-8">
             <NavItem label="Нүүр" href="#home" onClick={() => scrollTo('home')} />
             <NavItem label="Давуу тал" href="#features" onClick={() => scrollTo('features')} />
             <NavItem label="Үнийн санал" href="#pricing" onClick={() => scrollTo('pricing')} />
             <NavItem label="Туршиж үзэх" href="#demo" onClick={() => scrollTo('demo')} />
             <button onClick={() => setActiveModal('contact')} className="bg-brand-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg">Холбоо барих</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <Modal isOpen={!!activeModal && activeModal !== 'success'} onClose={() => setActiveModal(null)} title={activeModal === 'contact' ? 'Холбоо барих' : 'Бүртгүүлэх'}>
         <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setActiveModal('success'); }}>
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Нэр</label>
               <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Нэрээ бичнэ үү" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black uppercase text-slate-400">Утас</label>
               <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Утасны дугаар" />
            </div>
            <button className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-200 active:scale-95 transition-all">Илгээх</button>
         </form>
      </Modal>

      <Modal isOpen={activeModal === 'success'} onClose={() => setActiveModal(null)} title="Амжилттай">
        <div className="text-center py-10 space-y-6">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h4 className="text-2xl font-black">Хүсэлт илгээгдлээ</h4>
          <p className="text-slate-500 font-medium">Тун удахгүй манай менежер холбогдох болно.</p>
          <button onClick={() => setActiveModal(null)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black">Хаах</button>
        </div>
      </Modal>

      {/* Hero */}
      <section id="home" className="relative pt-48 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-brand-50 to-transparent rounded-bl-[200px]" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-200">
                <Sparkles size={14} /> ТАНЫ БИЗНЕСИЙН ТЕХНОЛОГИЙН ТҮНШ
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1] tracking-tighter">
                Бизнесийн <br/> ухаалаг <span className="text-brand-600">SIS</span> туслах
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed max-w-xl">
                10 жилийн туршлага дээр суурилсан Монголын шилдэг ERP болон AI системийг өөрийн бизнестээ нэвтрүүлж борлуулалтаа 2 дахин нэмэгдүүл.
              </p>
              <div className="flex flex-wrap gap-5">
                <button onClick={() => scrollTo('demo')} className="px-10 py-6 bg-brand-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-brand-200 flex items-center gap-3 active:scale-95 transition-all group">
                  Туршиж үзэх <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button onClick={() => setActiveModal('contact')} className="px-10 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-3xl font-black text-xl shadow-xl shadow-slate-100 active:scale-95 transition-all">
                  Бүртгүүлэх
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 p-4 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
                 <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" className="w-full h-auto rounded-[2.5rem]" alt="Dashboard" />
                 <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 flex items-center gap-5">
                    <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                       <TrendingUp size={28} />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Амжилттай хүргэлт</div>
                       <div className="text-2xl font-black text-slate-900">97.4%</div>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
             {[
               { val: "10+", label: "Жилийн туршлага" },
               { val: "110+", label: "Хүргэлтийн ажилтан" },
               { val: "87", label: "Бүсчилсэн сүлжээ" },
               { val: "24/7", label: "Ухаалаг систем" }
             ].map((s, i) => (
               <div key={i} className="text-center space-y-2">
                  <div className="text-5xl font-black text-brand-500">{s.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
             <span className="text-brand-600 font-black text-sm uppercase tracking-widest">Давуу тал</span>
             <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter">Бизнест тань зориулсан шийдэл</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Bot} title="Facebook AI Agent" desc="Messenger-ээр хэрэглэгчидтэй харилцаж, захиалгыг автоматаар үүсгэнэ." />
            <FeatureCard icon={MessageSquare} title="Comment-to-Order" desc="Постны комментоос дугаар бүртгэж, захиалга болгон системд оруулна." />
            <FeatureCard icon={PhoneCall} title="CallPro Интеграц" desc="Захиалгын дуудлагыг бүртгэж, хэрэглэгчийн мэдээллийг шууд харуулна." />
            <FeatureCard icon={Warehouse} title="Агуулахын систем" desc="Барааны үлдэгдэл, орлого, зарлагыг бодит хугацаанд хянах боломж." />
            <FeatureCard icon={Truck} title="Очлоо Хүргэлт" desc="Хүргэлтийн нэгдсэн системээр 97% амжилттай хүргэлт хийж гүйцэтгэнэ." />
            <FeatureCard icon={LayoutDashboard} title="Нэгдсэн удирдлага" desc="Бизнесийнхээ бүх үйл ажиллагааг нэг дороос хянах хүчирхэг ERP систем." />
          </div>
        </div>
      </section>

      {/* Demo AI Chat */}
      <section id="demo" className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-10">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">Манай <span className="text-brand-600">AI</span>-тай харилцаад үз</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">Системийн талаар асуух зүйлээ Монголоор бичнэ үү. Манай AI танд 24/7 хариулахад бэлэн.</p>
              <div className="flex gap-4">
                 <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Headphones size={24} />
                 </div>
                 <p className="text-slate-500 font-medium italic">"Манай AI Монгол хэлний зүй тогтол, ярианы хэв маягийг бүрэн ойлгодог."</p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
               <div className="bg-slate-900 rounded-[3rem] p-8 h-[600px] flex flex-col shadow-2xl border-8 border-slate-800">
                  <div className="flex-grow overflow-y-auto space-y-6 px-2 custom-scrollbar">
                     {demoMessages.map((msg, i) => (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                          <div className={`p-5 rounded-2xl max-w-[85%] font-medium text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 'bg-brand-600 text-white rounded-tr-none shadow-lg'}`}>
                             {msg.text}
                          </div>
                       </motion.div>
                     ))}
                     {isTyping && (
                       <div className="flex justify-start">
                          <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-3 items-center">
                             <Loader2 size={16} className="animate-spin text-brand-500" />
                             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Хариулж байна...</span>
                          </div>
                       </div>
                     )}
                     <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleDemoSend} className="mt-8 flex gap-3">
                     <input value={demoInput} onChange={(e) => setDemoInput(e.target.value)} className="flex-grow h-16 bg-slate-800 rounded-2xl px-6 text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all border border-slate-700" placeholder="Асуух зүйлээ бичнэ үү..." />
                     <button type="submit" disabled={isTyping} className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg">
                        <Send size={24} />
                     </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
           <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
             <span className="text-brand-600 font-black text-sm uppercase tracking-widest">Үнийн санал</span>
             <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter">Бизнесийн өсөлтийн шат</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <PricingCard stage="1-р ШАТ" title="Үнэгүй" priceInfo="Хүргэлтийн багт зориулсан" onAction={() => setActiveModal('signup')} features={["Хүргэлт бүртгэл", "Системийн эрх", "Үнэгүй туршилт"]} />
             <PricingCard stage="2-р ШАТ" title="Үндсэн" isPopular priceInfo="Бизнесийн цар хүрээнээс хамаарна" onAction={() => setActiveModal('signup')} features={["Хүргэлт модуль", "Бараа бүртгэл", "Санхүүгийн модуль", "Ажилчдын хяналт"]} />
             <PricingCard stage="3-р ШАТ" title="Дижитал" priceInfo="2-р шат + Нэмэлт боломж" onAction={() => setActiveModal('signup')} features={["Цахим вэб сайт", "Линк захиалга", "Custom Домейн", "Маркетинг тохиргоо"]} />
             <PricingCard stage="4-р ШАТ" title="Про" priceInfo="Цогц ухаалаг шийдэл" onAction={() => setActiveModal('signup')} features={["AI Чатбот туслах", "CallPro Интеграц", "Оператор систем", "24/7 VIP дэмжлэг"]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 pt-32 pb-16 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 pb-20 border-b border-slate-800">
             <div className="lg:col-span-1 space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">S</div>
                   <span className="text-2xl font-black tracking-tighter uppercase">SIS <span className="text-brand-600">AGENT</span></span>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed">
                   10 жилийн туршлагатай хамт олон таны бизнест шинэ үеийн технологийн шийдлүүдийг санал болгож байна.
                </p>
             </div>
             <div>
                <h4 className="text-xl font-black mb-8">Үйлчилгээ</h4>
                <ul className="space-y-4 text-slate-400 font-bold">
                   <li><button onClick={() => scrollTo('features')} className="hover:text-brand-500 transition-colors">ERP Систем</button></li>
                   <li><button onClick={() => scrollTo('demo')} className="hover:text-brand-500 transition-colors">AI Чатбот</button></li>
                   <li><button onClick={() => scrollTo('pricing')} className="hover:text-brand-500 transition-colors">Үнийн санал</button></li>
                </ul>
             </div>
             <div>
                <h4 className="text-xl font-black mb-8">Бүтээгдэхүүн</h4>
                <ul className="space-y-4 text-slate-400 font-bold">
                   <li><a href="https://emall.mn" target="_blank" className="flex items-center gap-2 hover:text-brand-500">Emall.mn <ExternalLink size={14} /></a></li>
                   <li><button className="hover:text-brand-500">Очлоо Апп</button></li>
                   <li><button className="hover:text-brand-500">Drive Апп</button></li>
                </ul>
             </div>
             <div>
                <h4 className="text-xl font-black mb-8">Холбоо барих</h4>
                <div className="space-y-6 text-slate-400 font-bold">
                   <div className="flex gap-4 items-center">
                      <Phone size={20} className="text-brand-500" />
                      <span>+976 7700-0000</span>
                   </div>
                   <div className="flex gap-4 items-center">
                      <Mail size={20} className="text-brand-500" />
                      <span>info@sis.mn</span>
                   </div>
                   <div className="flex gap-4 items-center">
                      <MapPin size={20} className="text-brand-500" />
                      <span>Улаанбаатар, Монгол</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-slate-500 text-xs font-black uppercase tracking-widest">© 2024 SIS AGENT. ALL RIGHTS RESERVED.</p>
             <div className="px-5 py-2 bg-slate-800 rounded-full text-xs font-black text-slate-400 border border-slate-700">Powered by brosoft.space</div>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-[100]">
         <button onClick={() => scrollTo('demo')} className="w-20 h-20 bg-brand-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all animate-bounce">
            <MessageSquare size={36} />
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .glass-nav {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(226, 232, 240, 1);
        }
      `}} />
    </div>
  );
};

export default App;
