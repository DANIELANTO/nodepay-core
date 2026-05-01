import { TERMS_SECTIONS, TERMS_METADATA } from "../data/termsData";

export const TermsPage = () => {
    return (
        <div className="relative z-10">
            {/* Header Banner */}
            <div className="relative overflow-hidden glass-card mb-8">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 22px)`,
                    }}
                />
                <div className="relative px-6 sm:px-10 py-10 sm:py-12 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">🇸🇻</span>
                        <span className="text-amber-600 dark:text-amber-500 text-sm font-medium tracking-widest uppercase">
                            NodePay · Republic of El Salvador
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-slate-50 mb-3">Terms and Conditions</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
                        Binding legal document regulating the use of NodePay's digital financial services,
                        drafted in accordance with the laws of the Republic of El Salvador.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {[
                            { icon: "📅", label: `Effective since ${TERMS_METADATA.lastUpdated}` },
                            { icon: "⚖️", label: "Jurisdiction: El Salvador" },
                            { icon: "₿", label: "Regulated under Bitcoin Law" },
                        ].map((badge) => (
                            <span
                                key={badge.label}
                                className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-xs text-amber-600 dark:text-amber-500 backdrop-blur-sm"
                            >
                                <span>{badge.icon}</span>
                                {badge.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Intro Box */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-sm shadow-glow-sm">
                    <p className="text-slate-900 dark:text-slate-50 text-sm leading-relaxed">
                        <strong className="text-amber-600 dark:text-amber-500">Important:</strong> Welcome to NodePay. By using our digital financial services,
                        you agree to be bound by the following Terms and Conditions in their entirety. We recommend
                        that you read this document carefully. If you have any questions, you can consult our AI assistant
                        in the sidebar or contact our support team.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="glass-card p-6 sm:p-8">
                    <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4">
                        Table of Contents
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {TERMS_SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#section-${section.id}`}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-slate-900 dark:text-slate-50 focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 group-hover:text-amber-600 dark:text-amber-500 transition-colors">
                                    {section.id}
                                </span>
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {TERMS_SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            id={`section-${section.id}`}
                            className="glass-card overflow-hidden scroll-mt-24"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/5 px-6 py-4">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-mono font-bold bg-amber-500 text-[#0A0A0F] shadow-glow-sm"
                                >
                                    {section.id}
                                </div>
                                <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-slate-50">{section.title}</h2>
                            </div>
                            <div className="px-6 py-6 space-y-5">
                                {section.content.map((paragraph, pIdx) => (
                                    <p key={pIdx} className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cultural Footer Note */}
                <div
                    className="mt-10 rounded-2xl p-8 text-center glass-card relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-amber-500/5" />
                    <div className="relative z-10">
                        <span className="text-3xl">🫶</span>
                        <p className="mt-4 text-sm text-slate-900 dark:text-slate-50 max-w-lg mx-auto leading-relaxed">
                            NodePay is proudly Salvadoran. Built with the human warmth of the "Pulgarcito de América"
                            to connect our people with the digital financial future.
                        </p>
                        <p className="mt-3 text-xs text-amber-600 dark:text-amber-500">
                            <em>"Dios, Unión, Libertad"</em> — and also, frictionless payments.
                        </p>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pb-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Last updated: <strong className="text-slate-900 dark:text-slate-50">{TERMS_METADATA.lastUpdated}</strong> · Version {TERMS_METADATA.version}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {TERMS_METADATA.company} · {TERMS_METADATA.location} · NIT: {TERMS_METADATA.nit}
                    </p>
                </div>
            </div>
        </div>
    );
};