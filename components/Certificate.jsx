import { Box, Typography, useTheme } from '@mui/material';

const Certificate = ({ userName, courseTitle, date }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '250mm',
        height: '210mm',
        backgroundColor: '#fff',
        border: `2px solid ${theme.palette.primary.main}`,
        padding: '10mm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: '"Arial", sans-serif',
        textRendering: 'optimizeLegibility',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
      id="certificate"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '180mm',
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="img"
          src="/r4hlogo.png"
          alt="Company Logo"
          sx={{
            width: '50mm',
            height: 'auto',
            mb: '1.5rem',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}
        >
          Certificate of Completion
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: '1rem',
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}
        >
          This certifies that
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}
        >
          {userName}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: '1rem',
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}
        >
          has successfully completed the course
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1.2rem',
            lineHeight: 1.3,
          }}
        >
          {courseTitle}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9rem',
            marginBottom: '1rem',
            lineHeight: 1.3,
          }}
        >
          Date: {date}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: '15mm',
            width: '100%',
            maxWidth: '180mm',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Box
            sx={{
              textAlign: 'left',
              fontSize: '0.7rem',
              color: theme.palette.text.secondary,
            }}
          >
            <Box
              component="img"
              src="/Picture2.png"
              alt="Signature"
              sx={{
                width: '30mm',
                height: 'auto',
                mb: '0.2rem',
              }}
            />
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              Lucy Chiyenda,Country Director
            </Typography>
          </Box>
          <Box
            sx={{
              fontSize: '0.7rem',
              color: theme.palette.text.secondary,
              textAlign: 'right',
            }}
          >
            Issued by R4H ESS
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Certificate;