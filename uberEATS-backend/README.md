# UberEATS Backend

This is the backend service for the UberEATS application, providing user, restaurant, and order management functionality with event-driven architecture using Kafka.

## Architecture

The application consists of the following microservices:

1. **User Service**: Handles user registration, authentication, and profile management
2. **Restaurant Service**: Manages restaurant profiles, menus, and orders
3. **Order Service**: Processes order creation and status updates
4. **Order Status Consumer**: Listens for order events and updates order statuses

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Kafka**: Message broker for event-driven architecture
- **Docker**: Containerization
- **Kubernetes**: Orchestration

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (local or cloud)
- kubectl CLI

## Local Development

### Using Docker Compose

1. Clone the repository
2. Build and start the services:
   ```bash
   docker-compose up -d
   ```
3. The services will be available at:
   - User Service: http://localhost:3001
   - Restaurant Service: http://localhost:3002
   - Order Service: http://localhost:3003
   - Order Status Consumer: http://localhost:3004

### Using Kubernetes

1. Make sure your Kubernetes cluster is running
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```
3. Check the status of the pods:
   ```bash
   kubectl get pods
   ```

## API Endpoints

### User Service
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: User login
- `GET /api/users/profile`: Get user profile

### Restaurant Service
- `POST /api/restaurants/register`: Register a new restaurant
- `GET /api/restaurants`: List all restaurants
- `GET /api/restaurants/:id`: Get restaurant details

### Order Service
- `POST /api/orders`: Create a new order
- `GET /api/orders/:id`: Get order details
- `PUT /api/orders/:id/status`: Update order status

## Event Topics

The application uses the following Kafka topics:
- `order_created`: Published when a new order is created
- `order_status_updated`: Published when an order status is updated
- `order_status_confirmed`: Published when an order status update is confirmed

## Troubleshooting

### Kafka Issues
If Kafka is not working properly:
1. Check the Kafka pod logs:
   ```bash
   kubectl logs -l app=kafka
   ```
2. Verify Zookeeper is running:
   ```bash
   kubectl get pods -l app=zookeeper
   ```

### MongoDB Issues
If MongoDB connection fails:
1. Check the MongoDB pod logs:
   ```bash
   kubectl logs -l app=mongo-db
   ```
2. Verify the MongoDB service is running:
   ```bash
   kubectl get svc mongo-db
   ```

## License

This project is licensed under the MIT License. 