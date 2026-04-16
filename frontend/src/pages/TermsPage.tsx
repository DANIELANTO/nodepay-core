import { TERMS_SECTIONS, TERMS_METADATA } from "../data/termsData";

export const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Banner */}
            <div
                className="relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #003087 0%, #0057B8 50%, #00A651 100%)" }}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 22px)`,
                    }}
                />
                <div className="relative px-4 sm:px-8 py-8 sm:py-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🇸🇻</span>
                        <span className="text-blue-200 text-sm font-medium tracking-widest uppercase">
                            NodePay · Republic of El Salvador
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Terms and Conditions</h1>
                    <p className="text-blue-100 text-sm max-w-2xl">
                        Binding legal document regulating the use of NodePay's digital financial services,
                        drafted in accordance with the laws of the Republic of El Salvador.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        {[
                            { icon: "📅", label: `Effective since ${TERMS_METADATA.lastUpdated}` },
                            { icon: "⚖️", label: "Jurisdiction: El Salvador" },
                            { icon: "₿", label: "Regulated under Bitcoin Law" },
                        ].map((badge) => (
                            <span
                                key={badge.label}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm"
                            >
                                <span>{badge.icon}</span>
                                {badge.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

                {/* Intro Box */}
                <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-blue-800 text-sm leading-relaxed">
                        <strong>Important:</strong> Welcome to NodePay. By using our digital financial services,
                        you agree to be bound by the following Terms and Conditions in their entirety. We recommend
                        that you read this document carefully. If you have any questions, you can consult our AI assistant
                        in the sidebar or contact our support team.
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="mb-6 sm:mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Table of Contents
                    </h2>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {TERMS_SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#section-${section.id}`}
                                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600 group-hover:bg-blue-200">
                                    {section.id}
                                </span>
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {TERMS_SECTIONS.map((section, idx) => (
                        <div
                            key={section.id}
                            id={`section-${section.id}`}
                            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-gray-100 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                                <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                                    style={{
                                        background: idx % 2 === 0
                                            ? "linear-gradient(135deg, #003087, #0057B8)"
                                            : "linear-gradient(135deg, #0057B8, #00A651)",
                                    }}
                                >
                                    {section.id}
                                </div>
                                <h2 className="font-semibold text-gray-800">{section.title}</h2>
                            </div>
                            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
                                {section.content.map((paragraph, pIdx) => (
                                    <p key={pIdx} className="text-sm leading-relaxed text-gray-600">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cultural Footer Note */}
                <div
                    className="mt-6 sm:mt-8 rounded-xl p-4 sm:p-6 text-center"
                    style={{ background: "linear-gradient(135deg, #003087 0%, #0057B8 60%, #00A651 100%)" }}
                >
                    <span className="text-2xl">🫶</span>
                    <p className="mt-2 text-sm text-blue-100">
                        NodePay is proudly Salvadoran. Built with the human warmth of the "Pulgarcito de América"
                        to connect our people with the digital financial future.
                    </p>
                    <p className="mt-1 text-xs text-blue-300">
                        <em>"Dios, Unión, Libertad"</em> — and also, frictionless payments.
                    </p>
                </div>

                {/* Footer Meta */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
                    <p className="text-xs text-gray-400">
                        Last updated: <strong>{TERMS_METADATA.lastUpdated}</strong> · Version {TERMS_METADATA.version}
                    </p>
                    <p className="text-xs text-gray-400">
                        {TERMS_METADATA.company} · {TERMS_METADATA.location} · NIT: {TERMS_METADATA.nit}
                    </p>
                </div>
            </div>
        </div>
    );
};