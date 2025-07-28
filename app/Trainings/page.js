'use client';

import { useState, useEffect, Suspense, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingContext } from '../../components/LoadingContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import CourseList from '../../components/CourseList';
import CourseContent from '../../components/CourseContent';

/**
 * Main TrainingPage component with routing and data fetching.
 * Renders CourseList or CourseContent based on courseId query param.
 */
export default function TrainingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push('/'),
  });
  const { setIsLoading } = useContext(LoadingContext) || {};

  const [courses, setCourses] = useState([]);
  const [completedChapters, setCompletedChapters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading?.(true);
        setLoading(true);

        // Fetch courses
        const coursesRes = await axiosInstance.get('/training/courses/');
        setCourses(coursesRes.data);

        // Fetch user progress
        const progressRes = await axiosInstance.get(
          `/training/user-progress/?user_id=${session.user.id}`
        );
        const progressData = progressRes.data;
        const progressMap = {};
        progressData.forEach((p) => {
          progressMap[p.course] = {
            completed_chapters: p.completed_chapters,
            is_completed: p.is_completed,
          };
        });
        setCompletedChapters(progressMap);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
        setIsLoading?.(false);
      }
    };
    fetchData();
  }, [status, session, setIsLoading]);

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <Box
        sx={{
          py: 2,
          px: { xs: 1, sm: 2, md: 4 },
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            textAlign: { xs: 'center', sm: 'left' },
            width: '100%',
          }}
        >
          R4H Trainings
        </Typography>
        {courseId ? (
          <CourseContent
            courseId={Number(courseId)}
            courses={courses}
            completedChapters={completedChapters}
            setCompletedChapters={setCompletedChapters}
            session={session}
          />
        ) : (
          <CourseList
            courses={courses}
            completedChapters={completedChapters}
            setCompletedChapters={setCompletedChapters}
            session={session}
          />
        )}
      </Box>
    </Suspense>
  );
}