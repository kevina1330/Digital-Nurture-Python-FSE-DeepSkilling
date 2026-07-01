# Course Management System Architecture Decomposition

## Bounded Context Service Responsibilities
* [cite_start]**Auth Service:** Owns user identity credentials, token generation, and registration rules.
* [cite_start]**Course Service:** Owns department details, courses schema layout, and credit definitions.
* [cite_start]**Student Service:** Owns student profiles and handles class enrollment logs.

## Inter-Service Communication Trade-Off Analysis

### Synchronous (HTTP/REST)
* [cite_start]**Pros:** Simple to implement[cite: 430]; transactional consistency is immediate.
* [cite_start]**Cons:** Creates tight temporal coupling; an outage in a downstream service immediately triggers errors in the calling service[cite: 428].

### Asynchronous (Message Queues - e.g., RabbitMQ, Kafka)
* [cite_start]**Pros:** Decouples services completely[cite: 429]; high availability is maintained because messages are safely queued if a service is down.
* [cite_start]**Cons:** High operational complexity [cite: 412][cite_start]; data consistency becomes eventual rather than instantaneous[cite: 429].