# Dokoni Tabemashouka (どこに食べましょうか)

A modern restaurant finder application that helps users discover dining spots near Cogent Labs office in Tokyo. Built with Next.js 13+, React Query, and TypeScript.
Feel free to try the app [Here](https://tyjani.fr/)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Foursquare Places API key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Add your Foursquare API key to `.env`

5. a. Run on your machine:
### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

5. b. Run in docker
### Production Build
```bash
docker compose up
```

## About

Dokoni Tabemashouka provides an intuitive interface that:
- Integrates with Foursquare Places API for accurate restaurant data
- Features an interactive map view for spatial context
- Offers real-time search and filtering capabilities
- Implements smart caching and rate limiting for optimal performance
- Provides a responsive, modern UI that works across devices

## Technical Architecture

### Code Organization
Inspired by a domain driven approach, the code splitted in different directories as:
- `app/`: contains the entrypoint of the app. The home page and global.css file. It also contains the values of the different Context providing them to the tree of components it renders.
- `domain/`: contains the entities and types of the objects used by the core.
- `hooks/`: contains the custom hooks to abstract the usages of context by providing ready to use functions.
- `server/`: contains the exclusive part of the app that runs exclusively on the server, talking about api calls, rate limiting
- `components/`: contains the react components that makes up the app

### Philosophy
The philosophy behind this organization is maintining a clean code, with an obvious separation of concerns. This translates in key fundamental rules I tried to follow designing these modules:
- Concentrate context initialization and declaration in one place (here is the root)
- Limit the number of components using a context to prevent useless renders
- Prioritize the usage of pure functions for rendering and use state only when needed to prevent unwanted rerenders specially in nested components
- One component one responsability
- Use typings to prevent incoherent behaviours

### Core Technologies
- **Next.js 13+**
- **React Query**: Advanced state management with client side caching
- **TypeScript**
- **Leaflet**: For interactive map visualization
- **Foursquare Places API**
- **Pino**: Basic but powerful logging solution 

### Key Technical Decisions

#### 1. State Management
- **React Query** for server state (restaurant data)
  - Automatic caching with 5-minute stale time
  - Built-in retry logic 
  - **Benefits**: faster loading time when requesting data already provided
- **React Context**
  - Selected place
  - Search criteria: Encapsulates the different filters values accross different filtering component (search bar and quick filters)
  - Places list

#### 2. API Integration
- Server-side API routes for secure API key handling
- Rate limiting implementation using LRU cache
- Error handling with proper error boundaries
- Comprehensive API logging with performance metrics

#### 3. Performance Optimizations
- Memoization of expensive computations
- Simple and efficient caching strategies
- Rate limiting to prevent API abuse
- Performance monitoring through structured logging

#### 5. Logging System
- **Structured Logging**: Using Pino for JSON-formatted logs
- **Log Levels**: 
  - TRACE: Detailed debugging information
  - DEBUG: Development debugging
  - INFO: General operational information
  - WARN: Warning messages
  - ERROR: Error conditions
  - FATAL: Critical system failures
- **Log Categories**:
  - API: API calls and responses
  - PERFORMANCE: Performance metrics
  - ERROR: Error conditions and stack traces
  - SYSTEM: System-level events
- **Features**:
  - Environment-aware configuration
  - Performance metrics tracking
  - Error tracking with stack traces
  - API call logging with timing

## Trade-offs & Future Improvements

### Current Trade-offs

1. **Caching Strategy**
   - Using client-side caching with React Query
   - Trade-off: Fresh data, simple and rapid implementation vs. performance
   - Could be improved with server-side caching

2. **Rate Limiting**
   - Simple in-memory rate limiting
   - Trade-off: Scalability vs. simplicity
   - Could be enhanced with other tools like Redis

3. **Error Handling**
   - Basic error boundaries
   - Trade-off: Development speed vs. comprehensive error handling
   - Could add more specific error types and recovery strategies, but also better user notifications to prevent frustrations

### Future Improvements

1. **Performance**
   - Improve server-side rendering for initial load
   - Add content loading optimization and lazy loading

2. **Features**
   - User favorites saved in local storage, could also be used for better suggestions 
   - Advanced filtering options, also for the ramdom selection feature

3. **Architecture**
   - Implement proper monitoring and logging for extensive metrics and alerting in case of problems
   - Add comprehensive test coverage

4. **Developer Experience**
   - Add Storybook for component documentation
   - Add data validation using library like Zod for API data validation
   - Add pre-commit hooks to format, run test and build before commiting changes (ensures that the app is safe to push)

5. **Logging Enhancements**
   - Implement log aggregation and analysis
   - Add log rotation and retention policies
   - Implement log batching for high-traffic scenarios

### Logging Configuration
The logging system is configured through environment variables:
- `NODE_ENV`: Controls log level (debug in development, info in production)
