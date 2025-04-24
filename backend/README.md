# Transaction Service API

This is a simple RESTful API built with **NestJS**, **GraphQL**, and **Prisma** to manage transactions. The service supports creating and querying transactions and integrates with Kafka for message processing.

## Technologies Used

- **NestJS** - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **GraphQL** - A query language for your API, allowing clients to request exactly the data they need.
- **Prisma** - A modern database toolkit for TypeScript and Node.js.
- **PostgreSQL** - A powerful, open-source object-relational database system.
- **KafkaJS** - Kafka client for Node.js to handle event-driven communication.
- **Docker** - Used for containerization of the services.

## Features

- **GraphQL Queries**:
  - `GET /graphql` to fetch transactions with specific IDs.
  - Support for custom filtering and sorting.
  
- **GraphQL Mutations**:
  - `POST /graphql` to create new transactions.

- **Kafka Integration**:
  - Handles real-time processing of transaction data based on business rules.
  
- **Database**:
  - PostgreSQL to store transaction details.
  - Prisma ORM for seamless database interaction.

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/FreddyCarrillo/app-nodejs-codechallenge.git
cd app-nodejs-codechallenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following environment variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/transaction_db
PORT=3000
```

### 4. Run the project

```bash
npm run start:dev
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma client

```bash
npx prisma generate
```

## GraphQL Playground

```
http://localhost:3000/graphql
```

## Example Queries

### Get a Transaction by ID

```graphql
query {
  transaction(transactionExternalId: "YOUR_ID") {
    transactionExternalId
    value
    transactionStatus {
      name
    }
    transactionType {
      name
    }
    createdAt
  }
}
```

### Create a Transaction

```graphql
mutation {
  createTransaction(data: {
    accountExternalIdDebit: "UUID-1",
    accountExternalIdCredit: "UUID-2",
    transferTypeId: 1,
    value: 1200
  }) {
    transactionExternalId
    transactionStatus {
      name
    }
    transactionType {
      name
    }
    value
    createdAt
  }
}
```

### Using curl to interact with the GraphQL endpoint

### Create a Transaction

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "c7c2e75f-bd43-4e2c-8f88-0581112be456",
    "accountExternalIdCredit": "fa8a7d17-48d4-402e-95f3-b89c457e4d1b",
    "tranferTypeId": 1,
    "value": 1200
}'
```

### Get a Transaction by ID

```bash
curl http://localhost:3000/transactions/586a91bd-775e-46fd-a4e1-9cbc585f9665
```

## Docker Setup

```yaml
version: "3"
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: transaction_db
    ports:
      - "5432:5432"
  kafka:
    image: wurstmeister/kafka
    ports:
      - "9092:9092"
  zookeeper:
    image: wurstmeister/zookeeper:3.5
    ports:
      - "2181:2181"
```

```bash
docker-compose up -d
```

## Handling High Volume Transactions

To handle high volumes of simultaneous **reads and writes**, the system has been designed with the following strategies:

- **GraphQL as the interface layer**: GraphQL provides precise data fetching, reducing payload size and network overhead. This is ideal in high-throughput environments where clients need only specific slices of data.

- **Kafka for asynchronous processing**: All transaction creations are sent to a Kafka topic. This decouples the request/response cycle from the business logic evaluation (e.g., approving or rejecting based on the amount). It enables the system to scale horizontally and process high loads in a non-blocking way.

- **PostgreSQL with Prisma ORM**: PostgreSQL is a robust relational database, and Prisma helps optimize queries while offering transactional guarantees and scalability. Using `upsert` and indexing strategies ensures fast writes and reads even under concurrent loads.

- **Read/Write separation**: In a real-world production setup, the architecture can be extended to use **read replicas** for handling high query loads, and **caching layers** like Redis for frequent reads.

- **Transactional Integrity**: Prisma ensures atomicity and consistency through database-level transactions, crucial in financial applications.

This architecture allows the service to **remain consistent, resilient, and performant**, even under high load.

## Conclusion

This service demonstrates how to set up a **transaction processing** system with **NestJS**, **GraphQL**, **Prisma**, and **Kafka**.
