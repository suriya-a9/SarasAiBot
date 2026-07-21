import React, { useState } from "react";
import {
    LifeBuoy,
    Rocket,
    Code2,
    Palette,
    MessageSquare,
    ClipboardList,
    Mail,
    ChevronDown,
    BookOpen,
    Bot,
} from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-[#40295C]">
                <Icon size={15} strokeWidth={2.2} />
            </div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
    </div>
);

const QuickLinkCard = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 transition-colors hover:border-zinc-300">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#40295C]/5 text-[#40295C]">
            <Icon size={16} strokeWidth={2.2} />
        </div>
        <div>
            <p className="text-sm font-semibold text-zinc-900">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{description}</p>
        </div>
    </div>
);

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
    <div className="rounded-xl border border-zinc-200/80 bg-white">
        <button
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
        >
            <span className="text-sm font-semibold text-zinc-900">{question}</span>
            <ChevronDown
                size={15}
                className={`shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
            />
        </button>
        {isOpen && (
            <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-500">{answer}</div>
        )}
    </div>
);

const faqData = [
    {
        question: "How do I add the chatbot to my website?",
        answer:
            "Go to your chatbot's Overview page and copy the embed code shown there. Paste it into your site's HTML, right before the closing </body> tag. The widget will appear automatically once the page loads.",
    },
    {
        question: "Why isn't my chatbot showing up on my site?",
        answer:
            "Double-check that the embed snippet is placed before the closing </body> tag and that you haven't accidentally pasted it more than once. If you're using a page builder or CMS, make sure custom scripts aren't stripped out by a caching or minification plugin.",
    },
    {
        question: "What is the Knowledge Base used for?",
        answer:
            "Anything you paste into the Knowledge Base field — FAQs, policies, product details — is used by your chatbot to answer visitor questions accurately. Keep it concise and up to date for the best results.",
    },
    {
        question: "Can I change my chatbot's name, avatar, or colors later?",
        answer:
            "Yes. Open your chatbot from the Overview page and click Edit Settings. Any changes you save go live immediately, no need to update your embed code.",
    },
    {
        question: "What does the Pre-chat Form do?",
        answer:
            "When enabled, visitors must submit basic details (name, email, and/or phone) before they can start chatting. This is useful for capturing leads before a conversation begins.",
    },
    {
        question: "Can I change the tone or language my chatbot uses?",
        answer:
            "Yes, both are configurable in the Behavior section of your chatbot's settings. Tone controls how formal or casual responses sound, and language controls what language the bot replies in.",
    },
    {
        question: "Does the widget work on mobile?",
        answer:
            "Yes, the chat widget is responsive and adapts to smaller screens automatically, no extra setup required.",
    },
    {
        question: "How do I remove the chatbot from my site?",
        answer:
            "Simply delete the embed script tag from your site's HTML. The widget will no longer load, and no other changes are needed.",
    },
];

const HelpSupportPage = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                    Help & Support
                </h1>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Guides, FAQs & Ways To Reach Us
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Section icon={Rocket} title="Getting Started">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <QuickLinkCard
                                icon={Bot}
                                title="Create your chatbot"
                                description="Set a name, welcome message, and avatar to get your bot up and running."
                            />
                            <QuickLinkCard
                                icon={Code2}
                                title="Install the widget"
                                description="Copy one script tag into your site to bring your chatbot live."
                            />
                            <QuickLinkCard
                                icon={BookOpen}
                                title="Add a knowledge base"
                                description="Paste in FAQs or policies so your bot can answer accurately."
                            />
                            <QuickLinkCard
                                icon={Palette}
                                title="Customize appearance"
                                description="Match your brand with accent colors and widget placement."
                            />
                        </div>
                    </Section>

                    <Section icon={MessageSquare} title="Frequently Asked Questions">
                        <div className="space-y-2.5">
                            {faqData.map((item, idx) => (
                                <FAQItem
                                    key={idx}
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openIndex === idx}
                                    onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                />
                            ))}
                        </div>
                    </Section>

                    <Section icon={ClipboardList} title="Troubleshooting Tips">
                        <ul className="space-y-3 text-sm leading-relaxed text-zinc-500">
                            <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40295C]" />
                                Widget not appearing? Confirm the embed script is present in your page source and not blocked by a content security policy.
                            </li>
                            <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40295C]" />
                                Bot giving vague answers? Add more detail to your Knowledge Base — the bot can only answer from what you've provided.
                            </li>
                            <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40295C]" />
                                Changes not showing on your site? Clear your browser cache or check if your hosting provider caches static assets.
                            </li>
                            <li className="flex gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40295C]" />
                                Pre-chat form not appearing? Make sure it's toggled on in Settings under Pre-chat Form.
                            </li>
                        </ul>
                    </Section>
                </div>

                <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
                    <Section icon={LifeBuoy} title="Still need help?">
                        <p className="text-sm leading-relaxed text-zinc-500">
                            Can't find what you're looking for? Our support team is happy to help
                            with setup, customization, or anything else.
                        </p>
                        <a
                            href="mailto:support@saraswebsolutions.com"
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#40295C] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-900"
                        >
                            <Mail size={14} />
                            Email Support
                        </a>
                        <p className="text-center text-xs text-zinc-400">
                            We typically respond within 24 hours.
                        </p>
                    </Section>

                    {/* <Section icon={BookOpen} title="Resources">
                        <ul className="space-y-3 text-sm font-medium text-zinc-600">
                            <li className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                Documentation
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                Embed code reference
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                Release notes
                            </li>
                        </ul>
                    </Section> */}
                </div>
            </div>
        </div>
    );
};

export default HelpSupportPage;