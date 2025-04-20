from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def github_headers():
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

def is_valid_github_url(url):
    return re.match(r'^https?://github\.com/[^/]+/[^/]+/?$', url)

def fetch_all_pages(api_url):
    results = []
    page = 1
    while True:
        response = requests.get(api_url, headers=github_headers(), params={'per_page': 100, 'page': page})
        if response.status_code != 200:
            break
        data = response.json()
        if not isinstance(data, list) or not data:
            break
        results.extend(data)
        page += 1
    return results

def safe_get(url):
    response = requests.get(url, headers=github_headers())
    if response.status_code != 200:
        raise Exception(f"GitHub API error {response.status_code}: {response.json().get('message')}")
    return response.json()

@app.route('/api/repo', methods=['POST'])
def analyze_repo():
    data = request.get_json()
    url = data.get('url', '')
    
    if not url or not is_valid_github_url(url):
        return jsonify({'error': 'Invalid GitHub repo URL.'}), 400

    # Extract owner and repo from URL
    parts = url.rstrip('/').split('/')
    owner, repo = parts[-2], parts[-1]

    try:
        api_base = f"https://api.github.com/repos/{owner}/{repo}"
        
        # Fetch repository metadata
        repo_data = safe_get(api_base)

        # Fetch contributors
        contributors = fetch_all_pages(f'{api_base}/contributors')

        # Fetch commits with pagination
        commits_data = fetch_all_pages(f'{api_base}/commits')

        commit_activity = []
        for commit in commits_data:
            commit_info = commit.get('commit', {})
            commit_activity.append({
                'sha': commit.get('sha'),
                'author': commit_info.get('author', {}).get('name', 'Unknown'),
                'date': commit_info.get('author', {}).get('date'),
                'message': commit_info.get('message'),
            })

        return jsonify({
            'metadata': {
                'name': repo_data.get('name'),
                'description': repo_data.get('description'),
                'stars': repo_data.get('stargazers_count'),
                'forks': repo_data.get('forks_count'),
                'open_issues': repo_data.get('open_issues_count'),
                'owner': repo_data.get('owner', {}).get('login'),
                'html_url': repo_data.get('html_url'),
            },
            'contributors': contributors,
            'commit_activity': commit_activity
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
