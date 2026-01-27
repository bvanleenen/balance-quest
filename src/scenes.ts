import type { Scene } from './gameState'

export const SCENES: Scene[] = [
  // Scene 1: Net Thuis
  {
    id: 'net-thuis',
    time: '16:30',
    location: 'Thuis',
    intro: '',
    text: 'Het is half vijf. Je komt net thuis na een lange dag op school.\n\nJe rugtas ploft op de grond. Je bent moe. Er is nog huiswerk voor morgen, maar je hoofd staat er even niet naar.\n\nWat ga je doen?',
    choices: [
      {
        id: 'a',
        label: 'Direct aan huiswerk',
        subtext: 'Beter nu dan straks. Dan heb ik het maar gehad.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'b',
        label: 'Even scrollen',
        subtext: 'Eerst even ontspannen. 10 minuutjes maar.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'c',
        label: 'Chillen en iets eten',
        subtext: 'Ik pak eerst wat te eten en rust even uit.',
        category: 'rest',
        points: 5,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Goed dat je begint, {name}! Maar vergeet niet af en toe even te pauzeren.',
      },
      b: {
        message: 'Even rust pakken is prima, {name}. Let wel op de tijd!',
      },
      c: {
        message: 'Goed idee om eerst even op te laden. Eten en rust zijn belangrijk!',
        quote: 'Ook rust is productief.',
      },
    },
  },

  // Scene 2: De Scroll-val
  {
    id: 'scroll-val',
    intro: 'Je opende TikTok. "Even 10 minuutjes maar..."',
    text: '...een uur later.\n\nJe schrikt als je op de tijd kijkt. Waar is de tijd gebleven?',
    choices: [
      {
        id: 'prima',
        label: 'Prima',
        subtext: 'Ik geniet ervan, is toch mijn vrije tijd?',
        category: 'neutral',
        points: 0,
        bubbleEffect: 0,
      },
      {
        id: 'mwah',
        label: 'Mwah...',
        subtext: 'Eigenlijk moet ik wat anders doen...',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'schuldig',
        label: 'Schuldig',
        subtext: 'Ugh, weer een uur verspild.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      prima: {
        message: 'Zolang het een bewuste keuze is, is het oké. Geniet ervan!',
      },
      mwah: {
        message: 'Wat als je nu stopt en iets anders gaat doen?',
        quote: 'Kleine stappen brengen je verder dan je denkt.',
        bubbleChange: 'orange',
      },
      schuldig: {
        message: 'Herkenbaar. Maar schuld helpt je niet verder. De volgende keuze is een nieuwe kans.',
        quote: 'Niet perfect, wel vooruit.',
        bubbleChange: 'orange',
      },
    },
  },

  // Scene 3: Huiswerk Stress
  {
    id: 'huiswerk-stress',
    intro: '',
    text: 'Je hebt een opdracht die morgen af moet.\n\nJe hebt er nog niet aan begonnen. De deadline voelt als een gewicht op je schouders.\n\nWat doe je?',
    choices: [
      {
        id: 'a',
        label: 'Nu beginnen',
        subtext: 'Ik begin nu, ook al heb ik geen zin.',
        category: 'work',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'b',
        label: 'Morgen vroeg',
        subtext: 'Ik doe het morgen vroeg wel. Nu kan ik me toch niet concentreren.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'c',
        label: 'Eerst inschatten',
        subtext: 'Ik kijk eerst even hoe lang het duurt. Dan plan ik het in.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Goed bezig, {name}! Beginnen is vaak het moeilijkste.',
        quote: 'Een taak afronden is ook progressie.',
      },
      b: {
        message: 'Uitstellen voelt nu goed, maar hoe voel je je morgenochtend?\n\nSoms is "ik doe het morgen" een belofte die we niet nakomen.',
        bubbleChange: 'orange',
      },
      c: {
        message: 'Slim! Weten wat je te wachten staat helpt om te plannen.',
      },
    },
  },

  // Scene 4: De Pauze
  {
    id: 'de-pauze',
    intro: 'Je bent al 2 uur aan het werk.',
    text: 'Je ogen zijn moe. Je rug doet pijn van het zitten. Je concentratie begint af te nemen.',
    choices: [
      {
        id: 'a',
        label: 'Ja, goed idee',
        subtext: 'Je hebt gelijk. Even pauzeren.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'b',
        label: 'Nog even doorgaan',
        subtext: 'Ik ben bijna klaar. Nog even doorzetten.',
        category: 'work',
        points: 0,
        bubbleEffect: -1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Geniet van je pauze. Je hersenen hebben het nodig!',
        quote: 'Ook rust is productief.',
        badge: 'pauze-pro',
      },
      b: {
        message: 'Oké, maar luister naar je lichaam. Pauzes zijn geen tijdverspilling.',
        bubbleChange: 'orange',
      },
    },
  },

  // Scene 5: Sociale Druk
  {
    id: 'sociale-druk',
    intro: 'Ping!',
    text: 'De groepsapp gaat. Je vrienden sturen:\n\n"Kom je vanavond? We gaan chillen bij Sanne!"\n\nJe hebt eigenlijk nog huiswerk...',
    choices: [
      {
        id: 'a',
        label: 'Ja, ik kom!',
        subtext: 'Huiswerk doe ik later wel. YOLO!',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'b',
        label: 'Nee, ik moet werken',
        subtext: 'Sorry, ik heb nog te veel te doen.',
        category: 'work',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'c',
        label: 'Misschien even',
        subtext: 'Ik kom misschien even, maar niet te lang.',
        category: 'social',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Vrienden zijn belangrijk!\n\nMaar... hoe voel je je straks als je huiswerk nog moet?',
      },
      b: {
        message: 'Goed dat je je prioriteiten kent, {name}.\n\nMaar vergeet niet: sociale connectie is ook balans.',
      },
      c: {
        message: 'Balans! Een beetje van allebei. Slim om grenzen te stellen.',
        quote: 'Balans ziet er voor iedereen anders uit.',
        badge: 'sociale-balancer',
      },
    },
  },

  // Scene 6: Bedtijd Scrollen
  {
    id: 'bedtijd-scrollen',
    time: '23:30',
    location: 'Bed',
    intro: '',
    text: 'Het is half twaalf. Je ligt in bed met je telefoon.\n\nMorgen moet je vroeg op voor school. Je ogen zijn moe, maar je blijft scrollen.',
    choices: [
      {
        id: 'a',
        label: 'Telefoon weg, slapen',
        subtext: 'Je hebt gelijk. Welterusten telefoon.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'b',
        label: 'Nog 10 minuten...',
        subtext: 'Nog even dit filmpje...',
        category: 'scroll',
        points: 0,
        bubbleEffect: -2,
      },
      {
        id: 'c',
        label: 'Ik kan niet slapen zonder scrollen',
        subtext: 'Als ik stop, lig ik alleen maar te denken.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Goede keuze, {name}! Slaap lekker.\n\nMorgen ben je je toekomstige zelf dankbaar.',
        badge: 'nachtrust-held',
      },
      b: {
        message: 'We kennen die "10 minuten" allemaal...',
        bubbleChange: 'orange',
      },
      c: {
        message: 'Herkenbaar. Misschien helpt een podcast of muziek?\n\nScrollen activeert je brein. Audio kan rustgevender zijn.',
      },
    },
  },

  // Scene 7: De Ochtend
  {
    id: 'de-ochtend',
    time: '07:00',
    location: 'Slaapkamer',
    intro: 'Je wekker gaat.',
    text: 'Hoe begin je de dag?',
    choices: [
      {
        id: 'a',
        label: 'Direct telefoon checken',
        subtext: 'Even kijken wat ik gemist heb vannacht.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'b',
        label: 'Eerst douchen en ontbijten',
        subtext: 'Telefoon kan wachten.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'c',
        label: 'Snoozen...',
        subtext: 'Nog 10 minuten... zzz',
        category: 'rest',
        points: 0,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      a: {
        message: 'De dag beginnen met scrollen kan je energie beïnvloeden.\n\nProbeer morgen eens zonder telefoon te starten?',
      },
      b: {
        message: 'Goed bezig! Een rustige start zet de toon voor de dag.',
      },
      c: {
        message: 'Snoozen voelt lekker, maar maakt je vaak juist moe-er.\n\nMorgen direct opstaan?',
      },
    },
  },

  // Scene 8: Lunchpauze
  {
    id: 'lunchpauze',
    time: '12:30',
    location: 'School',
    intro: '',
    text: 'Het is pauze op school. Je zit met je vrienden.\n\nIedereen is op hun telefoon. Het is stil.',
    choices: [
      {
        id: 'a',
        label: 'Meedoen, ook scrollen',
        subtext: 'Als iedereen het doet...',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'b',
        label: 'Even naar buiten',
        subtext: 'Ik ga even een rondje lopen.',
        category: 'rest',
        points: 5,
        bubbleEffect: 1,
      },
      {
        id: 'c',
        label: 'Praten met iemand',
        subtext: 'Ik leg mijn telefoon weg en begin een gesprek.',
        category: 'social',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      a: {
        message: 'Groepsdruk is sterk. Maar jij mag anders kiezen.',
      },
      b: {
        message: 'Frisse lucht en beweging, goed voor je hoofd!',
      },
      c: {
        message: 'Echte gesprekken geven meer energie dan scrollen.',
        quote: 'Sociale connectie is ook balans.',
      },
    },
  },

  // Scene 9: Het Weekend
  {
    id: 'het-weekend',
    time: 'Zaterdagochtend',
    location: 'Thuis',
    intro: '',
    text: 'Het is zaterdagochtend. Geen school vandaag!\n\nJe hebt de hele dag voor jezelf. Wat ga je doen?',
    choices: [
      {
        id: 'a',
        label: 'Uitslapen en Netflix',
        subtext: 'Ik heb rust verdiend. Netflix-dag!',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'b',
        label: 'Iets met vrienden',
        subtext: 'Ik spreek af met vrienden.',
        category: 'social',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'c',
        label: 'Vooruit werken',
        subtext: 'Ik ga alvast wat doen voor volgende week.',
        category: 'work',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      a: {
        message: 'Weekends zijn voor herstel! Geniet ervan.\n\nLet wel op: de hele dag binnen kan je energie juist verlagen.',
      },
      b: {
        message: 'Leuk! Sociale tijd is belangrijk voor je welzijn.',
        quote: 'Balans ziet er voor iedereen anders uit.',
      },
      c: {
        message: 'Slim om vooruit te denken!\n\nMaar vergeet niet ook te ontspannen. Weekends zijn ook voor rust.',
      },
    },
  },

  // Scene 10: Reflectie
  {
    id: 'reflectie',
    intro: 'Even stilstaan...',
    text: 'Je kijkt terug op de keuzes die je hebt gemaakt.\n\nHoe voel je je?',
    choices: [
      {
        id: 'goed',
        label: 'Best goed',
        subtext: 'Ik heb bewuste keuzes gemaakt.',
        category: 'neutral',
        points: 5,
        bubbleEffect: 1,
      },
      {
        id: 'gemengd',
        label: 'Gemengd',
        subtext: 'Sommige dingen had ik anders willen doen.',
        category: 'neutral',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'moeilijk',
        label: 'Het is moeilijk',
        subtext: 'Balans vinden is echt lastig.',
        category: 'neutral',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      goed: {
        message: 'Fijn om te horen, {name}! Bewustzijn is de eerste stap.',
      },
      gemengd: {
        message: 'Herkenbaar. Elke dag is een nieuwe kans om te leren.',
        quote: 'Niet perfect, wel vooruit.',
      },
      moeilijk: {
        message: 'Dat is het ook. Daarom is Balance Quest er - om je te helpen zonder te oordelen.',
        quote: 'Kleine stappen brengen je verder dan je denkt.',
      },
    },
  },
]
