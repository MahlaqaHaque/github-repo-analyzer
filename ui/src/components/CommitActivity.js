import React from 'react';
import { Paper, Typography } from '@mui/material';

function CommitActivity({ data }) {
  if (!data) return null;
  return (
    <Paper elevation={2} sx={{ p: 2, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Commit Activity
      </Typography>
      {data.map((week, index) => (
        <div key={index}>
          <Typography>
            Week {index + 1}: {week.total} commits
          </Typography>
        </div>
      ))}
    </Paper>
  );
}

export default CommitActivity;