import { PatientsProgress } from './PatientProgress';

export const PatientInOutCard = ({inoutdata}) => {


    return (
        <>
            <PatientsProgress 
            total = {(inoutdata.DISCHARGED || 0) + (inoutdata.INPATIENT || 0)} 
            inPatients = {inoutdata.INPATIENT || 0} 
            outpatients = {inoutdata.DISCHARGED || 0}
            />
        </>

    )
}


