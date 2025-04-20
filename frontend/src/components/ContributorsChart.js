import React from 'react';
import { Paper, Typography } from '@mui/material';

function ContributorsChart({ data }) {
  if (!data) return null;
  return (
    <Paper elevation={2} sx={{ p: 2, my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Top Contributors
      </Typography>
      {data.map((contributor, index) => (
        <div key={contributor.id}>
          <Typography>
            {index + 1}. {contributor.login} - {contributor.contributions} contributions
          </Typography>
        </div>
      ))}
    </Paper>
  );
}

export default ContributorsChart;