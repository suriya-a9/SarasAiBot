import Avatar3D from "./Avatar3D";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#F3F6FF] to-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(500px circle at 15% 20%, rgba(37,99,235,0.12), transparent 60%), radial-gradient(500px circle at 85% 10%, rgba(139,92,246,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI Chatbot Platform
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0B1233] md:text-5xl">
            The AI agent your customers actually want to talk to
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500">
            Resolve customer questions instantly with a chatbot that learns from your own content, speaks in your brand's voice, and never stops working.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-linear-to-r from-blue-600 to-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:opacity-90">
              Start for free →
            </button>
            <button className="rounded-full border border-slate-200 px-7 py-3.5 text-sm font-semibold text-[#0B1233] transition hover:bg-slate-50">
              Contact sales
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">No credit card required</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl shadow-blue-900/10">
          <div className="flex items-center gap-2 rounded-t-2xl bg-linear-to-r from-blue-600 to-violet-500 px-4 py-3">
            <Avatar3D size={32} ring />
            <div>
              <p className="text-sm font-semibold text-white">SaraSAiBot Assistant</p>
              <p className="flex items-center gap-1 text-xs text-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Online now
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3 px-1 pb-2">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#F3F6FF] px-4 py-2 text-sm text-[#0B1233]">
              Hi! What can I ask you?
            </div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-linear-to-r from-blue-600 to-violet-500 px-4 py-2 text-right text-sm font-medium text-white">
              Do you support embeds?
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#F3F6FF] px-4 py-2 text-sm text-[#0B1233]">
              Yes — one snippet, any website 🎉
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
