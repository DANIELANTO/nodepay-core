import { TERMS_SECTIONS, TERMS_METADATA } from "../data/termsData";

export const TermsPage = () => {
    return (
        <div className="relative z-10">
            {/* Header Banner */}
            <div className="relative overflow-hidden glass-card mb-4">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 22px)`,
                    }}
                />
                <div className="relative px-5 sm:px-8 py-5 sm:py-6 border-b border-border-subtle">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl sm:text-2xl">🇸🇻</span>
                        <span className="text-accent text-xs sm:text-sm font-medium tracking-widest uppercase">
                            NodePay · Republic of El Salvador
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">Terms and Conditions</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl">
                        Binding legal document regulating the use of NodePay's digital financial services,
                        drafted in accordance with the laws of the Republic of El Salvador.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                        {[
                            { icon: "📅", label: `Effective since ${TERMS_METADATA.lastUpdated}` },
                            { icon: "⚖️", label: "Jurisdiction: El Salvador" },
                            { icon: "₿", label: "Regulated under Bitcoin Law" },
                        ].map((badge) => (
                            <span
                                key={badge.label}
                                className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3.5 py-1.5 text-xs text-accent backdrop-blur-sm"
                            >
                                <span>{badge.icon}</span>
                                {badge.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-4">

                {/* Intro Box */}
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 sm:p-4 backdrop-blur-sm shadow-glow-sm">
                    <p className="text-foreground text-xs sm:text-sm leading-relaxed">
                        <strong className="text-accent">Important:</strong> Welcome to NodePay. By using our digital financial services,
                        you agree to be bound by the following Terms and Conditions in their entirety. We recommend
                        that you read this document carefully. If you have any questions, you can consult our AI assistant
                        in the sidebar or contact our support team.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="glass-card p-4 sm:p-5">
                    <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border-subtle pb-4">
                        Table of Contents
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {TERMS_SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#section-${section.id}`}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-surface-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent outline-none"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 border border-border-subtle text-xs font-mono text-muted-foreground group-hover:bg-accent/20 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                                    {section.id}
                                </span>
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-3">
                    {TERMS_SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            id={`section-${section.id}`}
                            className="glass-card overflow-hidden scroll-mt-24"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border-subtle bg-surface-elevated px-4 py-3">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold bg-accent text-white shadow-glow-sm"
                                >
                                    {section.id}
                                </div>
                                <h2 className="font-display font-semibold text-base sm:text-lg text-foreground">{section.title}</h2>
                            </div>
                            <div className="px-4 py-4 space-y-3">
                                {section.content.map((paragraph, pIdx) => (
                                    <p key={pIdx} className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
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
                    <div className="absolute inset-0 bg-accent/5" />
                    <div className="relative z-10">
                        <span className="text-3xl">🫶</span>
                        <p className="mt-4 text-sm text-foreground max-w-lg mx-auto leading-relaxed">
                            NodePay is proudly Salvadoran. Built with the human warmth of the "Pulgarcito de América"
                            to connect our people with the digital financial future.
                        </p>
                        <p className="mt-3 text-xs text-accent">
                            <em>"Dios, Unión, Libertad"</em> — and also, frictionless payments.
                        </p>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pb-10">
                    <p className="text-xs text-muted-foreground">
                        Last updated: <strong className="text-foreground">{TERMS_METADATA.lastUpdated}</strong> · Version {TERMS_METADATA.version}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {TERMS_METADATA.company} · {TERMS_METADATA.location}
                    </p>
                </div>
            </div>
        </div>
    );
};