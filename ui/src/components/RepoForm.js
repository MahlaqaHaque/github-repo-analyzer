import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function RepoForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url.trim());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="GitHub Repository URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://github.com/owner/repo"
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !url}
        startIcon={<SearchIcon />}
      >
        Analyze
      </Button>
    </Box>
  );
}

export default RepoForm;
