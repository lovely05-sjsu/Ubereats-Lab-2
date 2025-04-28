# UberEats Frontend

This is the frontend application for the UberEats clone project.

## Docker Setup

### Prerequisites

- Docker
- Docker Compose

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Build the development Docker image
./build-and-run.sh build-dev

# Run the development container
./build-and-run.sh run-dev
```

The application will be available at http://localhost:3000

### Production Mode

To run the application in production mode:

```bash
# Build the production Docker image
./build-and-run.sh build-prod

# Run the production container
./build-and-run.sh run-prod
```

The application will be available at http://localhost:3000

### Other Docker Commands

- Stop all containers: `./build-and-run.sh stop`
- Clean up containers and images: `./build-and-run.sh clean`
- Show help: `./build-and-run.sh help`

## Kubernetes Deployment

To deploy the frontend to Kubernetes:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

## Environment Variables

The following environment variables can be configured:

- `NODE_ENV`: Set to 'development' or 'production'
- `USER_SERVICE_URL`: URL for the user service API
- `RESTAURANT_SERVICE_URL`: URL for the restaurant service API
- `ORDER_SERVICE_URL`: URL for the order service API

## Project Structure

- `src/`: Source code
- `public/`: Static assets
- `k8s/`: Kubernetes deployment files
- `Dockerfile`: Production Docker configuration
- `Dockerfile.dev`: Development Docker configuration
- `docker-compose.yml`: Production Docker Compose configuration
- `docker-compose.dev.yml`: Development Docker Compose configuration
- `build-and-run.sh`: Helper script for Docker operations

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
