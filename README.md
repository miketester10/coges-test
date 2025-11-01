# Applicazione Coges Test

Un'applicazione quiz full-stack costruita con NestJS, React e MongoDB.

## 🌐 Demo Online

**Il sito può essere provato quÌ: [https://www.coges-test.it/](https://www.coges-test.it/)**

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js 18.x+
- Docker
- Git

### Installazione

1. **Clonare il repository**

   ```bash
   git clone https://github.com/miketester10/coges-test.git
   cd coges-test
   ```

2. **Avviare il database**

   ```bash
   cd backend/mongo_db
   docker compose up -d
   ```

3. **Setup e avviare il backend**

   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   npm run start:dev
   ```

4. **Setup e avviare il frontend**

   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Accedere all'applicazione**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Struttura del Progetto

```
coges-test/
├── backend/                # Backend NestJS
│   ├── src/                # Codice sorgente
│   ├── prisma/             # Schema database e seed
│   └── mongo_db/           # Setup MongoDB Docker e dump database
├── frontend/               # Frontend React
│   ├── src/                # Codice sorgente
│   └── public/             # Asset statici
└── README.md
```

## 🛠️ Stack Tecnologico

### Backend

- **Framework**: NestJS 11.0.1
- **Linguaggio**: TypeScript
- **Database**: MongoDB 5.0.3
- **ORM**: Prisma 6.18.0
- **Validazione**: class-validator, class-transformer

### Frontend

- **Framework**: React 19.2.0
- **Linguaggio**: TypeScript
- **Routing**: React Router 7.9.4
- **Client HTTP**: Axios 1.12.2
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack React Query 5.90.5
- **Validazione**: Zod 4.1.12

### Database

- **Database**: MongoDB 5.0.3
- **Container**: Docker
- **Autenticazione**: Abilitata con credenziali root/root

## 📊 Schema del Database

L'applicazione include le seguenti entità:

- **User**: Informazioni utente e autenticazione
- **Test**: Test quiz con metadati
- **Question**: Domande all'interno dei test
- **AnswerOption**: Opzioni a scelta multipla
- **Attempt**: Tentativi di test degli utenti
- **AttemptAnswer**: Risposte individuali alle domande

### Relazioni

- Un test ha molte domande
- Una domanda ha molte opzioni di risposta
- Un utente può avere molti tentativi
- Un tentativo ha molte risposte

## 🗄️ Dump del Database

Un dump completo del database è disponibile in `backend/mongo_db/database-dump/` contenente:

- 6 quiz di test
- 22 domande con opzioni a scelta multipla
- 2 utenti di test
- Tentativi e risposte di esempio

## 🔧 Configurazione

### Variabili d'Ambiente Backend

```bash
DATABASE_URL="mongodb://root:root@localhost:27017/coges-test-db?authSource=admin&directConnection=true&retryWrites=false"
```

### Variabili d'Ambiente Frontend

```bash
REACT_APP_API_URL=http://localhost:3001
```

## 📚 Endpoint API

### Test

- `GET /tests` - Ottenere tutti i test
- `GET /tests/:id` - Ottenere test per ID

### Domande

- `GET /questions/:id` - Ottenere domanda per ID

### Sessioni

- `POST /sessions` - Creare nuova sessione test

### Tentativi

- `POST /attempts/:id/answer` - Inviare risposta
- `POST /attempts/:id/complete` - Completare test

## 🎯 Caratteristiche Principali

### Sistema Quiz

- **Multi-domanda**: Supporto per quiz con domande multiple
- **Tempo reale**: Invio risposte in tempo reale
- **Risultati**: Calcolo automatico dei punteggi
- **Sessioni**: Gestione sessioni utente

### Interfaccia Utente

- **Responsive**: Design adattivo per tutti i dispositivi
- **Intuitiva**: Interfaccia utente semplice e chiara
- **Accessibile**: Supporto per accessibilità web

### Architettura

- **Modulare**: Architettura modulare e scalabile
- **API REST**: API RESTful ben strutturate
- **Database**: Schema database ottimizzato

## 🧪 Testing

Il progetto include una suite completa di test per garantire la qualità del codice:

### Test Implementati

- **Unit Tests**: Test isolati per servizi e pipe
- **Integration Tests**: Test per controller e flussi end-to-end
- **End-to-End Tests**: Test completi per API endpoints
- **Coverage**: Copertura del codice con report dettagliati

### File di Test

```
backend/src/
├── questions/
│   ├── questions.service.spec.ts    # Unit test QuestionsService
│   └── questions.controller.spec.ts # Integration test QuestionsController
├── tests/
│   └── tests.service.spec.ts       # Unit test TestsService
├── common/pipes/
│   └── parse-object-id.pipe.spec.ts # Unit test ParseObjectIdPipe
└── test/
    └── getTests.e2e-spec.ts        # End-to-end test API Tests
```

### Copertura del Codice

- **Questions Service**: 100% coverage
- **Tests Service**: 100% coverage
- **ParseObjectIdPipe**: 100% coverage
- **Questions Controller**: 100% coverage

### Comandi di Test

```bash
# Esegui tutti i test
npm test

# Esegui test con coverage
npm run test:cov

# Esegui test in watch mode
npm run test:watch

# Esegui test di debug
npm run test:debug

# Esegui test end-to-end
npm run test:e2e
```

### Tipologie di Test

1. **Unit Tests per Servizi**

   - Test di metodi `findAll()` e `findById()`
   - Verifica gestione eccezioni (`NotFoundException`, `BadRequestException`)
   - Mock appropriati per dipendenze Prisma

2. **Unit Tests per Pipe**

   - Validazione ObjectId MongoDB
   - Gestione errori per ID non validi
   - Test con diversi tipi di metadata

3. **Integration Tests per Controller**

   - Test endpoint REST
   - Propagazione corretta delle eccezioni
   - Verifica integrazione service-controller

4. **End-to-End Tests per API**

   - Test completi per endpoint `/tests` `/questions`
   - Verifica gestione errori e validazione
   - Test con dati reali del database

## 🔧 Comandi di Sviluppo

### Backend

```bash
# Sviluppo
npm run start:dev

# Build
npm run build

# Produzione
npm run start:prod

# Database
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# Testing
npm test
npm run test:cov
npm run test:watch
npm run test:e2e
```

### Frontend

```bash
# Sviluppo
npm start

# Build
npm run build
```

## 📈 Monitoraggio

### Metriche Importanti

- **Prestazioni API**: Tempo di risposta < 200ms
- **Utilizzo Database**: Connessioni attive
- **Memoria**: Utilizzo RAM < 1GB
- **CPU**: Utilizzo < 50%
