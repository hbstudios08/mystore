import { CellSalt } from '../types';

export const CELL_SALTS: CellSalt[] = [
  {
    id: 'kali-phos',
    chemicalName: 'Potassium Phosphate',
    commonName: 'Kali Phos',
    abbreviation: 'Kali Phos.',
    zodiacId: 'aries',
    bodySystem: ['Nervous System', 'Brain'],
    rulingBodyPart: 'Brain & Nerves',
    indications: [
      'Mental exhaustion',
      'Anxiety and nervousness',
      'Insomnia from overwork',
      'Irritability',
      'Nerve pain',
    ],
    deficiencySymptoms: [
      'Fatigue after mental effort',
      'Difficulty concentrating',
      'Low mood',
      'Sensitivity to noise or light',
    ],
    dietarySources: ['Whole grains', 'Leafy greens', 'Tomatoes', 'Walnuts', 'Cauliflower'],
    description:
      'Known as the "nerve nutrient," Kali Phos supports the nervous system and is often associated with mental fatigue, stress, and anxious states.',
    color: '#C0392B',
  },
  {
    id: 'nat-sulph',
    chemicalName: 'Sodium Sulphate',
    commonName: 'Nat Sulph',
    abbreviation: 'Nat Sulph.',
    zodiacId: 'taurus',
    bodySystem: ['Liver', 'Digestive System'],
    rulingBodyPart: 'Liver & Fluids',
    indications: [
      'Sluggish digestion',
      'Fluid retention',
      'Biliousness',
      'Headaches with nausea',
      'Damp, humid-weather ailments',
    ],
    deficiencySymptoms: [
      'Bloating',
      'Feeling of heaviness',
      'Excess fluid buildup',
      'Sluggish elimination',
    ],
    dietarySources: ['Almonds', 'Cabbage', 'Spinach', 'Beets', 'Onions'],
    description:
      'Supports liver function and helps the body regulate excess fluid, often linked to grounded, earthy Taurus energy.',
    color: '#27AE60',
  },
  {
    id: 'kali-mur',
    chemicalName: 'Potassium Chloride',
    commonName: 'Kali Mur',
    abbreviation: 'Kali Mur.',
    zodiacId: 'gemini',
    bodySystem: ['Respiratory System'],
    rulingBodyPart: 'Mucous Membranes',
    indications: [
      'Congestion',
      'Colds with thick white discharge',
      'Swollen glands',
      'Ear congestion',
      'Sluggish lymphatic flow',
    ],
    deficiencySymptoms: [
      'Chronic stuffiness',
      'White-coated tongue',
      'Glandular swelling',
    ],
    dietarySources: ['Broccoli', 'Carrots', 'Egg yolk', 'Beans', 'Whole grains'],
    description:
      'The classic "cell salt of the mucous membranes," supporting respiratory clarity — fitting for airy, communicative Gemini.',
    color: '#F1C40F',
  },
  {
    id: 'calc-fluor',
    chemicalName: 'Calcium Fluoride',
    commonName: 'Calc Fluor',
    abbreviation: 'Calc Fluor.',
    zodiacId: 'cancer',
    bodySystem: ['Connective Tissue', 'Skin', 'Teeth'],
    rulingBodyPart: 'Elastic Tissue',
    indications: [
      'Loss of tissue elasticity',
      'Joint weakness',
      'Cracked skin',
      'Weak tooth enamel',
      'Varicose-type tension',
    ],
    deficiencySymptoms: [
      'Stiffness',
      'Poor skin tone',
      'Brittle nails',
      'Sagging tissue',
    ],
    dietarySources: ['Yogurt', 'Cheese', 'Cabbage', 'Oats', 'Egg yolk'],
    description:
      'Supports the elasticity of tissues, skin, and enamel — echoing protective, home-and-body-conscious Cancer.',
    color: '#5DADE2',
  },
  {
    id: 'mag-phos',
    chemicalName: 'Magnesium Phosphate',
    commonName: 'Mag Phos',
    abbreviation: 'Mag Phos.',
    zodiacId: 'leo',
    bodySystem: ['Muscular System', 'Nervous System'],
    rulingBodyPart: 'Muscles & Nerves',
    indications: [
      'Muscle cramps',
      'Spasms',
      'Sharp, shooting nerve pain',
      'Menstrual cramping',
      'Twitching',
    ],
    deficiencySymptoms: [
      'Cramping that improves with warmth and pressure',
      'Restlessness',
      'Colicky pain',
    ],
    dietarySources: ['Almonds', 'Whole wheat', 'Figs', 'Dark leafy greens', 'Cashews'],
    description:
      'Known as "nature\'s antispasmodic," relieving cramping and spasm — matching bold, high-energy Leo.',
    color: '#F39C12',
  },
  {
    id: 'kali-sulph',
    chemicalName: 'Potassium Sulphate',
    commonName: 'Kali Sulph',
    abbreviation: 'Kali Sulph.',
    zodiacId: 'virgo',
    bodySystem: ['Skin', 'Respiratory System'],
    rulingBodyPart: 'Skin & Cell Oxygenation',
    indications: [
      'Skin flaking or peeling',
      'Yellow, sticky discharge',
      'Late-stage cold symptoms',
      'Dull complexion',
    ],
    deficiencySymptoms: [
      'Dry or scaly skin',
      'Sluggish cellular oxygen exchange',
      'Chronic catarrh',
    ],
    dietarySources: ['Whole grains', 'Sunflower seeds', 'Tomatoes', 'Cucumbers'],
    description:
      'Supports oxygen distribution to skin cells, aligned with detail-oriented, health-conscious Virgo.',
    color: '#8E44AD',
  },
  {
    id: 'nat-phos',
    chemicalName: 'Sodium Phosphate',
    commonName: 'Nat Phos',
    abbreviation: 'Nat Phos.',
    zodiacId: 'libra',
    bodySystem: ['Digestive System', 'Joints'],
    rulingBodyPart: 'Acid-Base Balance',
    indications: [
      'Heartburn',
      'Acid indigestion',
      'Joint acidity / stiffness',
      'Sour stomach',
    ],
    deficiencySymptoms: [
      'Excess acidity',
      'Creaking joints',
      'Yellow-coated tongue',
    ],
    dietarySources: ['Almonds', 'Beets', 'Spinach', 'Sweet corn', 'Buttermilk'],
    description:
      'The great acid-neutralizer, restoring balance in the body — a fitting match for balance-seeking Libra.',
    color: '#EC7063',
  },
  {
    id: 'calc-sulph',
    chemicalName: 'Calcium Sulphate',
    commonName: 'Calc Sulph',
    abbreviation: 'Calc Sulph.',
    zodiacId: 'scorpio',
    bodySystem: ['Blood', 'Skin'],
    rulingBodyPart: 'Blood Purification',
    indications: [
      'Slow-healing wounds',
      'Skin eruptions',
      'Abscesses',
      'Thick yellow discharge',
    ],
    deficiencySymptoms: [
      'Recurring skin blemishes',
      'Sluggish wound healing',
      'Blood impurities',
    ],
    dietarySources: ['Fish', 'Onions', 'Garlic', 'Cabbage', 'Whole grains'],
    description:
      'The purifying salt for blood and skin, clearing what lingers beneath the surface — intense, transformative Scorpio.',
    color: '#7D3C98',
  },
  {
    id: 'silicea',
    chemicalName: 'Silica',
    commonName: 'Silicea',
    abbreviation: 'Silicea',
    zodiacId: 'sagittarius',
    bodySystem: ['Connective Tissue', 'Hair', 'Nails'],
    rulingBodyPart: 'Connective Tissue',
    indications: [
      'Brittle hair and nails',
      'Deep-seated infections',
      'Slow expulsion of splinters/foreign matter',
      'Weak connective tissue',
    ],
    deficiencySymptoms: [
      'Weak nails',
      'Thinning hair',
      'Poor stamina',
      'Delayed healing',
    ],
    dietarySources: ['Oats', 'Barley', 'Brown rice', 'Bell peppers', 'Strawberries'],
    description:
      'Known as the great "cleanser," pushing out what doesn\'t belong — resonant with adventurous, truth-seeking Sagittarius.',
    color: '#1ABC9C',
  },
  {
    id: 'calc-phos',
    chemicalName: 'Calcium Phosphate',
    commonName: 'Calc Phos',
    abbreviation: 'Calc Phos.',
    zodiacId: 'capricorn',
    bodySystem: ['Skeletal System', 'Teeth'],
    rulingBodyPart: 'Bones & Structure',
    indications: [
      'Bone weakness',
      'Slow growth or healing',
      'Teething issues',
      'General fatigue',
      'Cold extremities',
    ],
    deficiencySymptoms: [
      'Weak bones or teeth',
      'Growing pains',
      'Chronic tiredness',
    ],
    dietarySources: ['Dairy', 'Almonds', 'Broccoli', 'Sardines', 'Lentils'],
    description:
      'The primary bone-building salt, supporting structure and stamina — grounded, disciplined Capricorn territory.',
    color: '#34495E',
  },
  {
    id: 'nat-mur',
    chemicalName: 'Sodium Chloride',
    commonName: 'Nat Mur',
    abbreviation: 'Nat Mur.',
    zodiacId: 'aquarius',
    bodySystem: ['Fluid Balance', 'Emotional Regulation'],
    rulingBodyPart: 'Water Distribution',
    indications: [
      'Dryness (skin, eyes, mouth)',
      'Water retention imbalance',
      'Grief-related symptoms',
      'Watery colds',
    ],
    deficiencySymptoms: [
      'Dry mucous membranes',
      'Emotional withdrawal',
      'Excess or deficient thirst',
    ],
    dietarySources: ['Sea salt (mineral-rich)', 'Spinach', 'Celery', 'Beets', 'Strawberries'],
    description:
      'Regulates the body\'s water distribution and is tied to emotional equilibrium — fitting independent, humanitarian Aquarius.',
    color: '#3498DB',
  },
  {
    id: 'ferr-phos',
    chemicalName: 'Ferrum Phosphate',
    commonName: 'Ferr Phos',
    abbreviation: 'Ferr Phos.',
    zodiacId: 'pisces',
    bodySystem: ['Circulatory System', 'Immune System'],
    rulingBodyPart: 'Blood Oxygenation',
    indications: [
      'Early-stage inflammation',
      'Fevers',
      'First signs of a cold',
      'Throbbing headaches',
      'Nosebleeds',
    ],
    deficiencySymptoms: [
      'Low stamina',
      'Poor circulation',
      'Susceptibility to early infection',
    ],
    dietarySources: ['Spinach', 'Lentils', 'Egg yolk', 'Whole grains', 'Dried apricots'],
    description:
      'The body\'s "first responder" salt, supporting oxygen-carrying capacity of the blood at the onset of illness — dreamy, sensitive Pisces.',
    color: '#16A085',
  },
];

export const CELL_SALT_MAP: Record<string, CellSalt> = CELL_SALTS.reduce(
  (acc, salt) => {
    acc[salt.id] = salt;
    return acc;
  },
  {} as Record<string, CellSalt>
);

export function getAllBodySystems(): string[] {
  const set = new Set<string>();
  CELL_SALTS.forEach((s) => s.bodySystem.forEach((b) => set.add(b)));
  return Array.from(set).sort();
}

/**
 * Simple symptom -> cell salt suggestion lookup for the "Find My Salt" quiz.
 * Matches against indications and deficiency symptoms (case-insensitive, substring).
 */
export function findSaltsBySymptom(symptomQuery: string): CellSalt[] {
  const q = symptomQuery.trim().toLowerCase();
  if (!q) return [];
  return CELL_SALTS.filter((salt) => {
    const haystack = [
      ...salt.indications,
      ...salt.deficiencySymptoms,
      salt.commonName,
      salt.chemicalName,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
