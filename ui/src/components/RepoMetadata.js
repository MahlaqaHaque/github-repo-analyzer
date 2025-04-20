import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import ErrorIcon from '@mui/icons-material/Error';

function RepoMetadata({ data }) {
  if (!data) return null;
  return (
    <Paper elevation={2} sx={{ p: 2, my: 2 }}>
      <Typography variant="h5" gutterBottom>
        {data.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {data.description}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="h6">
            <StarIcon sx={{ mr: 1 }} />
            {data.stars?.toLocaleString()}
          </Typography>
          <Typography variant="body2">Stars</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            <ForkRightIcon sx={{ mr: 1 }} />
            {data.forks?.toLocaleString()}
          </Typography>
          <Typography variant="body2">Forks</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            <ErrorIcon sx={{ mr: 1 }} />
            {data.issues?.toLocaleString()}
          </Typography>
          <Typography variant="body2">Open Issues</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default RepoMetadata;