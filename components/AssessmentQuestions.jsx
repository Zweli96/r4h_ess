import { Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';

export default function AssessmentQuestions({ questions, responses, setResponses, handleSubmit, submitted }) {
  const handleSelect = (index, value) => {
    const updated = [...responses];
    updated[index] = Number(value);
    setResponses(updated);
  };

  return (
    <>
      {questions.map((q, index) => (
        <Card
          key={q.id}
          sx={{
            mb: 2,
            p: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            minWidth: 0,
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                overflow: 'visible',
              }}
            >
              {index + 1}. {q.question}
            </Typography>
            <RadioGroup
              value={responses[index]?.toString() || ''}
              onChange={(e) => handleSelect(index, e.target.value)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}
            >
              {q.options.map((option, optIdx) => (
                <FormControlLabel
                  key={optIdx}
                  value={optIdx.toString()}
                  control={<Radio />}
                  label={
                    <Typography
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        overflow: 'visible',
                      }}
                    >
                      {option}
                    </Typography>
                  }
                  sx={{ minWidth: 0, m: 0 }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={responses.includes(null) || submitted}
        sx={{ minWidth: { xs: 100, sm: 120 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        Submit Assessment
      </Button>
    </>
  );
}