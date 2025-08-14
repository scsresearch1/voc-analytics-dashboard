# 🚀 Deployment Guide for KnoseGit Dashboard

This guide covers deploying the frontend to Netlify and the backend to Render.

## 📋 Prerequisites

- GitHub repository with all code pushed
- Netlify account (free tier available)
- Render account (free tier available)

## 🎯 Frontend Deployment (Netlify)

### 1. Build the React App
```bash
cd dashboard_local
npm install
npm run build
```

### 2. Deploy to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dashboard_local/build`
5. Click "Deploy site"

### 3. Environment Variables (Optional)
In Netlify dashboard, go to Site settings > Environment variables:
- `REACT_APP_BACKEND_URL`: `https://knosegit-backend.onrender.com`
- `REACT_APP_ENV`: `production`

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend
```bash
cd server
npm install
```

### 2. Deploy to Render
1. Go to [Render](https://render.com) and sign in
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `knosegit-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Click "Create Web Service"

### 3. Environment Variables
In Render dashboard, go to Environment:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will set this automatically)

## 🔄 Update Configuration

### Frontend Config
The frontend automatically detects the environment:
- **Development**: Uses localhost:4000 (no proxy needed)
- **Production**: Uses `https://knosegit-backend.onrender.com`

### Backend Routes
The backend serves:
- `/api/baseline-file` - Baseline CSV files
- `/Phase2/*` - Phase2 CSV files
- `/api/phase2-files` - List of Phase2 files
- `/api/files` - List of all CSV files

## 📁 File Structure for Deployment

```
dashboard_local/
├── src/
│   ├── BaselineDashboard.js    # ✅ Updated for Render backend
│   ├── Phase2Dashboard.js      # ✅ Updated for Render backend
│   ├── config.js               # ✅ New config file
│   └── ...
├── netlify.toml               # ✅ Netlify configuration
├── package.json               # ✅ Proxy removed
└── build/                     # Generated after npm run build

server/
├── index.js                   # ✅ Updated with Phase2 routes
├── package.json               # ✅ Dependencies configured
└── render.yaml                # Render configuration
```

## 🚀 Deployment Commands

### Frontend
```bash
cd dashboard_local
npm install
npm run build
# Deploy build/ folder to Netlify
```

### Backend
```bash
cd server
npm install
# Deploy to Render (automatic from Git)
```

## 🔍 Testing Deployment

1. **Frontend**: Visit your Netlify URL
2. **Backend**: Test API endpoints at `https://knosegit-backend.onrender.com`
3. **Integration**: Verify frontend can fetch data from Render backend

## 🐛 Troubleshooting

### Common Issues
- **CORS errors**: Backend has CORS enabled for all origins
- **File not found**: Ensure CSV files are in correct directories
- **Build failures**: Check Node.js version (use 18+)

### Logs
- **Netlify**: Check build logs in dashboard
- **Render**: Check service logs in dashboard

## 📞 Support

If you encounter issues:
1. Check the console logs in browser
2. Verify backend is running on Render
3. Ensure all files are pushed to GitHub
4. Check environment variables are set correctly

---

**Happy Deploying! 🎉**
