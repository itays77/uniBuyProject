U# UniBuy Project

A full-stack e-commerce application for football kits with integrated payment processing through UniPaas.

## Overview

UniBuy is an e-commerce platform that allows users to browse and purchase authentic football jerseys from top national teams. The application features user authentication via Auth0, a product catalog, shopping cart functionality, and a checkout process with payment integration through UniPaas.

## Features

* **User authentication** with Auth0
* **Product catalog** with filtering options
* **Shopping cart** functionality
* **Order management**
* **Payment processing** through UniPaas
* **Responsive design** for all devices

## Tech Stack

### Frontend

* React
* TypeScript
* React Router
* React Query
* Shadcn UI components
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript
* MongoDB with Mongoose
* Auth0 for authentication
* UniPaas payment integration

## Live Application

The application is deployed on Render with the backend and frontend hosted separately:

* **Backend**: https://unibuyproject-backend.onrender.com
* **Frontend**: https://unibuyproject-frontend.onrender.com

## Local Setup

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn

### Backend Setup

1. Clone the repository
2. Enter the backend dir 
3. Install dependencies - npm install
4. Create a `.env` file in the backend directory - copy the correct values from the file
4. Start the backend server - npm run dev (Will run on port 8000 by default)

### Frontend Setup

1. Clone the repository
2. Enter the frontend dir 
3. Install dependencies - npm install
4. Create a `.env` file in the frontend directory and copy the correct values from the file
4. Start the frontend server - npm run dev (Will run on port 5173 by default.)

## Payment Integration

### Deployed Version
In the deployed version, the application integrates with UniPaas webhook to simulate the complete checkout process:

1. A new order is created in the database with **PENDING** status
2. The checkout session is created through UniPaas
3. On successful payment, UniPaas sends a webhook notification to update the order status to **PAID**
4. The user is redirected to the order confirmation page

### Local Development
For local development and testing, a simulated payment process has been implemented:

1. Orders are created in the **PENDING** status
2. A payment simulation page is displayed instead of redirecting to UniPaas
3. Users can choose to simulate either a successful or failed payment
4. The order status is updated accordingly based on the selection
5. The user is redirected to the order confirmation page, which shows the appropriate status

## Architecture and Design Choices

### Frontend Architecture
* **Component-Based Structure**: The frontend is organized into reusable components for maintainability.
* **React Query**: Used for data fetching, caching, and state management to minimize API calls.
* **Auth0 Integration**: Delegating authentication to Auth0 allows for secure user management without building custom auth.
* **Responsive Design**: Tailwind CSS provides a responsive design system that adapts to different screen sizes.

### Backend Architecture
* **MVC Pattern**: The backend follows a Model-View-Controller pattern for clean separation of concerns.
* **RESTful API**: The API follows REST principles for consistent and predictable endpoints.
* **Middleware-Based Authentication**: JWT validation through middleware ensures protected routes.
* **Mongoose for MongoDB**: Mongoose provides schema validation and a clean interface for MongoDB operations.

### Payment Flow
The UniPaas integration allows for a flexible payment solution:

1. **Webhook-Based**: Updates order status through webhooks, ensuring accurate payment tracking even if the user closes the browser.
2. **Simulation Mode**: For development and testing, a simulated payment flow allows for testing without actual payment processing.
3. **Error Handling**: Comprehensive error handling for payment failures with appropriate user feedback.

