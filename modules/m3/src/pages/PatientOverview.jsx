
// import { useEffect, useState } from 'react'
// import { useNavigate, useParams, useLocation } from 'react-router-dom'
// import { getBundleById } from '../data/db'
// import HeaderBar from '../components/HeaderBar'
// import RecordSummaryCard from '../components/RecordSummaryCard'
// import LabResults from '../components/LabResults'
// import DiagnosisEditor from '../components/DiagnosisEditor'
// import AuditTrailPreview from '../components/AuditTrailPreview'
// import FooterBar from '../components/FooterBar'

// export default function PatientOverview() {
//   const { id } = useParams() // THIS GETS THE ID FROM THE URL
//   const navigate = useNavigate()
//   const location = useLocation()

//   const [refreshKey, setRefreshKey] = useState(0)
//   const triggerRefresh = () => setRefreshKey(prev => prev + 1)

//   const passedData = location.state?.r
//   const bundle = getBundleById(id) || getBundleById('P-10293')

//   const [patient, setPatient] = useState(passedData ? {
//     ...passedData,
//     name: passedData.fullName,
//     id: passedData.patientId
//   } : bundle.patient)

//   const [summary, setSummary] = useState(passedData ? {
//     ...bundle.summary,
//     primaryDiagnosis: passedData.primaryDiagnosis,
//     updatedAt: passedData.clinicalLastUpdated
//   } : bundle.summary)

//   const [diagnoses, setDiagnoses] = useState(bundle.diagnoses)
//   const [labs, setLabs] = useState(bundle.labs)

//   function addDiagnosis(item) {
//     if (!item) return;
//     setDiagnoses(d => [item, ...d])
//     triggerRefresh()
//   }

//   function addLab(item) {
//     if (!item) return;
//     setLabs(l => [item, ...l])
//     triggerRefresh()
//   }

//   return (
//     <div className="space-y-4">
//       <HeaderBar patient={patient} onSave={() => {}} onDiscard={() => navigate(-1)} />
//       <RecordSummaryCard summary={summary} />
      
//       {/* PASSING THE ID HERE */}
//       <DiagnosisEditor 
//         onAdd={addDiagnosis} 
//         patientId={id} 
//       />
      
//       <LabResults 
//         onAdd={addLab} 
//         patientId={id} 
//         refreshKey={refreshKey} 
//       />
      
//       <AuditTrailPreview patientId={id} refreshKey={refreshKey} />
//       <FooterBar onBack={() => navigate('/patients')} />
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getBundleById } from '../data/db'
import HeaderBar from '../components/HeaderBar'
import RecordSummaryCard from '../components/RecordSummaryCard'
import LabResults from '../components/LabResults'
import DiagnosisEditor from '../components/DiagnosisEditor'
import AuditTrailPreview from '../components/AuditTrailPreview'
import FooterBar from '../components/FooterBar'

export default function PatientOverview() {
  const { id } = useParams() // THIS GETS THE ID FROM THE URL
  const navigate = useNavigate()
  const location = useLocation()

  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(prev => prev + 1)

  const passedData = location.state?.r
  const bundle = getBundleById(id) || getBundleById('P-10293')

  const [patient, setPatient] = useState(passedData ? {
    ...passedData,
    name: passedData.fullName,
    id: passedData.patientId
  } : bundle.patient)

  const [summary, setSummary] = useState(passedData ? {
    ...bundle.summary,
    primaryDiagnosis: passedData.primaryDiagnosis,
    updatedAt: passedData.clinicalLastUpdated
  } : bundle.summary)

  const [diagnoses, setDiagnoses] = useState(bundle.diagnoses)
  const [labs, setLabs] = useState(bundle.labs)

  function addDiagnosis(item) {
    if (!item) return;
    setDiagnoses(d => [item, ...d])
    triggerRefresh()
  }

  function addLab(item) {
    if (!item) return;
    setLabs(l => [item, ...l])
    triggerRefresh()
  }

  return (
    <div className="space-y-4">
      <HeaderBar patient={patient} onSave={() => {}} onDiscard={() => navigate(-1)} />
      <RecordSummaryCard summary={summary} />
      
      {/* PASSING THE ID HERE */}
      <DiagnosisEditor 
        onAdd={addDiagnosis} 
        patientId={id} 
      />
      
      <LabResults 
        onAdd={addLab} 
        patientId={id} 
        refreshKey={refreshKey} 
      />
      
      <AuditTrailPreview patientId={id} refreshKey={refreshKey} />
      <FooterBar onBack={() => navigate('/patients')} />
    </div>
  )
}