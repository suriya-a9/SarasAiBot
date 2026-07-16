import { useState } from "react";

const FAQ = [
    {
        q: "What is SaraSAiBot?",
        a: "SaraSAiBot is an AI chatbot platform — build a custom chatbot, train it on your website content, and embed it anywhere in a few clicks.",
    },
    {
        q: "How much does it cost?",
        a: "We have a free plan to get started, plus Pro and Business plans for higher usage. Check the Pricing section for full details.",
    },
    {
        q: "Can I embed this on my own site?",
        a: "Yes! Every chatbot comes with a lightweight embed snippet you can paste into any website, no matter what stack you're using.",
    },
    {
        q: "Do you offer support?",
        a: "Absolutely — our team is available over email and live chat, and Business plans get a dedicated onboarding specialist.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section id="faq" className="bg-linear-to-b from-white to-slate-50 py-28">
            <div className="mx-auto max-w-4xl px-6">
                <div className="text-center">
                    <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                        FAQ
                    </span>

                    <h2 className="mt-5 text-5xl font-bold tracking-tight text-[#0B1233]">
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-lg text-slate-500">
                        Everything you need to know about SaraSAiBot.
                    </p>
                </div>

                <div className="mt-16 space-y-4">
                    {FAQ.map((item, index) => {
                        const open = openIndex === index;
                        return (
                            <div
                                key={item.q}
                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                <button
                                    onClick={() => setOpenIndex(open ? -1 : index)}
                                    className="flex w-full items-center justify-between px-7 py-6 text-left"
                                >
                                    <h3 className="text-lg font-semibold text-[#0B1233]">{item.q}</h3>
                                    <span
                                        className={`text-2xl font-light text-slate-400 transition-transform duration-300 ${open ? "rotate-45" : ""
                                            }`}
                                    >
                                        +
                                    </span>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-7 pb-6 text-slate-500 leading-7">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}