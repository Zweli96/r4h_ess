import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function AssessmentQuestions({
  questions,
  responses,
  setResponses,
  handleSubmit,
  submitted,
}) {
  const handleSelect = (index, value) => {
    if (submitted) return;
    const updated = [...responses];
    updated[index] = Number(value);
    setResponses(updated);
  };

  return (
    <>
      {questions.map((q, index) => {
        const userSelected =
          responses[index] !== undefined && responses[index] !== null
            ? responses[index]
            : null;

        const correctAnswer =
          q.answer !== undefined && q.answer !== null ? q.answer : null;

        return (
          <Card
            key={q.id}
            sx={{ mb: 2, p: { xs: 1, sm: 2 } }}
          >
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              {/* QUESTION TEXT */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  whiteSpace: 'normal',
                }}
              >
                {index + 1}. {q.question}
              </Typography>

              <RadioGroup
                value={
                  userSelected !== null ? userSelected.toString() : ''
                }
                onChange={(e) => handleSelect(index, e.target.value)}
                sx={{ gap: 1 }}
              >
                {q.options.map((option, optIdx) => {
                  const isUserSelected = userSelected === optIdx;
                  const isCorrect = correctAnswer === optIdx;

                  let color = 'inherit';
                  let icon = null;

                  if (submitted) {
                    if (isCorrect) {
                      color = 'green';
                      icon = (
                        <CheckIcon
                          sx={{ fontSize: 18, color: 'green', ml: 1 }}
                        />
                      );
                    } else if (isUserSelected && !isCorrect) {
                      color = 'red';
                      icon = (
                        <CloseIcon
                          sx={{ fontSize: 18, color: 'red', ml: 1 }}
                        />
                      );
                    }
                  }

                  return (
                    <FormControlLabel
                      key={optIdx}
                      value={optIdx.toString()}
                      control={<Radio />}
                      disabled={submitted}
                      sx={{
                        alignItems: 'flex-start',
                        m: 0,
                      }}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            sx={{
                              color,
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              whiteSpace: 'normal',
                            }}
                          >
                            {option}
                          </Typography>
                          {icon}
                        </Box>
                      }
                    />
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      {/* SUBMIT BUTTON */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={responses.includes(null) || submitted}
        sx={{ mt: 2 }}
      >
        Submit Assessment
      </Button>
    </>
  );
}
