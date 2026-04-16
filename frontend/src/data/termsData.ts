export interface TermsSection {
    id: string;
    title: string;
    content: string[];
}

export const TERMS_SECTIONS: TermsSection[] = [
    {
        id: "1",
        title: "Acceptance of Terms",
        content: [
            `By registering with NodePay and using any of our digital financial services, you (hereinafter "the User") expressly, voluntarily, and irrevocably accept these Terms and Conditions, as well as our Privacy Policy and any additional policies incorporated by reference. If you do not agree with any of these provisions, we ask you to refrain from using the platform.`,
            `NodePay operates under the laws and regulations of the Republic of El Salvador, including the Law of the Financial System for the Promotion of Innovation (Fintech Law), the Bitcoin Law (Legislative Decree No. 57), and the guidelines of the Central Reserve Bank (BCR). Failure to comply with these rules may result in immediate account suspension.`,
            `These terms constitute a legally binding agreement between the User and NodePay S.A. de C.V., a company incorporated under Salvadoran laws, domiciled in San Salvador, El Salvador.`,
        ],
    },
    {
        id: "2",
        title: "Digital Wallet and Multicurrency",
        content: [
            `Each registered user will have a multicurrency digital wallet that allows storing, sending, and receiving funds in USD, BTC (Bitcoin), and other enabled currencies. Deposited funds do not generate interest unless NodePay launches specific savings products communicated through official channels.`,
            `NodePay fully supports transactions on the Bitcoin Lightning Network, in compliance with Legislative Decree No. 57, which grants Bitcoin legal tender status in El Salvador. Users can pay with Bitcoin at any affiliated business, from pupuserías in the central market to tech businesses in the Zona Rosa.`,
            `Wallets are protected by two-factor authentication (2FA). NodePay is not responsible for losses resulting from unauthorized access caused by the User's negligence in safeguarding their credentials, such as leaving a session open on a computer at the local Cyber Cafe.`,
        ],
    },
    {
        id: "3",
        title: "Commissions and Fees",
        content: [
            `NodePay applies a flat 2.5% commission on all international transfers. Local transfers within the Salvadoran territory are completely free, in recognition of the community spirit and solidarity that characterizes the Salvadoran people — that same spirit seen every Sunday in the markets when Kolashampán vendors organize to bring freshness to every corner of the country.`,
            `Bitcoin transactions through the Lightning Network do not incur an additional NodePay commission, although third-party network fees may apply. Payments at pupusa establishments registered as NodePay merchants are exempt from commission during their first six months of operation, as part of our "NodePay Supports the National Gastronomic Heritage" program.`,
            `NodePay reserves the right to modify its fee structure with at least 30 calendar days' prior notice, notified via email and through a banner in the application. No fee change will be as surprising as the arrival of the rainy season in San Salvador.`,
        ],
    },
    {
        id: "4",
        title: "Withdrawal and Transaction Limits",
        content: [
            `The standard withdrawal limit is $1,000 USD per day. Users with full identity verification (KYC Level 2) can request an increase to $5,000 USD per day. For higher increases, documentary justification of the origin of funds is required, in accordance with current anti-money laundering regulations in El Salvador.`,
            `In recognition of national traditions, NodePay applies a "Weekend Flexibility" policy: on Saturdays and Sundays, the transfer limit between registered users is increased by an additional 20%, especially useful for weekend flea market transactions or handicraft sales in Parque Libertad.`,
            `Withdrawal limits reset at 00:00 hours (El Salvador time, UTC-6). NodePay is not responsible if the user makes a withdrawal exactly when the system is undergoing scheduled maintenance, which is announced in advance always respecting the schedules, unlike the "Salvadoran time" we all know and love.`,
        ],
    },
    {
        id: "5",
        title: "Customer Support and Response Time",
        content: [
            `Our customer support team operates from Monday to Friday from 8:00 to 18:00 and Saturdays from 8:00 to 12:00 (El Salvador time). All our agents are trained professionals with the same level of kindness and warmth that characterizes the Salvadoran people: always willing to help, with a smile and a solution.`,
            `The standard response time for support tickets is 24 business hours. NodePay recognizes, with affection and self-deprecating humor, that in times of high demand — such as the days following payday or during the National Football Championship — wait times may extend up to 36 hours. We ask for your patience with the same understanding used when waiting for the bus at the Terminal de Oriente.`,
            `For emergencies related to fraud or unauthorized access, we provide a priority support line available 24 hours a day. Affected users will receive a response in a maximum of 4 hours, without exception, even if the incident occurs during the September 15th Band Parade.`,
        ],
    },
    {
        id: "6",
        title: "Anti-Money Laundering (AML) and Compliance",
        content: [
            `NodePay strictly complies with the Anti-Money Laundering and Asset Law of El Salvador and its amendments, as well as with the international standards of the FATF (Financial Action Task Force). Any unusual or suspicious transaction will be reported to the Financial Investigation Unit (UIF) of the Attorney General of the Republic.`,
            `NodePay reserves the right to freeze, block, or close accounts without prior notice when patterns of fraudulent activity, identity theft, financing of illicit activities, or any action that contravenes Salvadoran or international law are detected. This measure has no exceptions, regardless of the User's position, popularity, or influence.`,
            `The User declares under oath that the funds managed through NodePay have a lawful origin. Any use of the platform for unlawful activities, including tax evasion, will be reported to the relevant authorities. NodePay will fully cooperate with the Ministry of Finance and the BCR in any investigation that requires it.`,
        ],
    },
    {
        id: "7",
        title: "Acceptable Use of the Platform",
        content: [
            `The User agrees to use NodePay exclusively for lawful purposes, including payments for goods and services, transfers between individuals and legal entities, and e-commerce operations. The use of the platform to evade exchange controls, finance terrorist activities, or conduct transactions associated with criminal organizations is expressly prohibited.`,
            `NodePay actively promotes the local Salvadoran economy. As part of our mission, the User accepts that NodePay may highlight, through non-invasive notifications, national businesses and ventures — from the artisans of Ilobasco to the coffee growers on the slopes of the Santa Ana Volcano — as part of our program to boost the Salvadoran business ecosystem.`,
            `The use of the platform for transactions related to illegal betting, sale of controlled substances, or any regulated activity that the User has not accredited with NodePay is prohibited. Violation of this clause will result in permanent account suspension and the corresponding report to the National Civil Police (PNC).`,
        ],
    },
    {
        id: "8",
        title: "Privacy and Data Protection",
        content: [
            `NodePay collects, processes, and stores personal data in accordance with the provisions of the Personal Data Protection Law of El Salvador and international best practices in cybersecurity. The User's data will never be sold to third parties for commercial purposes without their express consent.`,
            `Geolocation information may be used to validate transactions and personalize the User's experience — for example, to suggest the best NodePay payment points when enjoying a pupusa in the Parque Infantil or walking through the Historic Center of Santa Ana.`,
            `The User has the right to request the rectification, cancellation, or opposition to the processing of their personal data at any time by sending a written request to our Privacy Department. We guarantee a response within a period not exceeding 15 business days.`,
        ],
    },
    {
        id: "9",
        title: "Dispute Resolution",
        content: [
            `Any unrecognized charge must be reported within 72 business hours from its appearance on the User's account statement. NodePay will initiate an internal investigation that will conclude within a maximum of 10 business days, during which the disputed amount may be preventively blocked.`,
            `In the event of controversies not resolved internally, the parties agree to submit the dispute to the Consumer Protection Agency of El Salvador as a first instance of mediation, before resorting to judicial proceedings. This process reflects our commitment to the peaceful and orderly resolution of conflicts, values rooted in Salvadoran culture since the 1992 Peace Accords.`,
            `For technical-financial disputes exceeding $10,000 USD, an arbitration process may be requested before the Arbitration and Mediation Center of the Chamber of Commerce and Industry of El Salvador (CCIES), whose award will be binding for both parties.`,
        ],
    },
    {
        id: "10",
        title: "Modifications to the Terms",
        content: [
            `NodePay reserves the right to modify these Terms and Conditions at any time, with prior notice to the User via email and an in-app notice with at least 15 days in advance. Continued use of the platform after the effective date of the modifications will constitute tacit acceptance of them.`,
            `Historical versions of the Terms and Conditions will be available on our website for consultation, preserved with the same care with which El Salvador preserves its cultural identity: with pride, transparency, and respect for the past.`,
            `NodePay celebrates Salvadoran culture in every aspect of its operation. Just as the pupusa is recognized by law as the national dish on the second Sunday of November, NodePay is committed to recognizing and respecting the traditions of its users in every product and service decision.`,
        ],
    },
];

export const TERMS_METADATA = {
    lastUpdated: "March 2026",
    version: "2.0",
    company: "NodePay S.A. de C.V.",
    location: "San Salvador, El Salvador",
    nit: "0614-XXXXXX-XXX-X",
};