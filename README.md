# KnoseGit Deployment Guide

## Project Structure

- `dashboard_local/` – React frontend (deployed to Netlify)
- `server/` – Node.js/Express backend (deployed to Render)

---

## 1. Frontend Deployment (Netlify)

1. **Connect your repository to Netlify.**
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dashboard_local/build`
3. **Environment Variables:**
   - If your frontend needs to know the backend URL, add `REACT_APP_API_URL` in Netlify's environment settings.
4. **Deploy!**

---

## 2. Backend Deployment (Render)

1. **Create a new Web Service** on Render, pointing to the `server/` directory.
2. **Set the start command:** `npm start`
3. **Environment Variables:**
   - Add any secrets or config as needed (e.g., in a `.env` file or via Render's dashboard).
4. **CORS:**
   - By default, all origins are allowed. For production, restrict to your Netlify domain in `server/index.js` if desired.
5. **Deploy!**

---

## 3. Local Development

- **Frontend:**
  ```bash
  cd dashboard_local
  npm install
  npm start
  ```
- **Backend:**
  ```bash
  cd server
  npm install
  npm start
  ```

---

## 4. Environment Variables

- **Frontend:**
  - Create `dashboard_local/.env` and add e.g.:
    ```env
    REACT_APP_API_URL=https://your-backend.onrender.com
    ```
- **Backend:**
  - Create `server/.env` for secrets/config (add to `.gitignore`).

---

## 5. Notes
- Ensure `.env` files are not committed to git.
- Update CORS in backend for production security if needed. 