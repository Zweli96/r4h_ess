import Certificate from './Certificate';

export default function AssessmentCertificate({ userName, courseTitle, date }) {
  return <Certificate userName={userName} courseTitle={courseTitle} date={date} />;
}