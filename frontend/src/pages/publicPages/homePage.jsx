import Analytics from "./components/Analytics";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import FAQSection from "./components/FAQSection";
import Features from "./components/Features";
import ChatWidget from "./components/ChatWidget";
import Hero from "./components/Hero";
import Nav from "./components/Nav";

const FONT_FAMILY = "'Rubik', ui-sans-serif, system-ui, sans-serif";

export default function HomePage() {
    return (
        <div
            className="min-h-screen bg-white text-[#0B1233] antialiased selection:bg-blue-100"
            style={{ fontFamily: FONT_FAMILY }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <Nav />
            <Hero />
            <Features />
            <Analytics />
            <FAQSection />
            <CTASection />
            <Footer />
            <ChatWidget />
        </div>
    );
}