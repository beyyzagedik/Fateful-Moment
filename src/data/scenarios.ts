import type { Scenario } from '@/types';

/**
 * Dummy scenario content. Each option carries a hidden trait impact that
 * feeds the DNA profile. Scenarios with a `video` play it as the intro;
 * the rest fall back to the cinematic `scenes`.
 */
export const scenarios: Scenario[] = [
  // ─── History & War ───────────────────────────────────────────────
  {
    id: 'iraq-war',
    categoryId: 'history-war',
    title: 'Iraq War',
    year: 2003,
    teaser: '2003. The Chemical Weapon Allegations Are On Your Desk. Your Decision Will Determine The Fate Of Millions.',
    role: 'You are the President of the United States.',
    durationLabel: '1:37 min',
    tint: ['#1B2A4A', '#05080F'],
    cover: require('../../assets/images/white-house-night.png'),
    video: require('../../assets/videos/iraq-war-intro.mp4'),
    decisionBackdrop: require('../../assets/images/iraq-decision-map.png'),
    available: true,
    scenes: [
      { caption: 'Washington, February 2003. The White House is lit late into the night.', durationMs: 4500, tint: ['#1B2A4A', '#05080F'] },
      { caption: 'At the UN Security Council, satellite photos are presented as proof of mobile weapons labs.', durationMs: 5000, tint: ['#2B2F3A', '#0A0C12'] },
      { caption: 'Your own analysts are divided. Some sources are unverified. The allies are split.', durationMs: 5000, tint: ['#3A2A1A', '#0D0906'] },
      { caption: 'Troops are already massing in the desert. The timeline is set. Every hour costs millions.', durationMs: 5000, tint: ['#4A3515', '#120C05'] },
      { caption: 'Millions protest across the world. The decision is yours.', durationMs: 4000, tint: ['#3A1A1A', '#0E0606'] },
    ],
    decisions: [
      {
        id: 'iraq-1',
        prompt: 'The evidence is thin, the pressure is enormous. What is your call?',
        timeLimitSec: 15,
        options: [
          {
            id: 'invade',
            label: 'Launch The Invasion With The Coalition',
            impact: { courage: 8, risk: 10, ethics: -6, empathy: -4 },
            outcome: 'Baghdad falls in three weeks. No weapons are found. The region enters a decade of instability.',
          },
          {
            id: 'inspectors',
            label: 'Give UN Inspectors More Time',
            impact: { ethics: 8, control: 4, empathy: 4, courage: -2 },
            outcome: 'Inspections continue. Allies regroup. Your approval rating drops, but no shot is fired.',
          },
          {
            id: 'timeline',
            label: 'Zaman Baskısına Uyum: Siyasi ve medya baskısı nedeniyle risklere rağmen belirlenen takvimde fırlatmayı başlat.',
            impact: { control: 4, ethics: -8, empathy: -2, risk: 4 },
            outcome: 'The operation starts on schedule. Doubts inside your cabinet are silenced — for now.',
          },
          {
            id: 'leak',
            label: 'Make The Intelligence Doubts Public',
            impact: { ethics: 6, courage: 6, control: -8, risk: 4 },
            outcome: 'The press erupts. Your coalition fractures, but the public finally sees the full picture.',
          },
        ],
      },
      {
        id: 'iraq-2',
        prompt: 'The regime has collapsed. What happens to the Iraqi army?',
        timeLimitSec: 12,
        options: [
          {
            id: 'disband',
            label: 'Disband The Army And The Ruling Party',
            impact: { courage: 4, risk: 8, vision: -4, empathy: -6 },
            outcome: '400,000 armed men lose their jobs overnight. An insurgency begins.',
          },
          {
            id: 'vet',
            label: 'Keep The Structures, Vet The Leaders',
            impact: { vision: 8, control: 6, empathy: 4 },
            outcome: 'Order holds in most provinces. Reconstruction is slow, but it starts.',
          },
          {
            id: 'un-handover',
            label: 'Hand Authority To The UN Quickly',
            impact: { ethics: 6, empathy: 4, control: -6 },
            outcome: 'International legitimacy rises while your influence on the ground fades.',
          },
          {
            id: 'withdraw',
            label: 'Declare Victory And Withdraw',
            impact: { risk: 4, control: -4, ethics: -4 },
            outcome: 'Troops come home to parades. A power vacuum opens behind them.',
          },
        ],
      },
    ],
  },
  {
    id: 'cuban-missile-crisis',
    categoryId: 'history-war',
    title: 'Cuban Missile Crisis (1962)',
    year: 1962,
    teaser: "A World On The Brink Of Nuclear Annihilation. You Are In Kennedy's Seat.",
    role: 'You are President John F. Kennedy.',
    durationLabel: '1:25 min',
    tint: ['#14324A', '#04090F'],
    cover: require('../../assets/images/white-house-night.png'),
    available: true,
    scenes: [
      { caption: 'October 16, 1962. U-2 photographs reveal Soviet nuclear missiles in Cuba.', durationMs: 4500, tint: ['#14324A', '#04090F'] },
      { caption: 'They can reach Washington in minutes. Soviet ships are already on their way.', durationMs: 4500, tint: ['#1F2A44', '#070A12'] },
      { caption: 'Your generals want an immediate air strike. Your advisers fear it means nuclear war.', durationMs: 5000, tint: ['#2A1F1F', '#0B0707'] },
      { caption: 'Beneath the waves, a Soviet submarine carries a nuclear torpedo. Its captain has lost contact with Moscow.', durationMs: 5000, tint: ['#0E2A33', '#03090B'] },
    ],
    decisions: [
      {
        id: 'cuba-1',
        prompt: 'The missiles will be operational within days. How do you respond?',
        timeLimitSec: 15,
        options: [
          {
            id: 'airstrike',
            label: 'Order Air Strikes On The Missile Sites',
            impact: { courage: 8, risk: 10, control: 2, empathy: -6, ethics: -4 },
            outcome: 'Most sites are hit, but not all. Moscow places its forces on full alert.',
          },
          {
            id: 'quarantine',
            label: "Deniz Karantinası: Küba'yı kuşatıp Sovyet gemilerini engelleyerek gizli pazarlık yürütmek.",
            impact: { vision: 8, control: 6, empathy: 4, ethics: 4, risk: -2 },
            outcome: 'The Navy forms a blockade line. Soviet ships slow down. The world holds its breath.',
          },
          {
            id: 'un',
            label: 'Expose The Missiles At The UN',
            impact: { ethics: 6, courage: 4, vision: 2, control: -2 },
            outcome: 'The photos stun the Security Council. Moscow is cornered in front of the world.',
          },
          {
            id: 'wait',
            label: 'Wait For A Signal From Moscow',
            impact: { control: -6, courage: -6, risk: -4, empathy: 2 },
            outcome: 'Days pass. The missiles become operational. Your options narrow.',
          },
        ],
      },
      {
        id: 'cuba-2',
        prompt: 'A U-2 was shot down. Khrushchev offers a deal: Turkish missiles for Cuban ones.',
        timeLimitSec: 12,
        options: [
          {
            id: 'secret-deal',
            label: 'Accept The Trade — In Secret',
            impact: { vision: 6, empathy: 4, control: 4, ethics: -2 },
            outcome: 'The missiles leave Cuba. Nobody learns about Turkey for decades.',
          },
          {
            id: 'retaliate',
            label: 'Reject The Deal And Retaliate',
            impact: { courage: 8, risk: 10, empathy: -6 },
            outcome: 'The strike order is signed. Somewhere, a submarine captain reaches for the launch key.',
          },
          {
            id: 'public-deal',
            label: 'Accept The Trade Publicly',
            impact: { ethics: 8, courage: 2, control: -4 },
            outcome: 'Peace holds, but NATO allies feel betrayed and your rivals call it weakness.',
          },
          {
            id: 'first-letter',
            label: 'Ignore The Offer, Answer His First Letter',
            impact: { vision: 8, control: 6, risk: 2 },
            outcome: 'A bold diplomatic gamble. Khrushchev accepts the softer terms.',
          },
        ],
      },
    ],
  },

  // ─── Business World ──────────────────────────────────────────────
  {
    id: 'digital-camera',
    categoryId: 'business',
    title: 'The Digital Camera',
    year: 1975,
    teaser: 'Your Engineer Just Invented The Digital Camera. It Could Destroy Your Film Empire.',
    role: 'You are the CEO of the world’s largest film company.',
    durationLabel: '0:58 min',
    tint: ['#2D3748', '#0A0E16'],
    available: true,
    scenes: [
      { caption: 'Rochester, 1975. A young engineer shows you a toaster-sized box that takes pictures without film.', durationMs: 5000, tint: ['#2D3748', '#0A0E16'] },
      { caption: 'Film makes 70% of your profit. This prototype could make it obsolete.', durationMs: 4500, tint: ['#3A3320', '#0E0C06'] },
      { caption: 'The board is waiting for your answer.', durationMs: 3500, tint: ['#1F2937', '#07090D'] },
    ],
    decisions: [
      {
        id: 'camera-1',
        prompt: 'What do you do with the invention?',
        timeLimitSec: 15,
        options: [
          { id: 'bury', label: 'Shelve It To Protect Film Revenue', impact: { control: 6, vision: -8, risk: -6 }, outcome: 'Profits stay high for twenty years. Then the market vanishes in five.' },
          { id: 'invest', label: 'Invest Heavily — Disrupt Yourself', impact: { vision: 10, courage: 8, risk: 6 }, outcome: 'Shareholders revolt, but you own the future of photography.' },
          { id: 'license', label: 'Patent It And License It Quietly', impact: { control: 4, vision: 4, ethics: 2 }, outcome: 'Royalties roll in while competitors build the products.' },
          { id: 'spinoff', label: 'Spin Off An Independent Startup', impact: { vision: 6, risk: 4, empathy: 2 }, outcome: 'A small team moves fast, free from the film division’s politics.' },
        ],
      },
    ],
  },
  {
    id: 'crash-2008',
    categoryId: 'business',
    title: 'The 2008 Crash',
    year: 2008,
    teaser: 'The Markets Collapsed Overnight. Cut 30% Of Your People Or Risk Everything.',
    role: 'You are the founder of a 2,000-person company.',
    durationLabel: '0:52 min',
    tint: ['#1E3A5F', '#060B14'],
    available: true,
    scenes: [
      { caption: 'September 2008. Lehman Brothers has collapsed. Your credit line was frozen this morning.', durationMs: 5000, tint: ['#1E3A5F', '#060B14'] },
      { caption: 'You have cash for four months. Two thousand families depend on this company.', durationMs: 4500, tint: ['#2B2B3A', '#08080C'] },
    ],
    decisions: [
      {
        id: 'crash-1',
        prompt: 'The board meets in an hour. What is your plan?',
        timeLimitSec: 15,
        options: [
          { id: 'layoffs', label: 'Lay Off 30% Of Staff Immediately', impact: { control: 8, empathy: -8, risk: -2 }, outcome: 'The company survives. Morale does not.' },
          { id: 'paycut', label: 'Cut Everyone’s Pay — Starting With Yours', impact: { empathy: 8, ethics: 6, courage: 4 }, outcome: 'Nobody is fired. The team rallies behind you.' },
          { id: 'borrow', label: 'Borrow At Any Cost And Keep Everyone', impact: { risk: 10, empathy: 6, control: -4 }, outcome: 'You buy time with expensive debt. The bet has to pay off.' },
          { id: 'hide', label: 'Hide The Real Numbers From The Board', impact: { ethics: -10, control: 4, risk: 6 }, outcome: 'Calm returns for a quarter — until the auditors arrive.' },
        ],
      },
    ],
  },
  comingSoon('dotcom-bubble', 'business', 'The Dot-Com Bubble', 2000),
  comingSoon('boardroom-coup', 'business', 'The Boardroom Coup', 1985),

  // ─── Crisis & Security ───────────────────────────────────────────
  {
    id: 'chernobyl',
    categoryId: 'crisis-security',
    title: 'Chernobyl',
    year: 1986,
    teaser: 'Reactor 4 Has Exploded. Moscow Orders Silence. 50,000 People Live Next Door.',
    role: 'You are the regional party chief.',
    durationLabel: '1:04 min',
    tint: ['#2F3B22', '#090C06'],
    available: true,
    scenes: [
      { caption: 'April 26, 1986, 1:23 a.m. An explosion tears through Reactor 4.', durationMs: 4500, tint: ['#3B2A12', '#0E0904'] },
      { caption: 'Engineers report radiation levels off the scale. Officials call it “a minor fire”.', durationMs: 5000, tint: ['#2F3B22', '#090C06'] },
      { caption: 'Children are playing outside in Pripyat. Moscow wants no panic.', durationMs: 4500, tint: ['#23303A', '#070A0D'] },
    ],
    decisions: [
      {
        id: 'chernobyl-1',
        prompt: 'The official order is to wait. What do you do?',
        timeLimitSec: 15,
        options: [
          { id: 'evacuate', label: 'Evacuate Pripyat Immediately', impact: { ethics: 8, empathy: 8, courage: 6, control: -2 }, outcome: 'Buses roll in by noon. You will answer to Moscow — but people live.' },
          { id: 'obey', label: 'Follow Orders And Keep Quiet', impact: { control: 6, ethics: -8, empathy: -6 }, outcome: 'The city sleeps one more night under the radioactive cloud.' },
          { id: 'children', label: 'Quietly Move The Children First', impact: { empathy: 6, control: 4, ethics: 2 }, outcome: 'A “school trip” saves thousands of children without a public alarm.' },
          { id: 'alert-west', label: 'Alert Neighbouring Countries Yourself', impact: { courage: 8, ethics: 6, risk: 8, control: -6 }, outcome: 'Sweden confirms the cloud. The cover-up collapses — and so may your career.' },
        ],
      },
    ],
  },
  comingSoon('cyber-blackout', 'crisis-security', 'Grid Blackout', 2021),
  comingSoon('hostage-embassy', 'crisis-security', 'Embassy Siege', 1979),

  // ─── Science ─────────────────────────────────────────────────────
  {
    id: 'apollo-13',
    categoryId: 'science',
    title: 'Apollo 13',
    year: 1970,
    teaser: '“Houston, We’ve Had A Problem.” Three Astronauts, 200,000 Miles From Home.',
    role: 'You are the NASA flight director.',
    durationLabel: '1:10 min',
    tint: ['#1A1F4A', '#05061A'],
    available: true,
    scenes: [
      { caption: 'April 13, 1970. An oxygen tank explodes aboard Apollo 13.', durationMs: 4500, tint: ['#1A1F4A', '#05061A'] },
      { caption: 'Power is failing. The crew has hours of breathable air, not days.', durationMs: 4500, tint: ['#2A1A3A', '#08050E'] },
      { caption: 'Every engineer in Mission Control is looking at you.', durationMs: 3500, tint: ['#1B2B3A', '#06090D'] },
    ],
    decisions: [
      {
        id: 'apollo-1',
        prompt: 'How do you bring them home?',
        timeLimitSec: 15,
        options: [
          { id: 'slingshot', label: 'Slingshot Around The Moon', impact: { vision: 8, risk: 6, control: 4 }, outcome: 'A longer path, but the Moon’s gravity does the work your engine can’t.' },
          { id: 'direct-abort', label: 'Turn Around Now With The Main Engine', impact: { courage: 6, risk: 10, control: -4 }, outcome: 'If the damaged engine fires, they are home fast. If not…' },
          { id: 'telemetry', label: 'Wait For More Telemetry', impact: { control: 6, courage: -6 }, outcome: 'The data gets clearer while the oxygen gets lower.' },
          { id: 'crew-decides', label: 'Let The Crew Make The Call', impact: { empathy: 8, control: -6, ethics: 4 }, outcome: 'The astronauts appreciate the trust, and choose the safer path.' },
        ],
      },
    ],
  },
  comingSoon('crispr-baby', 'science', 'The CRISPR Babies', 2018),
  comingSoon('manhattan', 'science', 'The Manhattan Project', 1945),
  comingSoon('pandemic-vaccine', 'science', 'Vaccine Race', 2020),
];

function comingSoon(id: string, categoryId: string, title: string, year: number): Scenario {
  return {
    id,
    categoryId,
    title,
    year,
    teaser: 'This fateful moment is still being written.',
    role: '',
    durationLabel: 'Soon',
    tint: ['#1A2238', '#070B16'],
    available: false,
    scenes: [],
    decisions: [],
  };
}

export const getScenario = (id: string) => scenarios.find((s) => s.id === id);
export const scenariosByCategory = (categoryId: string) =>
  scenarios.filter((s) => s.categoryId === categoryId);
