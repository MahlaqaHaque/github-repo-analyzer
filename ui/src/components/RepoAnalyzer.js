import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, TextField, Button, Card, CardContent,
  Grid, Avatar, CircularProgress, Alert, Link, Box, Divider, Tooltip, Paper
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';

export default function RepoAnalyzer() {
  const [url, setUrl] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const loadingMessages = [
    "Gathering data from GitHub, please wait...",
    "Fetching repository details...",
    "Processing contributors and commits...",
    "Crunching the numbers...",
    "Almost there, analyzing the repo..."
  ];
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setLoadingMsgIndex(0);
      intervalRef.current = setInterval(() => {
        setLoadingMsgIndex(prev =>
          prev < loadingMessages.length - 1 ? prev + 1 : prev
        );
      }, 1800);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [loading, loadingMessages.length]);

  let cumulativeCommits = [];
  if (repoData && repoData.commit_activity) {
    const commits = repoData.commit_activity.slice(0, 30).reverse();
    let total = 0;
    cumulativeCommits = commits.map((commit, idx) => {
      total += 1;
      return {
        name: `#${idx + 1}`,
        totalCommits: total,
        author: commit.author || 'Unknown',
        date: commit.date,
        message: commit.message,
      };
    });
  }

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setRepoData(null);
    try {
      const response = await fetch('http://localhost:5001/api/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setRepoData(data);
      }
    } catch (err) {
      setError('Failed to connect to server or invalid response.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ background: "#D4F1F4", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: "linear-gradient(90deg, #05445E 0%, #189AB4 100%)" }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <GitHubIcon sx={{ mr: 2, fontSize: 40, color: "#D4F1F4" }} />
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 1,
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#fff"
            }}
          >
            GitHub Repo Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Input Bar (always visible except loading) */}
      {(!loading) && (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              bgcolor: "#6FE7E0",
              boxShadow: "0 4px 24px 0 rgba(5,68,94,0.08)",
              minWidth: { xs: 320, sm: 500, md: 650 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                width: { xs: 260, sm: 440, md: 600 },
                mx: "auto",
                justifyContent: "center"
              }}
            >
              <TextField
                label="GitHub Repository URL"
                variant="outlined"
                value={url}
                onChange={e => setUrl(e.target.value)}
                fullWidth
                sx={{ flex: 1, bgcolor: "#fff", borderRadius: 2, input: { color: "#05445E" } }}
                size="medium"
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 4, py: 1.5, fontWeight: 600, borderRadius: 2,
                  boxShadow: 2, textTransform: "none", fontFamily: 'Inter, sans-serif',
                  bgcolor: "#189AB4", '&:hover': { bgcolor: "#05445E" }
                }}
                onClick={handleAnalyze}
                disabled={loading || !url}
              >
                Analyze
              </Button>
            </Box>
          </Paper>
        </Container>
      )}

      {/* Centered loading spinner and message */}
      {(loading && !repoData) && (
        <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{
            p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: "#6FE7E0",
            boxShadow: "0 4px 24px 0 rgba(5,68,94,0.08)",
            minWidth: { xs: 320, sm: 500, md: 650 }
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: { xs: 260, sm: 440, md: 600 } }}>
              <CircularProgress sx={{ color: "#05445E", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {loadingMessages[loadingMsgIndex]}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Main Content Row */}
      {(repoData || error) && (
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Left: Contributors List */}
            <Grid item xs={12} md={5}>
              {repoData && repoData.contributors && (
                <Paper elevation={2} sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "#D4F1F4",
                  boxShadow: "0 2px 8px 0 rgba(5,68,94,0.06)",
                  minHeight: 400,
                  maxHeight: { md: 'calc(100vh - 180px)' },
                  overflowY: 'auto',
                  position: { md: "sticky" },
                  top: { md: 100 }
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: "#05445E" }}>
                    All Contributors
                  </Typography>
                  {repoData.contributors.map((contributor) => (
                    <Box key={contributor.login || contributor.author} sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1.5,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#fff"
                    }}>
                      <Avatar src={contributor.avatar_url} alt={contributor.login || contributor.author} sx={{ bgcolor: "#189AB4", width: 32, height: 32 }} />
                      <Box>
                        <Typography fontWeight={600} color="#05445E" fontSize={14}>
                          {contributor.login || contributor.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contributor.contributions} contributions
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              )}
            </Grid>
            {/* Right: Main Repository Block */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                mb: 4,
                bgcolor: "#6FE7E0",
                boxShadow: "0 4px 24px 0 rgba(5,68,94,0.08)"
              }}>
                {error && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    mb: 2
                  }}>
                    <TextField
                      label="GitHub Repository URL"
                      variant="outlined"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      fullWidth
                      sx={{ flex: 1, bgcolor: "#fff", borderRadius: 2, input: { color: "#05445E" } }}
                      size="medium"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 4, py: 1.5, fontWeight: 600, borderRadius: 2,
                        boxShadow: 2, textTransform: "none", fontFamily: 'Inter, sans-serif',
                        bgcolor: "#189AB4", '&:hover': { bgcolor: "#05445E" }
                      }}
                      onClick={handleAnalyze}
                      disabled={loading || !url}
                    >
                      Analyze
                    </Button>
                  </Box>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {repoData && (
                  <>
                    <Divider sx={{ my: 3, borderColor: "#05445E" }}>Repository Summary</Divider>
                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2, bgcolor: "#D4F1F4" }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={repoData.metadata.owner_avatar_url || ""} alt={repoData.metadata.owner || ""} sx={{ width: 56, height: 56, bgcolor: "#189AB4" }} />
                          <Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif', color: "#05445E" }}>
                              <Link href={repoData.metadata.html_url} target="_blank" underline="hover" color="#189AB4">
                                {repoData.metadata.name}
                              </Link>
                            </Typography>
                            <Typography color="text.secondary" sx={{ fontSize: 16 }}>
                              {repoData.metadata.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mt: 2 }}>
                          <Tooltip title="Stars"><span><StarIcon sx={{ color: "#05445E" }} /> {repoData.metadata.stars}</span></Tooltip>
                          <Tooltip title="Forks"><span><ForkRightIcon sx={{ color: "#189AB4" }} /> {repoData.metadata.forks}</span></Tooltip>
                          <Tooltip title="Open Issues"><span><ErrorOutlineIcon sx={{ color: "#6FE7E0" }} /> {repoData.metadata.open_issues}</span></Tooltip>
                        </Box>
                      </CardContent>
                    </Card>

                    <Divider sx={{ my: 3, borderColor: "#05445E" }}>Top Contributors</Divider>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {repoData.contributors.slice(0, 10).map((contributor) => (
                        <Grid item xs={12} sm={6} md={6} key={contributor.login || contributor.author}>
                          <Card sx={{
                            borderRadius: 3,
                            boxShadow: 1,
                            transition: "0.2s",
                            bgcolor: "#D4F1F4",
                            '&:hover': { boxShadow: 6, transform: "translateY(-4px) scale(1.03)" }
                          }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={contributor.avatar_url} alt={contributor.login || contributor.author} sx={{ bgcolor: "#189AB4" }} />
                              <div>
                                <Typography fontWeight={600} color="#05445E">{contributor.login || contributor.author}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {contributor.contributions} contributions
                                </Typography>
                              </div>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ my: 3, borderColor: "#05445E" }}>Weekly Cumulative Commit Trend</Divider>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: "#D4F1F4" }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={cumulativeCommits}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <ReTooltip formatter={(value, name, props) => [
                            `${props.payload.message} by ${props.payload.author}`,
                            'Cumulative Commits',
                          ]} />
                          <Line type="monotone" dataKey="totalCommits" stroke="#05445E" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
}