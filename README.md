# GitHub Repo Analyzer

A modern web application to analyze public GitHub repositories, visualize contributors, and explore repository statistics.

---

## 🔍 Features

- Analyze any public GitHub repository by URL  
- Contributors sidebar with scroll (sticky on desktop)  
- Repository details: name, description, stars, forks, issues  
- Top contributors and commit activity visualization  
- Responsive, modern UI using Material-UI (MUI v7+)  
- **Backend**: Flask API with secure GitHub token handling  

---

## 📁 Project Structure

/github-repo-analyzer/ ├── frontend/ # React app (Create React App) │ └── Dependencies: React 19, MUI 7, Recharts, Axios └── backend/ # Flask API ├── app.py ├── Dockerfile ├── .dockerignore └── Dependencies: Flask, requests, python-dotenv, flask-cors

yaml
Copy
Edit

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended)  
- Python 3.8+  
- npm (comes with Node.js)  
- GitHub personal access token (for API requests)  

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/yourusername/github-repo-analyzer.git
cd github-repo-analyzer
⚙️ 2. Backend Setup
bash
Copy
Edit
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Create a .env file and add your GitHub token:

bash
Copy
Edit
echo "GITHUB_TOKEN=your_github_token_here" > .env
Start the Flask server:

bash
Copy
Edit
python app.py
The backend runs on http://localhost:5001/ by default.

💻 3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm start
The frontend runs on http://localhost:3000/ by default.

🧑‍💻 Usage
Enter a public GitHub repository URL (e.g., https://github.com/facebook/react) in the search bar.

Click Analyze.

View contributors, repository stats, and commit analytics.

🛠️ Technologies Used
Frontend
React 19

Material-UI v7+

Recharts

Axios

Backend
Flask

Requests

Flask-CORS

python-dotenv

Deployment
Docker-ready backend

🌐 Environment Variables
Backend
GITHUB_TOKEN — stored in .env (never commit this file)

📸 Screenshots
Add screenshots here showing the contributors sidebar and analytics UI.

📄 License
This project is licensed under the MIT License.

🙌 Acknowledgements
[Material-UI](https://mui.com/)
[Recharts](https://recharts.org/en-US/)
[GitHub REST API](https://docs.github.com/en/rest)

---


