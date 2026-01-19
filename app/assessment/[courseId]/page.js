'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { useSession } from 'next-auth/react';

import AssessmentHeader from '../../../components/AssessmentHeader';
import AssessmentQuestions from '../../../components/AssessmentQuestions';
import AssessmentResults from '../../../components/AssessmentResults';

import {
  fetchAssessmentData,
  resetAssessmentProgress,
  submitAssessment,
  retakeAssessment,
  downloadAssessmentCertificate,
  handleAssessmentSnackbarClose,
} from '../../../utils/assessmentUtils';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/'),
  });

  const userId = session?.user?.id;
  const storageKey = `assessment_${userId}_${courseId}`;

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [courseTitle, setCourseTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  /* -----------------------------------------
     INITIAL LOAD (RESTORE OR FETCH)
  ------------------------------------------ */
  useEffect(() => {
    if (!courseId || status !== 'authenticated' || !userId) return;

    const cached = sessionStorage.getItem(storageKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      setQuestions(parsed.questions);
      setResponses(parsed.responses);
      setSubmitted(parsed.submitted);
      setScore(parsed.score);
      setScorePercentage(parsed.scorePercentage);
      setCourseTitle(parsed.courseTitle);
      setIsCompleted(parsed.isCompleted);
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        setLoading(true);
        const { questions, title, progress } =
          await fetchAssessmentData(courseId, userId, session, setSnackbar);

        setQuestions(questions);
        setResponses(new Array(questions.length).fill(null));
        setCourseTitle(title);

        setIsCompleted(progress?.is_completed || false);
        setScorePercentage(progress?.assessment_score || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [courseId, status, userId]);

  /* -----------------------------------------
     PERSIST STATE (TAB SWITCH / REFRESH SAFE)
  ------------------------------------------ */
  useEffect(() => {
    if (!questions.length || !userId) return;

    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        questions,
        responses,
        submitted,
        score,
        scorePercentage,
        courseTitle,
        isCompleted,
      })
    );
  }, [
    questions,
    responses,
    submitted,
    score,
    scorePercentage,
    courseTitle,
    isCompleted,
    userId,
  ]);


    // LOADING & ERROR
 
  if (loading) return <Typography>Loading assessment...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!questions.length)
    return <Typography>No assessment questions available.</Typography>;

  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 1, sm: 2, md: 4 },
        width: '100%',
        mx: 'auto',
      }}
    >
      <AssessmentHeader courseTitle={courseTitle} />

      {/* QUESTIONS — ALWAYS VISIBLE */}
      <AssessmentQuestions
        questions={questions}
        responses={responses}
        setResponses={setResponses}
        handleSubmit={() =>
          submitAssessment(
            courseId,
            session,
            questions,
            responses,
            setScore,
            setScorePercentage,
            setSubmitted,
            setIsCompleted,
            setSnackbar,
            router
          )
        }
        submitted={submitted}
      />

      {/* RESULTS — ONLY AFTER SUBMIT */}
      {submitted && (
        <AssessmentResults
          isPassed={scorePercentage >= 100}
          scorePercentage={scorePercentage}
          submitted={true}
          handleRetake={() => {
            sessionStorage.removeItem(storageKey);
            retakeAssessment(
              courseId,
              session,
              setQuestions,
              setResponses,
              setScore,
              setScorePercentage,
              setSubmitted,
              setIsCompleted,
              setSnackbar
            );
          }}
          handleDownload={() =>
            downloadAssessmentCertificate(courseTitle, session, setSnackbar)
          }
          router={router}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => handleAssessmentSnackbarClose(setSnackbar)}
      >
        <Alert
          onClose={() => handleAssessmentSnackbarClose(setSnackbar)}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
