
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { useSession } from 'next-auth/react';
import AssessmentHeader from '../../../components/AssessmentHeader';
import AssessmentQuestions from '../../../components/AssessmentQuestions';
import AssessmentResults from '../../../components/AssessmentResults';
import { fetchAssessmentData, resetAssessmentProgress, submitAssessment, retakeAssessment, downloadAssessmentCertificate, handleAssessmentSnackbarClose } from '../../../utils/assessmentUtils';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;
  const { data: session, status } = useSession({ required: true, onUnauthenticated: () => router.push('/') });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!courseId || status !== 'authenticated' || !session?.user?.id) {
      setError('User not authenticated or user ID missing');
      setLoading(false);
      return;
    }

    const initialize = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Initializing assessment for courseId:', courseId, 'userId:', session.user.id);
        const { questions, title, progress } = await fetchAssessmentData(courseId, session.user.id, session, setSnackbar);
        setQuestions(questions);
        setCourseTitle(title);
        setResponses(new Array(questions.length).fill(null));

        if (progress?.is_completed && (!progress.assessment_score || progress.assessment_score < 100)) {
          console.log('Resetting invalid progress for courseId:', courseId);
          await resetAssessmentProgress(courseId, session.user.id, session, setSnackbar);
          setIsCompleted(false);
          setScorePercentage(0);
        } else {
          setIsCompleted(progress?.is_completed || false);
          setScorePercentage(progress?.assessment_score || 0);
        }
      } catch (err) {
        console.error('AssessmentPage initialize error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [courseId, status, session]);

  if (loading) return <Typography>Loading assessment...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (questions.length === 0) return <Typography>No assessment questions available.</Typography>;

  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 1, sm: 2, md: 4 },
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <AssessmentHeader courseTitle={courseTitle} />
      {isCompleted && scorePercentage >= 100 && !submitted ? (
        <AssessmentResults
          isPassed={true}
          scorePercentage={scorePercentage}
          submitted={false}
          handleRetake={() => retakeAssessment(courseId, session, setQuestions, setResponses, setScore, setScorePercentage, setSubmitted, setIsCompleted, setSnackbar)}
          handleDownload={() => downloadAssessmentCertificate(courseTitle, session, setSnackbar)}
          router={router}
        />
      ) : (
        <AssessmentQuestions
          questions={questions}
          responses={responses}
          setResponses={setResponses}
          handleSubmit={() => submitAssessment(courseId, session, questions, responses, setScore, setScorePercentage, setSubmitted, setIsCompleted, setSnackbar, router)}
          submitted={submitted}
        />
      )}
      {submitted && (
        <AssessmentResults
          isPassed={scorePercentage >= 100}
          scorePercentage={scorePercentage}
          submitted={true}
          handleRetake={() => retakeAssessment(courseId, session, setQuestions, setResponses, setScore, setScorePercentage, setSubmitted, setIsCompleted, setSnackbar)}
          handleDownload={() => downloadAssessmentCertificate(courseTitle, session, setSnackbar)}
          router={router}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => handleAssessmentSnackbarClose(setSnackbar, snackbar)}
      >
        <Alert onClose={() => handleAssessmentSnackbarClose(setSnackbar, snackbar)} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
