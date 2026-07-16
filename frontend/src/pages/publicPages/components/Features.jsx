const FEATURE_LIST = [
  {
    title: "Stay in control",
    desc: "Strong guardrails and your own knowledge base keep every response accurate and on-brand.",
  },
  {
    title: "Step in anytime",
    desc: "Set handoff rules to jump into high-value conversations, monitored in real time.",
  },
  {
    title: "Learn from every chat",
    desc: "Resolution rates, satisfaction scores, and patterns to keep improving performance.",
  },
  {
    title: "No-code embed",
    desc: "One snippet adds the widget to any website, on any stack, in minutes.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1233] md:text-4xl">
          Aligned with your brand, built for trust
        </h2>
        <p className="mt-3 text-slate-500">
          SaraSAiBot works only with the content and guidance you provide — always on script, always on point.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_LIST.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-100 bg-[#F8FAFF] p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="mb-4 h-10 w-10 rounded-xl bg-linear-to-br from-blue-600 to-violet-500 opacity-90" />
            <h3 className="font-semibold text-[#0B1233]">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
