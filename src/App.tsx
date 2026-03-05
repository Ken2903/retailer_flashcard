import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  RefreshCcw, 
  Plus, 
  Layers, 
  Info,
  Sparkles,
  Menu
} from 'lucide-react';

// --- Types ---
export interface Deck {
  id: string;
  name: string;
  created_at: string;
  products: Product[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  image_url: string;
}

export type Page = 'landing' | 'dashboard' | 'upload' | 'study' | 'deck-details';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  // Load decks from localStorage on mount
  useEffect(() => {
    const savedDecks = localStorage.getItem('retail_decks');
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    }
  }, []);

  // Save decks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('retail_decks', JSON.stringify(decks));
  }, [decks]);

  const handleUploadSuccess = (newDeck: Deck) => {
    setDecks(prev => [newDeck, ...prev]);
    setCurrentPage('dashboard');
  };

  const navigateToDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentPage('deck-details');
  };

  const startStudy = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentPage('study');
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans selection:bg-primary/20">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col overflow-x-hidden">
        
        {/* Header */}
        {currentPage !== 'landing' && (
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage('dashboard')} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <Menu className="w-6 h-6 text-primary" />
              </button>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Retail Master</h2>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {currentPage === 'landing' && <LandingPage onStart={() => setCurrentPage('dashboard')} />}
            {currentPage === 'dashboard' && (
              <DashboardPage 
                decks={decks} 
                onUpload={() => setCurrentPage('upload')} 
                onSelectDeck={navigateToDeck}
                onStudyDeck={startStudy}
              />
            )}
            {currentPage === 'upload' && (
              <UploadPage 
                onSuccess={handleUploadSuccess} 
                onBack={() => setCurrentPage('dashboard')}
              />
            )}
            {currentPage === 'deck-details' && selectedDeck && (
              <DeckDetailsPage 
                deck={selectedDeck} 
                onBack={() => setCurrentPage('dashboard')} 
                onStudy={() => setCurrentPage('study')}
              />
            )}
            {currentPage === 'study' && selectedDeck && (
              <StudyPage 
                deck={selectedDeck} 
                onFinish={() => setCurrentPage('dashboard')} 
              />
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        {currentPage !== 'landing' && currentPage !== 'study' && (
          <nav className="sticky bottom-0 w-full bg-white border-t border-slate-100 pb-8 pt-2 px-4 flex justify-around items-center">
            <NavButton 
              active={currentPage === 'dashboard'} 
              onClick={() => setCurrentPage('dashboard')} 
              icon={<LayoutDashboard />} 
              label="Home" 
            />
            <NavButton 
              active={currentPage === 'upload'} 
              onClick={() => setCurrentPage('upload')} 
              icon={<Upload />} 
              label="Upload" 
            />
            <NavButton 
              active={false} 
              onClick={() => {}} 
              icon={<Settings />} 
              label="Settings" 
            />
          </nav>
        )}
      </div>
    </div>
  );
}

// --- Sub-Pages ---

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      <div className="px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          AI-Powered Training
        </div>
        <h1 className="text-4xl font-extrabold leading-tight text-slate-900 mb-4">
          Memorize Retail Products <span className="text-primary">Faster</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xs mx-auto">
          Master your product catalog with interactive flashcards designed for retail experts.
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={onStart}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Start Learning <ArrowRight className="w-5 h-5" />
          </button>
          <button className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
            Watch Demo
          </button>
        </div>
      </div>

      <div className="px-6 mb-12">
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
          <img 
            src="https://picsum.photos/seed/retail/800/600" 
            alt="Retail" 
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-xl">
              <p className="text-[10px] font-bold text-primary uppercase">New Card Set</p>
              <p className="text-sm font-bold">Fall Collection 2024</p>
            </div>
          </div>
        </div>
      </div>

      <section className="px-6 py-12 bg-slate-50 rounded-t-[3rem]">
        <h3 className="text-2xl font-bold text-center mb-10">How it works</h3>
        <div className="space-y-10">
          <FeatureItem 
            icon={<Upload className="text-primary" />} 
            title="Upload product list" 
            desc="Import your inventory CSV directly into the platform." 
          />
          <FeatureItem 
            icon={<Sparkles className="text-primary" />} 
            title="Auto-generate cards" 
            desc="Our system identifies key specs and prices to create smart decks." 
          />
          <FeatureItem 
            icon={<RefreshCcw className="text-primary" />} 
            title="Learn faster" 
            desc="Spaced repetition ensures you remember every detail for every customer." 
          />
        </div>
      </section>
    </motion.div>
  );
}

function DashboardPage({ decks, onUpload, onSelectDeck, onStudyDeck }: { 
  decks: Deck[], 
  onUpload: () => void, 
  onSelectDeck: (d: Deck) => void,
  onStudyDeck: (d: Deck) => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Your Collections</h2>
          <p className="text-slate-500 text-sm">Keep up the great work!</p>
        </div>
        <button 
          onClick={onUpload}
          className="w-12 h-12 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {decks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No decks yet. Upload a CSV to start.</p>
            <button onClick={onUpload} className="mt-4 text-primary font-bold">Upload Now</button>
          </div>
        ) : (
          decks.map(deck => (
            <div 
              key={deck.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="aspect-[21/9] w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${deck.id}/800/400`} 
                  alt={deck.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-primary text-white">Inventory</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{deck.name}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {deck.products.length} Items</span>
                  <span className="flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> {new Date(deck.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onStudyDeck(deck)}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    Study <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onSelectDeck(deck)}
                    className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function UploadPage({ onSuccess, onBack }: { onSuccess: (deck: Deck) => void, onBack: () => void }) {
  const [deckName, setDeckName] = useState('');
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target?.result as string);
      if (!deckName) setDeckName(file.name.replace('.csv', ''));
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!deckName || !csvData) return;
    setLoading(true);
    
    try {
      const lines = csvData.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const skuIdx = headers.indexOf('sku');
      const nameIdx = headers.indexOf('product name');
      const priceIdx = headers.indexOf('price');
      const imgIdx = headers.indexOf('image url');

      if (skuIdx === -1 || nameIdx === -1) {
        alert("Invalid CSV format. Required: SKU, Product Name");
        setLoading(false);
        return;
      }

      const products: Product[] = lines.slice(1).map((line, i) => {
        const cols = line.split(',').map(c => c.trim());
        return {
          id: Math.random().toString(36).substr(2, 9),
          sku: cols[skuIdx] || '',
          name: cols[nameIdx] || '',
          price: parseFloat(cols[priceIdx]) || 0,
          image_url: cols[imgIdx] || ''
        };
      }).filter(p => p.name);

      const newDeck: Deck = {
        id: Math.random().toString(36).substr(2, 9),
        name: deckName,
        created_at: new Date().toISOString(),
        products
      };

      onSuccess(newDeck);
    } catch (err) {
      alert("Error parsing CSV");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-extrabold">Import Inventory</h2>
        <p className="text-sm text-slate-500">Turn your spreadsheets into interactive study tools.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Deck Name</label>
          <input 
            type="text" 
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. Summer Collection 2024"
            className="w-full px-4 py-4 rounded-2xl bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all"
          />
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center gap-6 rounded-[2rem] border-2 border-dashed border-primary/30 bg-white px-6 py-12 transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
        >
          <div className="bg-primary/10 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              {csvData ? 'File Selected' : 'Tap to select CSV'}
            </p>
            <p className="text-xs text-slate-500">Excel or CSV files (up to 10MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
        </div>

        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" /> Required CSV Columns
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">1</span>
              <div>
                <p className="text-sm font-semibold">SKU</p>
                <p className="text-xs text-slate-500">Unique identifier</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">2</span>
              <div>
                <p className="text-sm font-semibold">Product Name</p>
                <p className="text-xs text-slate-500">Title shown on front</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">3</span>
              <div>
                <p className="text-sm font-semibold">Price</p>
                <p className="text-xs text-slate-500">Numerical value</p>
              </div>
            </li>
          </ul>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading || !deckName || !csvData}
          className="w-full flex items-center justify-center gap-2 rounded-2xl h-16 bg-slate-900 text-white text-lg font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Generate Flashcards'}
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function DeckDetailsPage({ deck, onBack, onStudy }: { deck: Deck, onBack: () => void, onStudy: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-extrabold truncate">{deck.name}</h2>
      </div>

      <button 
        onClick={onStudy}
        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
      >
        Start Studying <BookOpen className="w-5 h-5" />
      </button>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Products ({deck.products.length})</h3>
        {deck.products.map(product => (
          <div key={product.id} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
              <img 
                src={product.image_url || `https://picsum.photos/seed/${product.id}/200`} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">{product.name}</p>
              <p className="text-xs text-slate-500">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StudyPage({ deck, onFinish }: { deck: Deck, onFinish: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomizedCards, setRandomizedCards] = useState<Product[]>([]);

  useEffect(() => {
    setRandomizedCards([...deck.products].sort(() => Math.random() - 0.5));
  }, [deck]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < randomizedCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  if (randomizedCards.length === 0) return <div className="p-10 text-center">Loading...</div>;

  const currentCard = randomizedCards[currentIndex];
  const progress = ((currentIndex + 1) / randomizedCards.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-80px)]"
    >
      {/* Progress Bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Mastery</span>
          <span className="text-xs font-bold text-primary">{currentIndex + 1} / {randomizedCards.length} Cards</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="relative w-full max-w-md mx-auto aspect-[4/5] perspective-1000">
          <motion.div 
            className="w-full h-full relative preserve-3d transition-all duration-500 cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
              <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
                <img 
                  src={currentCard.image_url || `https://picsum.photos/seed/${currentCard.id}/400`} 
                  alt="Product" 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 text-center bg-white">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Product Image</p>
                <button className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-2 mx-auto">
                  <RefreshCcw className="w-3 h-3" /> Tap to Flip
                </button>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden rotate-y-180">
              <div className="flex-1 flex flex-col justify-center p-10 text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Product Name</p>
                  <h3 className="text-3xl font-extrabold text-slate-900">{currentCard.name}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SKU Number</p>
                  <p className="text-xl font-bold text-slate-700">{currentCard.sku}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retail Price</p>
                  <p className="text-4xl font-extrabold text-primary">${currentCard.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 text-center">
                <button className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto">
                  <RefreshCcw className="w-3 h-3" /> Tap to flip back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Recall the product details then flip to check
        </p>
      </div>

      {/* Action Bar */}
      <footer className="bg-white p-6 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 max-w-md mx-auto">
          <button 
            onClick={handleNext}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-20 rounded-2xl border-2 border-slate-100 text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <RefreshCcw className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Review Again</span>
          </button>
          <button 
            onClick={handleNext}
            className="flex-[1.5] flex items-center justify-center gap-3 h-20 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-all"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-bold uppercase">I Remember</span>
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

// --- Helper Components ---

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center mb-4">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8' })}
      </div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-slate-600 max-w-[200px]">{desc}</p>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
