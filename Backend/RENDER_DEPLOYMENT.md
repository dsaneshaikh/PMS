# Deploying the PMS Backend to Render

This guide provides step-by-step instructions to deploy your Permission Management System backend to Render.com.

## Prerequisites

1. A [Render account](https://render.com/)
2. Your PMS project in a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Prepare Your Repository

Ensure the following files are properly set up in your project:
- `package.json` ✅ (with the "start" script added)
- `Procfile` ✅ (specifying the web process)
- `.gitignore` ✅ (to prevent sensitive information from being committed)

### 2. Create a Web Service on Render

1. Log in to your [Render dashboard](https://dashboard.render.com/)
2. Click on the "New+" button and select "Web Service"
3. Connect your Git repository where your PMS backend is stored

### 3. Configure Your Web Service

Fill in the following details:
- **Name**: `pms-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Set Environment Variables

Click on the "Environment" tab and add the following key-value pairs:
- `PORT`: `5000`
- `NODE_ENV`: `production`
- `JWT_SECRET`: `your-secure-jwt-secret`
- `mongodbUri`: `your-mongodb-connection-string`
- `CLIENT_URL`: URL of your frontend deployment (e.g., `https://pms-frontend.onrender.com`)

### 5. Deploy

Click the "Create Web Service" button to start the deployment process.

## Post-Deployment

1. Wait for the initial build and deployment to complete
2. Once deployed, Render will provide a URL for your backend (e.g., `https://pms-backend.onrender.com`)
3. Update your frontend's `.env` file to point to this new backend URL

## Troubleshooting

If you encounter issues with your deployment:
1. Check the logs in the Render dashboard
2. Verify your environment variables are set correctly
3. Ensure MongoDB connection is working properly
4. Check the CORS settings to allow your frontend domain

## Frontend Deployment 

After your backend is deployed, you should also update your frontend configuration to point to the new backend URL:

```
# In your frontend .env file
VITE_BASE_URL=https://pms-backend.onrender.com/api/
```

Then deploy your frontend as a separate web service on Render using a similar process.
