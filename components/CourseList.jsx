import { useRouter } from 'next/navigation';
import { Button, Card, Grid, Box, Typography, LinearProgress, useTheme } from '@mui/material';
import { getProgress, handleCourseClick, handleDownloadCertificate } from '../utils/trainingUtils';

/**
 * CourseList component to display a grid of courses with progress and actions.
 * @param {Object} props
 * @param {Array} props.courses - List of courses.
 * @param {Object} props.completedChapters - Progress map.
 * @param {Function} props.setCompletedChapters - State setter for completed chapters.
 * @param {Object} props.session - User session.
 */
export default function CourseList({ courses, completedChapters, setCompletedChapters, session }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
      {courses.map((course) => (
        <Grid item xs={12} key={course.id}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              width: '100%',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              overflow: 'visible',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: 200 },
                height: { xs: 150, md: 120 },
                backgroundImage: `url(${course.image || '/images.jpeg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: `${theme.palette.primary.main}33`,
                  zIndex: 1,
                },
              }}
            />
            <Box
              sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: { xs: 'center', sm: 'center' },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {course.title} - {course.financial_year?.name}
              </Typography>
              <Box sx={{ mt: 1, maxWidth: { xs: '100%', sm: 300 }, mx: 'auto' }}>
                <Typography variant="caption">Progress</Typography>
                <LinearProgress
                  variant="determinate"
                  value={getProgress(course.id, course.totalChapters, completedChapters)}
                />
                <Typography variant="caption">
                  {completedChapters[course.id]?.completed_chapters.length || 0}/{course.totalChapters} chapters completed
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: { xs: 1, sm: 2 },
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                disabled={course.totalChapters === 0}
                sx={{ minWidth: { xs: 100, sm: 120 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                onClick={() => handleCourseClick(course.id, router, setCompletedChapters)}
              >
                {completedChapters[course.id]?.is_completed ? 'Revise Course' : 'View Course'}
              </Button>
              {completedChapters[course.id]?.is_completed && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ minWidth: { xs: 100, sm: 120 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  onClick={() => handleDownloadCertificate(course.title, session)}
                >
                  Certificate
                </Button>
              )}
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}