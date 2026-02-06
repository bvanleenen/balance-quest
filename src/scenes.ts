import type { Scene } from './gameState'

export const SCENES: Scene[] = [
  // ============================================
  // DAG 1: Donderdag
  // ============================================

  // Scene 1.1: Net Thuis (KERN)
  {
    id: 'net-thuis',
    day: 1,
    isCore: true,
    time: '16:30',
    location: 'Thuis',
    intro: '',
    text: 'Het is half vijf. Je komt net thuis na een lange dag op school.\n\nJe moeder vraagt of je mee-eet om 18:00. Je hebt een wiskundetoets morgen waarvoor je nog moet leren.\n\nNet op dat moment appt je beste vriend: "Heb je even? Slecht nieuws, moet je iets vertellen."',
    relevantHabits: ['finish-tasks', 'less-phone'],
    choices: [
      {
        id: 'vriend-bellen',
        label: 'Vriend bellen',
        subtext: 'Hij klinkt serieus. School kan wachten.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'eerst-leren',
        label: 'Eerst 30 min leren, dan bellen',
        subtext: 'Ik stuur dat ik over een half uur bel. Dan heb ik iets gedaan.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'leren-tot-eten',
        label: 'Leren tot het eten, daarna bellen',
        subtext: 'Als ik nu begin, kan ik na het eten bellen met een rustig hoofd.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      'vriend-bellen': {
        message: 'Je kiest voor je vriend, {name}. Hoe voelt dat?',
        quote: 'Je hebt nog niet geleerd voor morgen.',
        habitMessage: {
          'finish-tasks': 'Je wilde taken afmaken... De toets is morgen.',
        },
      },
      'eerst-leren': {
        message: 'Je probeert beide te doen. Een half uur is een half uur.',
        quote: 'Je vriend wacht op je.',
        habitMessage: {
          'finish-tasks': 'Slim - eerst iets doen, dan sociaal.',
        },
      },
      'leren-tot-eten': {
        message: 'Je kiest voor structuur. De toets is belangrijk voor je.',
        quote: 'Je vriend moet langer wachten met zijn slechte nieuws.',
        habitMessage: {
          'finish-tasks': 'Goede prioritering voor je doel!',
        },
      },
    },
  },

  // Scene 1.2: De Scroll-val
  {
    id: 'scroll-val',
    day: 1,
    isCore: false,
    intro: 'Later die avond. Je opent Instagram om te checken of je crush je story heeft gezien.',
    text: '45 minuten later.\n\nJe hebt 200 reels gekeken. Je weet nog steeds niet of die ene persoon keek. Je scrollde er gewoon langs.\n\nHoe voel je je?',
    relevantHabits: ['less-phone'],
    timedAlert: {
      delay: 3,
      message: 'Je bent nu 45 minuten aan het scrollen. Hoe voel je je eigenlijk?',
      type: 'time',
      expression: 'curious',
    },
    choices: [
      {
        id: 'oke',
        label: '😊 Best oké eigenlijk',
        subtext: 'Ik zag een paar grappige dingen. Was wel ontspannend.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'gemengd',
        label: '🤔 Gemengd',
        subtext: 'Sommige content was leuk, maar ik zocht eigenlijk iets anders.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'leeg',
        label: '😔 Een beetje leeg',
        subtext: 'Ik weet niet eens meer wat ik zag. De tijd is gewoon... weg.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      'oke': {
        message: 'Soms is scrollen gewoon ontspanning. Niks mis mee.',
        quote: 'Hoe vaak voel je dit zo na het scrollen?',
        habitMessage: {
          'less-phone': 'Je wilde minder op je telefoon... Was dit een bewuste keuze?',
        },
      },
      'gemengd': {
        message: 'Je zocht iets specifieks en vond iets anders. Herkenbaar.',
        quote: 'Wat zou je nu eigenlijk willen doen?',
        habitMessage: {
          'less-phone': 'Dit is precies waar je aan wilde werken. Bewustzijn is stap 1!',
        },
      },
      'leeg': {
        message: 'Dat lege gevoel kennen veel mensen. Je bent niet de enige.',
        quote: 'De tijd terugdraaien kan niet. Maar de volgende 45 minuten zijn van jou.',
        habitMessage: {
          'less-phone': 'Je bent je er bewust van - dat is al winst.',
        },
      },
    },
  },

  // Scene 1.B: De Training (Alternatief voor beweging)
  {
    id: 'de-training',
    day: 1,
    isCore: false,
    time: '17:30',
    location: 'Sportschool / Sportveld',
    intro: '',
    text: 'Het is half zes. Je zou eigenlijk naar training gaan.\n\nJe bent moe van school. Het weer is oké, niet geweldig. Je lichaam voelt zwaar.\n\nJe coach appt: "Tot zo!" met een spierballen-emoji.',
    relevantHabits: ['more-exercise'],
    choices: [
      {
        id: 'gaan',
        label: 'Gaan, ook al heb je geen zin',
        subtext: 'Ik weet dat ik me beter voel NA de training. Ik ga.',
        category: 'rest',
        points: 10,
        bubbleEffect: 2,
      },
      {
        id: 'afmelden',
        label: 'Afmelden - te moe',
        subtext: 'Ik luister naar mijn lichaam. Vandaag even niet.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'zelf-trainen',
        label: 'Later zelf trainen',
        subtext: 'Ik ga niet naar de groep, maar doe straks wel een rondje hardlopen.',
        category: 'rest',
        points: 5,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      'gaan': {
        message: 'Je kiest voor beweging ondanks weerstand. Dat is discipline.',
        quote: 'Hoe voelde je je na de laatste training?',
        habitMessage: {
          'more-exercise': 'Dit is precies je doel - meer bewegen. Goed bezig!',
        },
      },
      'afmelden': {
        message: 'Je kiest voor rust. Soms is dat wat je lichaam nodig heeft.',
        quote: 'Wanneer was de laatste keer dat je wél ging terwijl je geen zin had?',
        habitMessage: {
          'more-exercise': 'Rust is ook belangrijk. Maar wordt dit een patroon?',
        },
      },
      'zelf-trainen': {
        message: 'Je zoekt een tussenweg. Zelf trainen vraagt meer zelfdiscipline.',
        quote: 'Lukt het je meestal om dat ook echt te doen?',
        habitMessage: {
          'more-exercise': 'Goed alternatief! Doe je het ook echt straks?',
        },
      },
    },
  },

  // Scene 1.3: Huiswerk Stress
  {
    id: 'huiswerk-stress',
    day: 1,
    isCore: false,
    intro: 'Het is na het eten.',
    text: 'Nu zit je voor je boeken. De wiskundetoets is morgen.\n\nJe bent moe. De stof wil niet landen. Je hoofd zit vol.\n\nWat doe je?',
    relevantHabits: ['finish-tasks', 'take-breaks', 'sleep-on-time'],
    choices: [
      {
        id: 'doordrukken',
        label: 'Doordrukken',
        subtext: 'Ik zet een timer en werk door, ook al wordt het niet mijn beste sessie.',
        category: 'work',
        points: 10,
        bubbleEffect: 0,
      },
      {
        id: 'morgenochtend',
        label: 'Morgenochtend vroeg',
        subtext: 'Als ik nu forceer, blijft het niet hangen. Ik zet mijn wekker vroeger.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'nog-30-min',
        label: 'Nog 30 minuten proberen',
        subtext: 'Ik geef het nog een half uur. Als het dan niet lukt, ga ik slapen.',
        category: 'work',
        points: 10,
        bubbleEffect: 2,
      },
    ],
    bqResponses: {
      'doordrukken': {
        message: 'Je kiest voor doorzetten. Soms is "iets" beter dan "niks".',
        quote: 'Hoe laat denk je klaar te zijn?',
        habitMessage: {
          'finish-tasks': 'Doorzetten past bij je doel!',
          'sleep-on-time': 'Let op je bedtijd...',
        },
      },
      'morgenochtend': {
        message: 'Je vertrouwt op je ochtend-zelf. Dat vraagt discipline morgen.',
        quote: 'Lukt het je meestal om vroeg op te staan als je dat plant?',
        habitMessage: {
          'sleep-on-time': 'Slim - nu slapen, morgen fris.',
        },
      },
      'nog-30-min': {
        message: 'Een tijdslimiet stellen. Slimme manier om jezelf niet uit te putten.',
        habitMessage: {
          'take-breaks': 'Goed! Een grens stellen is ook zelfzorg.',
        },
      },
    },
  },

  // Scene 1.4: Bedtijd
  {
    id: 'bedtijd',
    day: 1,
    isCore: false,
    time: '23:15',
    location: 'Bed',
    intro: '',
    text: 'Je ligt in bed. Morgen is de toets.\n\nJe opent TikTok. Je ziet een video over iets waar je al weken over nadenkt. De comments zijn interessant.',
    relevantHabits: ['sleep-on-time', 'less-phone'],
    timedAlert: {
      delay: 4,
      message: 'Het is bijna middernacht. Je wekker staat over 7 uur.',
      type: 'time',
      expression: 'concerned',
    },
    choices: [
      {
        id: 'rabbit-hole',
        label: 'Deze rabbit hole volgen',
        subtext: 'Dit is interessant. Ik kijk waar dit heengaat.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -2,
      },
      {
        id: 'opslaan',
        label: 'Video opslaan, telefoon weg',
        subtext: 'Ik sla hem op voor later. Nu slapen.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'timer-15',
        label: 'Nog 15 minuten, dan echt stoppen',
        subtext: 'Ik zet een timer. Om 23:30 gaat de telefoon weg.',
        category: 'scroll',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      'rabbit-hole': {
        message: 'Nieuwsgierigheid is menselijk. Rabbit holes kunnen fascinerend zijn.',
        quote: 'Het is nu 23:15. Hoe laat denk je te stoppen?',
        habitMessage: {
          'sleep-on-time': 'Je wilde op tijd naar bed... Het is al laat.',
          'less-phone': 'Dit is een lastig moment voor je doel.',
        },
      },
      'opslaan': {
        message: 'Je stelt uit zonder te verliezen. Morgen is er ook nog.',
        badge: 'uitgestelde-bevrediging',
        habitMessage: {
          'sleep-on-time': 'Perfect! Nu slapen, morgen uitgerust.',
          'less-phone': 'Telefoon weg - precies wat je wilde!',
        },
      },
      'timer-15': {
        message: 'Een timer. Concrete afspraak met jezelf.',
        quote: 'Lukt het je meestal om te stoppen als de timer gaat?',
        habitMessage: {
          'sleep-on-time': 'Beter dan niks, maar het wordt wel 23:30+...',
        },
      },
    },
  },

  // Scene 1.5: De Ochtend (KERN)
  {
    id: 'de-ochtend',
    day: 1,
    isCore: true,
    time: '07:00',
    location: 'Slaapkamer',
    intro: 'Je wekker gaat.',
    text: 'Vandaag is de toets.\n\nJe pakt je telefoon om de wekker uit te zetten. Je ziet een bericht van je vriend: "Thanks voor gister. Je bent een topper. ❤️"\n\nEn een bericht in de groepsapp: "Wie heeft de samenvatting van wiskunde?"',
    relevantHabits: ['less-phone', 'sleep-on-time', 'finish-tasks'],
    choices: [
      {
        id: 'delen-groep',
        label: 'Samenvatting delen',
        subtext: 'Ik heb er gister aan gewerkt. Ik deel hem met de groep.',
        category: 'social',
        points: 5,
        bubbleEffect: 1,
      },
      {
        id: 'delen-vriend',
        label: 'Alleen aan vriend sturen',
        subtext: 'Ik stuur hem privé naar mijn vriend. Hij had het zwaar gister.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'niet-delen',
        label: 'Niet delen',
        subtext: 'Ik heb er zelf voor gewerkt. Ze hadden eerder moeten beginnen.',
        category: 'neutral',
        points: 0,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      'delen-groep': {
        message: 'Je deelt je werk, {name}. Dat is genereus.',
        quote: 'Sommigen hebben gister ook geleerd. Anderen niet.',
      },
      'delen-vriend': {
        message: 'Je helpt je vriend. Selectief delen is ook een keuze.',
        quote: 'De rest van de groep heeft geen samenvatting.',
      },
      'niet-delen': {
        message: 'Je beschermt je eigen werk. Je hebt er tijd in gestoken.',
        quote: 'Hoe denk je dat de groep reageert?',
      },
    },
  },

  // ============================================
  // DAG 2: Vrijdag
  // ============================================

  // Scene 2.1: Na de Toets
  {
    id: 'na-de-toets',
    day: 2,
    isCore: false,
    time: '11:30',
    location: 'School',
    intro: 'De toets is klaar.',
    text: 'In de pauze bespreekt iedereen de antwoorden.\n\n"Wat had jij bij vraag 5?" vraagt iemand. Je weet dat jouw antwoord anders was dan wat de meesten zeggen.',
    relevantHabits: ['finish-tasks'],
    choices: [
      {
        id: 'antwoord-delen',
        label: 'Antwoord delen',
        subtext: 'Ik had [X], maar ik weet niet zeker of het klopt.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'niet-meedoen',
        label: 'Niet meedoen aan de discussie',
        subtext: 'Ik wil het niet weten. Wat gedaan is, is gedaan.',
        category: 'rest',
        points: 10,
        bubbleEffect: 2,
      },
      {
        id: 'luisteren',
        label: 'Luisteren maar niks zeggen',
        subtext: 'Ik luister wel, maar ik deel mijn antwoorden niet.',
        category: 'neutral',
        points: 5,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      'antwoord-delen': {
        message: 'Je bent open over je onzekerheid. Dat is kwetsbaar.',
        quote: 'De groep kijkt je aan. Sommigen hadden hetzelfde.',
      },
      'niet-meedoen': {
        message: 'Je beschermt je rust. De uitslag verandert niet door erover te praten.',
        habitMessage: {
          'take-breaks': 'Goed voor je hoofd - even loslaten.',
        },
      },
      'luisteren': {
        message: 'Je verzamelt informatie zonder jezelf bloot te geven.',
        quote: 'Is dat strategie of onzekerheid?',
      },
    },
  },

  // Scene 2.2: Lunch Drama (KERN)
  {
    id: 'lunch-drama',
    day: 2,
    isCore: true,
    time: '12:45',
    location: 'Schoolplein',
    intro: '',
    text: 'Je zit met je groep. Iemand laat een screenshot zien van een andere groepsapp.\n\nEr wordt gepraat over Lisa - diezelfde Lisa die het moeilijk heeft thuis. Iemand noemt haar "zielig" en "attentie-zoeker".\n\nDe screenshot gaat rond. Iedereen lacht een beetje ongemakkelijk.',
    relevantHabits: [],
    choices: [
      {
        id: 'niks-zeggen',
        label: 'Niks zeggen',
        subtext: 'Ik bemoei me er niet mee. Het gaat vanzelf over.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'uitspreken',
        label: 'Zeggen dat het niet oké is',
        subtext: 'Ik zeg: "Guys, dit is niet cool. Ze heeft het al moeilijk."',
        category: 'social',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'later-prive',
        label: 'Later privé tegen iemand zeggen',
        subtext: 'Ik zeg nu niks, maar ik app straks iemand dat ik het niet oké vond.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'weglopen',
        label: 'Weglopen',
        subtext: 'Ik sta op en loop weg. Ik hoef hier niet bij te zijn.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      'niks-zeggen': {
        message: 'Je kiest voor niet-ingrijpen. Soms is dat makkelijker.',
        quote: 'Het gesprek gaat door. Lisa hoort het misschien nooit. Misschien wel.',
      },
      'uitspreken': {
        message: 'Je spreekt je uit. Dat vraagt moed.',
        quote: 'De groep wordt stil. Sommigen kijken geïrriteerd. Eén iemand knikt.',
        badge: 'stem-gebruiken',
      },
      'later-prive': {
        message: 'Je kiest voor een veiligere route. Dat is ook iets.',
        quote: 'Maar verandert een privé-berichtje iets aan de groepsdynamiek?',
      },
      'weglopen': {
        message: 'Je trekt een grens. Je hoeft niet overal bij te zijn.',
        quote: 'De groep merkt het. Sommigen vragen later wat er was.',
      },
    },
  },

  // Scene 2.3: Vrijdagmiddag Keuze (KERN)
  {
    id: 'vrijdagmiddag',
    day: 2,
    isCore: true,
    time: '15:30',
    location: 'Thuis',
    intro: 'Het is vrijdagmiddag. Het weekend begint.',
    text: 'Je hebt drie opties:\n\n1. Je ouders willen dit weekend het huis opruimen. Ze vragen of je helpt.\n2. Er is een feestje vanavond. Iedereen gaat.\n3. Je bent moe van de week. Je wilt eigenlijk niks.',
    relevantHabits: ['finish-tasks'],
    timedAlert: {
      delay: 3,
      message: 'Je koos gisteren vooral voor anderen. Wat past vandaag bij jou?',
      type: 'pattern',
      expression: 'supportive',
    },
    choices: [
      {
        id: 'ouders-helpen',
        label: 'Ouders helpen',
        subtext: 'Ik zeg toe dat ik morgen help. Dan heb ik vanavond vrij.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'feestje',
        label: 'Naar het feestje',
        subtext: 'Het is vrijdag. Ik heb het verdiend. Het huis kan wachten.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'thuisblijven',
        label: 'Thuisblijven, niks doen',
        subtext: 'Ik zeg dat ik moe ben en ga vanavond vroeg naar bed.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'alles-beloven',
        label: 'Alles beloven',
        subtext: 'Ik zeg ja tegen mijn ouders EN ja tegen het feestje. Komt wel goed.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -2,
      },
    ],
    bqResponses: {
      'ouders-helpen': {
        message: 'Je plant vooruit. Dat geeft rust.',
        quote: 'Maar vanavond alleen thuis terwijl iedereen op het feestje is...',
      },
      'feestje': {
        message: 'Je kiest voor sociale tijd. Weekends zijn er ook voor.',
        quote: 'Je ouders zijn teleurgesteld maar zeggen niks.',
      },
      'thuisblijven': {
        message: 'Je luistert naar je lichaam, {name}. Rust na een drukke week.',
        quote: 'De FOMO kriebelt een beetje. Maar je bent ook opgelucht.',
        badge: 'fomo-fighter',
        habitMessage: {},
      },
      'alles-beloven': {
        message: 'Je zegt ja tegen alles. Herkenbaar.',
        quote: 'Hoe ga je dit waarmaken?',
      },
    },
  },

  // Scene 2.B: Na School Energie (beweging)
  {
    id: 'na-school-energie',
    day: 2,
    isCore: false,
    time: '16:00',
    location: 'Fietsend naar huis',
    intro: 'Je fietst naar huis. De toets zit erop.',
    text: 'Je voelt de spanning van de week in je schouders.\n\nJe neef stuurt: "Voetballen in het park? Over een uur?"\n\nJe hebt ook nog je sporttas in je kluisje laten liggen. En je was eigenlijk van plan om vanavond uit te rusten.',
    relevantHabits: ['more-exercise', 'take-breaks'],
    choices: [
      {
        id: 'voetballen',
        label: 'Voetballen, spanning kwijtraken',
        subtext: 'Bewegen na een stressweek. Dat is precies wat ik nodig heb.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'thuis-stretchen',
        label: 'Thuis, maar wel stretchen',
        subtext: 'Ik ga niet voetballen, maar doe thuis wat yoga of stretches.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'niks-fysiek',
        label: 'Niks fysiek, gewoon rusten',
        subtext: 'Mijn hoofd is moe. Mijn lichaam kan ook even niks.',
        category: 'rest',
        points: 0,
        bubbleEffect: 0,
      },
      {
        id: 'solo-hardlopen',
        label: 'Hardlopen in je eentje',
        subtext: 'Ik ga even rennen. Alleen. Even mijn hoofd leeg maken.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
    ],
    bqResponses: {
      'voetballen': {
        message: 'Samen bewegen. Sociaal + fysiek in één.',
        habitMessage: {
          'more-exercise': 'Perfect! Dit is je doel in actie.',
        },
      },
      'thuis-stretchen': {
        message: 'Rustige beweging. Je lichaam verzorgen zonder het uit te putten.',
        habitMessage: {
          'more-exercise': 'Lichte beweging telt ook!',
          'take-breaks': 'Yoga als rust - slim.',
        },
      },
      'niks-fysiek': {
        message: 'Volledige rust. Ook dat is een keuze.',
        quote: 'Hoe lang is het geleden dat je bewoog?',
        habitMessage: {
          'more-exercise': 'Rust is oké, maar wordt dit een patroon?',
        },
      },
      'solo-hardlopen': {
        message: 'Solo beweging. Tijd met jezelf.',
        quote: 'Hardlopen kan helpen om gedachten te ordenen.',
        habitMessage: {
          'more-exercise': 'Goed bezig! Beweging op jouw manier.',
        },
      },
    },
  },

  // Scene 2.4: De Avond
  {
    id: 'de-avond',
    day: 2,
    isCore: false,
    time: '22:00',
    location: 'Varieert',
    intro: '',
    text: 'Je ligt op de bank. Je telefoon laat zien wat je mist: stories van het feestje, lachende gezichten, inside jokes waar je niet bij bent.',
    relevantHabits: ['less-phone'],
    choices: [
      {
        id: 'stories-checken',
        label: 'Stories blijven checken',
        subtext: 'Ik kijk wat ze doen. Gewoon even.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -2,
      },
      {
        id: 'telefoon-weg-film',
        label: 'Telefoon weg, film kijken',
        subtext: 'Ik leg mijn telefoon in een andere kamer en kijk een film.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'vroeg-slapen',
        label: 'Vroeg slapen',
        subtext: 'Ik ben moe. Morgen is er ook nog een dag.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
    ],
    bqResponses: {
      'stories-checken': {
        message: 'FOMO is menselijk. Je wilt weten wat je mist.',
        quote: 'Maar maakt kijken het beter of erger?',
        habitMessage: {
          'less-phone': 'Je wilde minder op je telefoon... Dit is lastig.',
        },
      },
      'telefoon-weg-film': {
        message: 'Je beschermt jezelf tegen de vergelijking. Slim.',
        habitMessage: {
          'less-phone': 'Telefoon weg - precies je doel!',
        },
      },
      'vroeg-slapen': {
        message: 'Rust, {name}. Je lichaam wint het van je FOMO.',
        badge: 'fomo-fighter',
        habitMessage: {
          'sleep-on-time': 'Perfect voor je slaap-doel!',
        },
      },
    },
  },

  // ============================================
  // DAG 3: Weekend
  // ============================================

  // Scene 3.1: Weekend Ochtend
  {
    id: 'weekend-ochtend',
    day: 3,
    isCore: false,
    time: '10:30',
    location: 'Bed',
    intro: 'Het is zaterdagochtend. Je bent net wakker.',
    text: 'Je telefoon toont: 127 ongelezen berichten in de groepsapp (recap van gisteravond), 3 Instagram DMs, en een herinnering: "Oma\'s verjaardag - 14:00".\n\nO ja. Je oma wordt 80 vandaag.',
    relevantHabits: ['less-phone', 'sleep-on-time'],
    timedAlert: {
      delay: 4,
      message: 'Hoe begin je het liefst je dag? De berichten gaan nergens heen.',
      type: 'reflection',
      expression: 'curious',
    },
    choices: [
      {
        id: 'eerst-berichten',
        label: 'Eerst berichten checken',
        subtext: 'Ik wil weten wat ik gemist heb. Daarna sta ik op.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'direct-opstaan',
        label: 'Direct opstaan, telefoon later',
        subtext: 'Nee. Eerst douchen en ontbijten. Berichten lopen niet weg.',
        category: 'rest',
        points: 10,
        bubbleEffect: 2,
      },
      {
        id: 'snooze',
        label: 'Snooze-modus: nog even liggen',
        subtext: 'Ik blijf nog even liggen zonder telefoon. Even wakker worden.',
        category: 'rest',
        points: 0,
        bubbleEffect: 0,
      },
    ],
    bqResponses: {
      'eerst-berichten': {
        message: '127 berichten. Dat is veel om te verwerken voor je ogen echt open zijn.',
        quote: '40 minuten later lig je nog in bed.',
        habitMessage: {
          'less-phone': 'Direct op je telefoon... Herkenbaar maar lastig.',
        },
      },
      'direct-opstaan': {
        message: 'Je start de dag zonder scherm. De berichten wachten wel.',
        habitMessage: {
          'less-phone': 'Telefoon kan wachten - goed bezig!',
        },
      },
      'snooze': {
        message: 'Even zijn met je gedachten. Geen input, geen output.',
        quote: 'Hoe vaak gun je jezelf dit?',
      },
    },
  },

  // Scene 3.B: Zondag Ochtend Beweging (beweging)
  {
    id: 'zondag-beweging',
    day: 3,
    isCore: false,
    time: '09:30',
    location: 'Slaapkamer',
    intro: 'Het is zondagochtend. Je wordt wakker en voelt hoe je lichaam ervoor staat.',
    text: 'Je had gisteren een drukke dag bij oma. Vandaag is vrij - maar morgen begint de week weer.\n\nJe sportschema zegt: "Rustdag". Maar je voelt je eigenlijk best energiek.',
    relevantHabits: ['more-exercise', 'take-breaks'],
    choices: [
      {
        id: 'toch-bewegen',
        label: 'Toch bewegen - lichte workout',
        subtext: 'Ik voel me goed. Een wandeling of lichte yoga kan geen kwaad.',
        category: 'rest',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'rustdag-respecteren',
        label: 'Rustdag respecteren',
        subtext: 'Het schema zegt rust. Mijn lichaam heeft herstel nodig.',
        category: 'rest',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'intensief',
        label: 'Iets uitdagends doen',
        subtext: 'Ik heb zin in iets intensiefs. Een goede workout om de week te starten.',
        category: 'rest',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'plannen-later',
        label: 'Plannen voor later',
        subtext: 'Ik beslis straks wel. Eerst even wakker worden.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
    ],
    bqResponses: {
      'toch-bewegen': {
        message: 'Actieve rust. Je luistert naar je lichaam én je energie.',
        quote: 'Lichte beweging kan helpen zonder te overbelasten.',
        habitMessage: {
          'more-exercise': 'Goed! Luisteren naar je lichaam.',
        },
      },
      'rustdag-respecteren': {
        message: 'Je respecteert je herstel. Dat is ook discipline, {name}.',
        quote: 'Rust is onderdeel van progressie.',
        badge: 'lichaam-luisteraar',
        habitMessage: {
          'more-exercise': 'Rust is deel van bewegen!',
          'take-breaks': 'Perfect - herstel is essentieel.',
        },
      },
      'intensief': {
        message: 'Je energie is hoog. Maar is dat adrenaline of echt herstel?',
        quote: 'Soms voelt het lichaam beter dan het is.',
        habitMessage: {
          'more-exercise': 'Enthousiasme is goed, maar let op overtraining.',
        },
      },
      'plannen-later': {
        message: 'Uitstellen. Herkenbaar patroon?',
        quote: 'Beslissingen worden niet makkelijker door te wachten.',
      },
    },
  },

  // Scene 3.2: Oma's Verjaardag (KERN)
  {
    id: 'oma-verjaardag',
    day: 3,
    isCore: true,
    time: '14:00',
    location: 'Bij oma',
    intro: 'Je bent bij oma. De hele familie is er.',
    text: 'Ooms, tantes, neven, nichten.\n\nOma is blij je te zien. Ze vraagt naar school, naar je vrienden, naar "die dingen op je telefoon".\n\nHet gesprek gaat moeizaam. Je neef van 12 zit naast je, ook op zijn telefoon.',
    relevantHabits: ['less-phone'],
    choices: [
      {
        id: 'telefoon-zak',
        label: 'Telefoon in je zak houden',
        subtext: 'Ik probeer aanwezig te zijn. Dit is oma\'s dag.',
        category: 'social',
        points: 15,
        bubbleEffect: 2,
      },
      {
        id: 'af-en-toe',
        label: 'Af en toe checken',
        subtext: 'Ik check af en toe even. Oma merkt het niet.',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'met-neef',
        label: 'Met je neef samen op telefoon',
        subtext: 'Ik ga naast mijn neef zitten. Dan zijn we samen "afwezig".',
        category: 'scroll',
        points: 0,
        bubbleEffect: -1,
      },
      {
        id: 'oma-vragen',
        label: 'Oma vragen over vroeger',
        subtext: 'Ik vraag oma iets over haar leven. Misschien heeft ze verhalen.',
        category: 'social',
        points: 15,
        bubbleEffect: 2,
      },
    ],
    bqResponses: {
      'telefoon-zak': {
        message: 'Je bent er, {name}. Fysiek én mentaal.',
        quote: 'Het is soms saai. Maar oma glimlacht als ze je ziet.',
        habitMessage: {
          'less-phone': 'Telefoon weg bij familie - goed bezig!',
        },
      },
      'af-en-toe': {
        message: 'Je balanceert aanwezigheid en verbondenheid online.',
        quote: 'Oma merkt het misschien niet. Je moeder wel.',
        habitMessage: {
          'less-phone': 'Je wilde minder op je telefoon...',
        },
      },
      'met-neef': {
        message: 'Samen zijn kan ook naast elkaar zitten zonder te praten.',
        quote: 'Je neef is blij. Oma kijkt jullie kant op.',
      },
      'oma-vragen': {
        message: 'Je toont interesse. Dat is een cadeau op zich.',
        quote: 'Oma\'s ogen lichten op. Ze begint te vertellen over 1965...',
        badge: 'generatie-verbinder',
      },
    },
  },

  // Scene 3.3: De Zondag Vraag
  {
    id: 'zondag-vraag',
    day: 3,
    isCore: false,
    time: '20:00',
    location: 'Thuis',
    intro: 'Je bent thuis van oma. Morgen is zondag - laatste dag voor de schoolweek weer begint.',
    text: 'Je hebt een project dat maandag af moet. Je bent voor 60% klaar. Het is haalbaar, maar je moet er wel aan werken.\n\nJe vrienden appen: "Morgen naar het strand? Laatste mooie dag van het jaar!"',
    relevantHabits: ['finish-tasks'],
    choices: [
      {
        id: 'project-afmaken',
        label: 'Project afmaken, strand skippen',
        subtext: 'Ik maak morgen het project af. Dan heb ik rust in mijn hoofd.',
        category: 'work',
        points: 10,
        bubbleEffect: 0,
      },
      {
        id: 'strand-avond',
        label: 'Naar het strand, project \'s avonds',
        subtext: 'Ik ga naar het strand. \'s Avonds werk ik door.',
        category: 'social',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'ochtend-middag',
        label: 'Ochtend project, middag strand',
        subtext: 'Ik doe \'s ochtends het project, dan ga ik \'s middags.',
        category: 'work',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'morgen-beslissen',
        label: 'Weet ik morgen wel',
        subtext: 'Ik beslis morgen wel. Nu hoef ik nog niet te kiezen.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
    ],
    bqResponses: {
      'project-afmaken': {
        message: 'Je kiest voor zekerheid. Het project is maandag echt af.',
        quote: 'Je vrienden gaan zonder jou. Ze sturen foto\'s.',
        habitMessage: {
          'finish-tasks': 'Dit past bij je doel!',
        },
      },
      'strand-avond': {
        message: 'Je vertrouwt erop dat je \'s avonds nog energie hebt.',
        quote: 'Na een dag strand? We zullen zien.',
      },
      'ochtend-middag': {
        message: 'Je probeert beide te doen. Dat kan, als je discipline hebt.',
        quote: 'Sta je op tijd op morgen?',
        habitMessage: {
          'finish-tasks': 'Slimme aanpak voor je doel.',
        },
      },
      'morgen-beslissen': {
        message: 'Uitstellen van de beslissing. Ook dat is een patroon.',
        quote: 'Morgen ben je dezelfde persoon met dezelfde keuze.',
      },
    },
  },

  // Scene 3.4: Reflectie (KERN)
  {
    id: 'reflectie',
    day: 3,
    isCore: true,
    time: '21:30',
    location: 'Slaapkamer',
    intro: 'Zondagavond. Het weekend is voorbij.',
    text: 'Je ligt in bed. Balance Quest vraagt:\n\n"Hoe was dit weekend voor je balans?"',
    choices: [
      {
        id: 'goed',
        label: '😊 Goed, ik heb gedaan wat ik wilde',
        subtext: 'Ik heb bewuste keuzes gemaakt.',
        category: 'neutral',
        points: 10,
        bubbleEffect: 1,
      },
      {
        id: 'gemengd',
        label: '🤔 Gemengd, sommige dingen had ik anders gedaan',
        subtext: 'Niet perfect, maar ook niet slecht.',
        category: 'neutral',
        points: 5,
        bubbleEffect: 0,
      },
      {
        id: 'mwah',
        label: '😩 Mwah, ik liep weer achter de feiten aan',
        subtext: 'Ik reageerde vooral, in plaats van te kiezen.',
        category: 'neutral',
        points: 0,
        bubbleEffect: -1,
      },
    ],
    bqResponses: {
      'goed': {
        message: 'Bewust kiezen voelt goed, {name}. Onthoud dat gevoel.',
      },
      'gemengd': {
        message: 'Gemengd is menselijk. Perfecte weekenden bestaan niet.',
        quote: 'Wat zou je volgende week anders doen?',
      },
      'mwah': {
        message: 'Herken je dat patroon? Reageren in plaats van kiezen?',
        quote: 'Eén bewuste keuze per dag kan al verschil maken.',
      },
    },
  },
]

// Get scenes for a specific day
export function getScenesForDay(day: 1 | 2 | 3): Scene[] {
  return SCENES.filter(scene => scene.day === day)
}

// Get all core scenes
export function getCoreScenes(): Scene[] {
  return SCENES.filter(scene => scene.isCore)
}
