export const LAB_TESTS = [
  { name: 'HbA1c', units: '%', refRange: '4.0 – 5.6' },
  { name: 'Fasting Glucose', units: 'mg/dL', refRange: '70 – 99' },
  { name: 'LDL Cholesterol', units: 'mg/dL', refRange: '< 100' },
  { name: 'Creatinine', units: 'mg/dL', refRange: '0.60 – 1.35' },
  { name: 'Hemoglobin', units: 'g/dL', refRange: '12.0 – 17.5' },
  { name: 'TSH', units: 'mIU/L', refRange: '0.4 – 4.0' }
]

export function getDefaultsFor(testName){
  const t = LAB_TESTS.find(x => x.name === testName)
  if(!t) return { units: '', refRange: '' }
  return { units: t.units, refRange: t.refRange }
}