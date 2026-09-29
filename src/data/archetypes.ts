import type { Archetype, Trait } from '@/types';

/**
 * The 12 DNA archetypes from the "Dna Portrait Images" frame in Figma.
 * `target` is the trait profile (0–100) an archetype represents; the user's
 * scores are matched to the closest target.
 */
export const archetypes: Archetype[] = [
  {
    id: 1,
    code: 'COLD_STRATEGIST',
    nameTr: 'Soğukkanlı Stratejist',
    nameEn: 'Cold Strategist',
    quote: 'You see the board, not the pieces — and you never move first without a plan.',
    description: 'Calm under fire, you trade emotion for calculation and keep every option open.',
    target: { vision: 75, courage: 55, risk: 40, control: 90, empathy: 30, ethics: 55 },
    portrait: require('../../assets/portraits/01-cold-strategist.png'),
  },
  {
    id: 2,
    code: 'CAUTIOUS_INNOVATOR',
    nameTr: 'Temkinli Yenilikçi',
    nameEn: 'Cautious Innovator',
    quote: 'You believe in the new — once you have tested it twice.',
    description: 'You push the future forward, but you protect the present while doing it.',
    target: { vision: 85, courage: 40, risk: 25, control: 70, empathy: 55, ethics: 65 },
    portrait: require('../../assets/portraits/02-cautious-innovator.png'),
  },
  {
    id: 3,
    code: 'BOLD_VISIONARY',
    nameTr: 'Cesur Vizyoner',
    nameEn: 'Bold Visionary',
    quote: 'You see the big picture and walk towards it — no matter the cost.',
    description: 'Ethics sometimes take a back seat, but few surpass you in the courage to take action.',
    target: { vision: 90, courage: 90, risk: 70, control: 50, empathy: 45, ethics: 35 },
    portrait: require('../../assets/portraits/03-bold-visionary.png'),
  },
  {
    id: 4,
    code: 'EMPATHETIC_LEADER',
    nameTr: 'Empatik Lider',
    nameEn: 'Empathetic Leader',
    quote: 'Behind every decision you see faces, not numbers.',
    description: 'People follow you because they feel protected — even when the path is hard.',
    target: { vision: 60, courage: 55, risk: 35, control: 55, empathy: 90, ethics: 75 },
    portrait: require('../../assets/portraits/04-empathetic-leader.png'),
    altPortraits: [require('../../assets/portraits/04-empathetic-leader-alt.png')],
  },
  {
    id: 5,
    code: 'PRAGMATIC_TACTICIAN',
    nameTr: 'Pragmatik Taktisyen',
    nameEn: 'Pragmatic Tactician',
    quote: 'What works today matters more than what looks right tomorrow.',
    description: 'Flexible and fast, you adapt the plan to the battlefield instead of the other way round.',
    target: { vision: 55, courage: 60, risk: 50, control: 75, empathy: 45, ethics: 45 },
    portrait: require('../../assets/portraits/05-pragmatic-tactician.png'),
    altPortraits: [require('../../assets/portraits/05-pragmatic-tactician-alt.png'), require('../../assets/portraits/05-pragmatic-tactician-alt2.png')],
  },
  {
    id: 6,
    code: 'PRINCIPLED_RESISTER',
    nameTr: 'İlkeli Direnişçi',
    nameEn: 'Principled Resister',
    quote: 'Some lines you will not cross — whoever is giving the order.',
    description: 'Your conscience is your compass. You will pay the price to stay true to it.',
    target: { vision: 55, courage: 75, risk: 45, control: 40, empathy: 65, ethics: 95 },
    portrait: require('../../assets/portraits/06-principled-resister.png'),
    altPortraits: [require('../../assets/portraits/06-principled-resister-alt.png')],
  },
  {
    id: 7,
    code: 'CRISIS_MANAGER',
    nameTr: 'Kriz Yöneticisi',
    nameEn: 'Crisis Manager',
    quote: 'When everything is on fire, you are the one holding the map.',
    description: 'You bring order to chaos and keep people moving in the same direction.',
    target: { vision: 60, courage: 70, risk: 45, control: 85, empathy: 60, ethics: 60 },
    portrait: require('../../assets/portraits/07-crisis-manager.png'),
  },
  {
    id: 8,
    code: 'RECKLESS_BRAWLER',
    nameTr: 'Bodozlama Dalaşan',
    nameEn: 'Reckless Brawler',
    quote: 'Act first, think later — hesitation is the only real defeat.',
    description: 'Your speed is terrifying for rivals, and sometimes for your allies too.',
    target: { vision: 30, courage: 90, risk: 95, control: 25, empathy: 25, ethics: 35 },
    portrait: require('../../assets/portraits/08-reckless-brawler.png'),
  },
  {
    id: 9,
    code: 'CHARISMATIC_MANIPULATOR',
    nameTr: 'Karizmatik Manipülatör',
    nameEn: 'Charismatic Manipulator',
    quote: 'You win rooms, then you win the game.',
    description: 'You read people perfectly — and you know exactly which strings to pull.',
    target: { vision: 70, courage: 65, risk: 60, control: 70, empathy: 30, ethics: 15 },
    portrait: require('../../assets/portraits/09-charismatic-manipulator.png'),
  },
  {
    id: 10,
    code: 'OVER_ANALYST',
    nameTr: 'Aşırı Analist',
    nameEn: 'Over-Analyst',
    quote: 'One more report and you will be sure. Probably.',
    description: 'Your decisions are rarely wrong — but they are often late.',
    target: { vision: 70, courage: 25, risk: 15, control: 85, empathy: 50, ethics: 60 },
    portrait: require('../../assets/portraits/10-over-analyst.png'),
  },
  {
    id: 11,
    code: 'SELFLESS_PROTECTOR',
    nameTr: 'Fedakar Koruyucu',
    nameEn: 'Selfless Protector',
    quote: 'If someone has to take the hit, it will be you.',
    description: 'You put others before yourself, even when it costs you your position.',
    target: { vision: 40, courage: 70, risk: 40, control: 50, empathy: 95, ethics: 85 },
    portrait: require('../../assets/portraits/11-selfless-protector.png'),
  },
  {
    id: 12,
    code: 'CONFORMIST',
    nameTr: 'Uyumcu',
    nameEn: 'Conformist',
    quote: 'Keeping the peace is a decision too.',
    description: 'You avoid conflict and follow the consensus — stability is your strength and your trap.',
    target: { vision: 35, courage: 30, risk: 20, control: 55, empathy: 70, ethics: 60 },
    portrait: require('../../assets/portraits/12-conformist.png'),
  },
];

export const traitLabels: Record<Trait, string> = {
  vision: 'Vision',
  courage: 'Courage',
  risk: 'Risk',
  control: 'Control',
  empathy: 'Empathy',
  ethics: 'Ethics',
};

/** Blind-spot copy for the weakest trait. */
export const blindSpots: Record<Trait, { question: string; text: string }> = {
  vision: {
    question: 'Can you see past the next move?',
    text: 'You solve the problem in front of you brilliantly, but the long-term picture often stays blurry.',
  },
  courage: {
    question: 'What if waiting is the riskiest move?',
    text: 'You prefer safe ground. In crises, the moment to act can pass while you are still weighing options.',
  },
  risk: {
    question: 'What do you lose by never gambling?',
    text: 'You protect what you have so well that big opportunities rarely get a chance.',
  },
  control: {
    question: 'Who is steering when things speed up?',
    text: 'Under pressure your plans drift. Others may fill the vacuum you leave behind.',
  },
  empathy: {
    question: 'Who pays for your decisions?',
    text: 'You reach your goals, but the people around you do not always feel seen along the way.',
  },
  ethics: {
    question: 'How much will you pay to win?',
    text: 'Your vision and courage are strong — but your ethics score is your lowest dimension. While reaching big goals, you often overlook those around you and what they sacrifice.',
  },
};
