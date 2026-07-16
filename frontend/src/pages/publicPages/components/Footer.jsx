export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-[#0B1233] py-10">
            <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} SaraSAiBot. All rights reserved.
            </div>
        </footer>
    );
}