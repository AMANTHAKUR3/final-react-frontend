
import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import HeaderBar from '../components/HeaderBar'
import RecordSummaryCard from '../components/RecordSummaryCard'
import LabResults from '../components/LabResults'
import DiagnosisEditor from '../components/DiagnosisEditor'
import AuditTrailPreview from '../components/AuditTrailPreview'

export default function PatientOverview() {
  const { id } = useParams() // THIS GETS THE ID FROM THE URL
  const location = useLocation()

  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(prev => prev + 1)

  const passedData = location.state?.r

  const [patient, setPatient] = useState(passedData ? {
    ...passedData,
    name: passedData.fullName,
    id: passedData.patientId
  } : {})

  const [summary, setSummary] = useState(passedData ? {
    
    primaryDiagnosis: passedData.primaryDiagnosis,
    updatedAt: passedData.clinicalLastUpdated
  } :{})


  return (
    <div className="space-y-4">
      <HeaderBar patient={patient} />
      <RecordSummaryCard summary={summary} />
      
      {/* PASSING THE ID HERE */}
      <DiagnosisEditor 
        patientId={id} 
      />
      
      <LabResults 
        
        patientId={id} 
        refreshKey={refreshKey} 
      />
      
      <AuditTrailPreview patientId={id} refreshKey={refreshKey} />
    </div>
  )
}