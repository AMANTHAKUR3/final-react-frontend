import { PatientsProgress } from './PatientProgress';

export const PatientInOutCard = ({inoutdata}) => {


    return (
        <>
            <PatientsProgress 
            total = {inoutdata.DISCHARGED + inoutdata.INPATIENT} 
            inPatients = {inoutdata.INPATIENT} 
            outpatients = {inoutdata.DISCHARGED}
            />
        </>

    )
}


