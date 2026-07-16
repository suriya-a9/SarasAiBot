export default function Analytics() {
    const cards = [
        ["95%", "Resolution Rate"],
        ["3 sec", "Average Response"],
        ["24/7", "Availability"],
        ["40%", "Support Cost Saved"],
    ];

    return (
        <section className="bg-[#F8FAFF] py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-center text-4xl font-bold">
                    Built to improve every conversation
                </h2>

                <div className="mt-12 grid md:grid-cols-4 gap-6">
                    {cards.map(([value, label]) => (
                        <div
                            key={label}
                            className="rounded-3xl bg-white p-8 shadow-lg text-center"
                        >
                            <h3 className="text-4xl font-bold text-blue-600">{value}</h3>
                            <p className="mt-3 text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}