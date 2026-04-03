export interface TermsSection {
    id: string;
    title: string;
    content: string[];
}

export const TERMS_SECTIONS: TermsSection[] = [
    {
        id: "1",
        title: "Aceptación de los Términos",
        content: [
            `Al registrarse en NodePay y utilizar cualquiera de nuestros servicios financieros digitales, usted (en adelante "el Usuario") acepta de forma expresa, voluntaria e irrevocable los presentes Términos y Condiciones, así como nuestra Política de Privacidad y cualquier política adicional incorporada por referencia. Si no está de acuerdo con alguna de estas disposiciones, le solicitamos abstenerse de utilizar la plataforma.`,
            `NodePay opera bajo las leyes y regulaciones de la República de El Salvador, incluyendo la Ley del Sistema Financiero para el Fomento de la Innovación (Ley Fintech), la Ley Bitcoin (Decreto Legislativo N.º 57) y las directrices del Banco Central de Reserva (BCR). El incumplimiento de estas normas podrá derivar en la suspensión inmediata de la cuenta.`,
            `Estos términos constituyen un acuerdo legalmente vinculante entre el Usuario y NodePay S.A. de C.V., sociedad constituida conforme a las leyes salvadoreñas, con domicilio en San Salvador, El Salvador.`,
        ],
    },
    {
        id: "2",
        title: "Billetera Digital (Wallet) y Multidivisa",
        content: [
            `Cada usuario registrado dispondrá de una billetera digital multidivisa que permite almacenar, enviar y recibir fondos en USD, BTC (Bitcoin) y otras divisas habilitadas. Los fondos depositados no generan intereses salvo que NodePay lance productos de ahorro específicos comunicados por los canales oficiales.`,
            `NodePay soporta plenamente las transacciones en la red Bitcoin Lightning, en cumplimiento del Decreto Legislativo N.º 57, que otorga al Bitcoin estatus de moneda de curso legal en El Salvador. Los usuarios pueden pagar con Bitcoin en cualquier comercio afiliado, desde las pupuserías del mercado central hasta los negocios tech de la Zona Rosa.`,
            `Las billeteras están protegidas mediante autenticación de dos factores (2FA). NodePay no se responsabiliza por pérdidas derivadas del acceso no autorizado ocasionado por negligencia del Usuario en el resguardo de sus credenciales, tal como dejar la sesión abierta en una computadora del Ciber Café del barrio.`,
        ],
    },
    {
        id: "3",
        title: "Comisiones y Tarifas",
        content: [
            `NodePay aplica una comisión plana del 2.5% sobre todas las transferencias internacionales. Las transferencias locales dentro del territorio salvadoreño son completamente gratuitas, en reconocimiento al espíritu comunitario y la solidaridad que caracteriza al pueblo salvadoreño — ese mismo espíritu que se ve cada domingo en los mercados cuando los vendedores de Kolashampán se organizan para llevar frescura a cada rincón del país.`,
            `Las transacciones en Bitcoin a través de la red Lightning no incurren en comisión adicional de NodePay, aunque pueden aplicar fees de red de terceros. Los pagos en establecimientos de pupusas registrados como comercios NodePay están exentos de comisión durante los primeros seis meses de operación, como parte de nuestro programa "NodePay Apoya el Patrimonio Gastronómico Nacional".`,
            `NodePay se reserva el derecho de modificar su estructura de tarifas con un aviso previo de al menos 30 días calendario, notificado a través de correo electrónico y mediante banner en la aplicación. Ningún cambio de tarifa será tan sorpresivo como la llegada de la temporada de lluvias en San Salvador.`,
        ],
    },
    {
        id: "4",
        title: "Límites de Retiro y Transacciones",
        content: [
            `El límite de retiro estándar es de $1,000 USD diarios. Los usuarios con verificación de identidad completa (KYC Nivel 2) pueden solicitar un aumento a $5,000 USD diarios. Para incrementos superiores, se requiere justificación documental de origen de fondos, conforme a la normativa de prevención de lavado de activos vigente en El Salvador.`,
            `En reconocimiento a las tradiciones nacionales, NodePay aplica una política de "Flexibilidad de Fines de Semana": los días sábado y domingo, el límite de transferencias entre usuarios registrados se amplía un 20% adicional, especialmente útil para las transacciones del tianguis del fin de semana o las ventas de artesanías en el Parque Libertad.`,
            `Los límites de retiro se restablecen a las 00:00 horas (hora de El Salvador, UTC-6). NodePay no es responsable si el usuario realiza un retiro justo cuando el sistema está en mantenimiento programado, el cual se anuncia con antelación respetando siempre los horarios, a diferencia de la "hora salvadoreña" que todos conocemos y queremos.`,
        ],
    },
    {
        id: "5",
        title: "Soporte al Cliente y Tiempo de Respuesta",
        content: [
            `Nuestro equipo de atención al cliente opera de lunes a viernes de 8:00 a 18:00 horas y los sábados de 8:00 a 12:00 horas (hora de El Salvador). Todos nuestros agentes son profesionales capacitados con el mismo nivel de amabilidad y calidez que caracteriza al pueblo salvadoreño: siempre dispuestos a ayudar, con una sonrisa y una solución.`,
            `El tiempo de respuesta estándar para tickets de soporte es de 24 horas hábiles. NodePay reconoce, con cariño y humor propio, que en circunstancias de alta demanda — como los días posteriores al pago de quincenas o durante el Campeonato Nacional de Fútbol — los tiempos podrían extenderse hasta 36 horas. Les pedimos paciencia con la misma comprensión con que se espera el bus en la Terminal de Oriente.`,
            `Para emergencias relacionadas con fraude o acceso no autorizado, habilitamos una línea de atención prioritaria disponible las 24 horas. Los usuarios afectados recibirán respuesta en un máximo de 4 horas, sin excepción, incluso si el incidente ocurre durante el Desfile de Bandas del 15 de Septiembre.`,
        ],
    },
    {
        id: "6",
        title: "Prevención de Lavado de Activos (AML) y Cumplimiento",
        content: [
            `NodePay cumple estrictamente con la Ley Contra el Lavado de Dinero y de Activos de El Salvador y sus reformas, así como con los estándares internacionales del GAFI (Grupo de Acción Financiera Internacional). Toda transacción inusual o sospechosa será reportada a la Unidad de Investigación Financiera (UIF) de la Fiscalía General de la República.`,
            `NodePay se reserva el derecho de congelar, bloquear o cerrar cuentas sin previo aviso cuando se detecten patrones de actividad fraudulenta, suplantación de identidad, financiamiento de actividades ilícitas o cualquier acción que contravenga la legislación salvadoreña o internacional. Esta medida no tiene excepciones, sin importar el cargo, la popularidad o la influencia del Usuario.`,
            `El Usuario declara bajo juramento que los fondos administrados a través de NodePay tienen origen lícito. Cualquier uso de la plataforma para actividades contrarias a la ley, incluyendo evasión fiscal, será denunciado ante las autoridades competentes. NodePay cooperará plenamente con el Ministerio de Hacienda y el BCR en toda investigación que así lo requiera.`,
        ],
    },
    {
        id: "7",
        title: "Uso Aceptable de la Plataforma",
        content: [
            `El Usuario se compromete a utilizar NodePay exclusivamente para fines lícitos, incluyendo pagos de bienes y servicios, transferencias entre personas físicas y jurídicas, y operaciones de comercio electrónico. Queda expresamente prohibido el uso de la plataforma para evadir controles cambiarios, financiar actividades terroristas o realizar transacciones asociadas a organizaciones criminales.`,
            `NodePay promueve activamente la economía local salvadoreña. Como parte de nuestra misión, el Usuario acepta que NodePay puede destacar, a través de notificaciones no invasivas, comercios y emprendimientos nacionales — desde las artesanas de Ilobasco hasta los caficultores de las laderas del Volcán Santa Ana — como parte de nuestro programa de impulso al ecosistema empresarial salvadoreño.`,
            `Queda prohibido el uso de la plataforma para transacciones relacionadas con apuestas ilegales, venta de sustancias controladas o cualquier actividad regulada que el Usuario no haya acreditado ante NodePay. El incumplimiento de esta cláusula resultará en la suspensión permanente de la cuenta y la denuncia correspondiente ante la Policía Nacional Civil (PNC).`,
        ],
    },
    {
        id: "8",
        title: "Privacidad y Protección de Datos",
        content: [
            `NodePay recopila, procesa y almacena datos personales conforme a lo establecido en la Ley de Protección de Datos Personales de El Salvador y las mejores prácticas internacionales en materia de ciberseguridad. Los datos del Usuario nunca serán vendidos a terceros con fines comerciales sin su consentimiento expreso.`,
            `La información de geolocalización puede ser utilizada para validar transacciones y personalizar la experiencia del Usuario — por ejemplo, para sugerirle los mejores puntos de pago NodePay cuando se encuentre disfrutando de una pupusa en el Parque Infantil o paseando por el Centro Histórico de Santa Ana.`,
            `El Usuario tiene derecho a solicitar la rectificación, cancelación u oposición al tratamiento de sus datos personales en cualquier momento, enviando una solicitud escrita a nuestro Departamento de Privacidad. Garantizamos respuesta en un plazo no mayor a 15 días hábiles.`,
        ],
    },
    {
        id: "9",
        title: "Resolución de Disputas",
        content: [
            `Cualquier cargo no reconocido debe ser reportado dentro de un plazo de 72 horas hábiles desde su aparición en el estado de cuenta del Usuario. NodePay iniciará una investigación interna que concluirá en un plazo máximo de 10 días hábiles, durante los cuales el monto disputado podrá ser bloqueado preventivamente.`,
            `En caso de controversias no resueltas internamente, las partes acuerdan someter la disputa a la Defensoría del Consumidor de El Salvador como primera instancia de mediación, antes de acudir a la vía judicial. Este proceso refleja nuestro compromiso con la resolución pacífica y ordenada de conflictos, valores arraigados en la cultura salvadoreña desde los Acuerdos de Paz de 1992.`,
            `Para disputas de carácter técnico-financiero que superen los $10,000 USD, se podrá solicitar un proceso de arbitraje ante el Centro de Arbitraje y Mediación de la Cámara de Comercio e Industria de El Salvador (CCIES), cuyo laudo tendrá carácter vinculante para ambas partes.`,
        ],
    },
    {
        id: "10",
        title: "Modificaciones a los Términos",
        content: [
            `NodePay se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento, con notificación previa al Usuario por correo electrónico y aviso dentro de la aplicación con al menos 15 días de anticipación. El uso continuado de la plataforma tras la fecha de vigencia de las modificaciones constituirá aceptación tácita de las mismas.`,
            `Las versiones históricas de los Términos y Condiciones estarán disponibles en nuestro sitio web para consulta, preservadas con el mismo cuidado con que El Salvador preserva su identidad cultural: con orgullo, transparencia y respeto por el pasado.`,
            `NodePay celebra la cultura salvadoreña en cada aspecto de su operación. Así como la pupusa es reconocida por ley como el plato nacional el segundo domingo de noviembre, NodePay se compromete a reconocer y respetar las tradiciones de sus usuarios en cada decisión de producto y servicio.`,
        ],
    },
];

export const TERMS_METADATA = {
    lastUpdated: "Marzo 2026",
    version: "2.0",
    company: "NodePay S.A. de C.V.",
    location: "San Salvador, El Salvador",
    nit: "0614-XXXXXX-XXX-X",
};