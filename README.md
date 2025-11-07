# Applicazione Coges Test

Un'applicazione quiz full-stack costruita con NestJS, React e MongoDB.

## 🌐 Demo Online

**Il sito può essere provato qui: [https://www.coges-test.it/](https://www.coges-test.it/)**

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js 18.x+ (include npm)
- Docker e Docker Compose
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
│   │   ├── attempts/       # Modulo gestione tentativi
│   │   ├── questions/      # Modulo gestione domande
│   │   ├── sessions/       # Modulo gestione sessioni
│   │   ├── tests/          # Modulo gestione test
│   │   ├── prisma/         # Modulo Prisma ORM
│   │   └── common/         # Middleware e pipe condivisi
│   ├── test/               # Test end-to-end
│   ├── prisma/             # Schema database e seed
│   ├── mongo_db/           # Setup MongoDB Docker e dump database
│   └── coverage/           # Report copertura test
├── frontend/               # Frontend React
│   ├── src/                # Codice sorgente
│   │   ├── components/     # 11+ componenti riutilizzabili (AnswerOption, ErrorDisplay, etc.)
│   │   ├── pages/          # Pagine principali (HomePage, TestPage, ResultPage, NotFound)
│   │   ├── services/       # Servizi API (api.service.ts)
│   │   ├── store/          # State management Zustand (useStore.ts)
│   │   ├── schemas/        # Validazione Zod (validation.schemas.ts)
│   │   └── interfaces/     # TypeScript interfaces (api.interfaces.ts)
│   ├── public/             # Asset statici
└── README.md
```

## 🛠️ Stack Tecnologico

### Backend

- **Framework**: NestJS 11.0.1
- **Linguaggio**: TypeScript
- **Database**: MongoDB 5.0.3
- **ORM**: Prisma 6.18.0
- **Validazione**: class-validator, class-transformer
- **Testing**: Jest 30.0.0
- **E2E Testing**: Supertest 7.0.0

#### Moduli Backend

- **TestsModule**: Gestione quiz e test
- **QuestionsModule**: Gestione domande e opzioni di risposta
- **SessionsModule**: Creazione e gestione sessioni utente
- **AttemptsModule**: Gestione tentativi e invio risposte
- **PrismaModule**: Integrazione database con Prisma ORM
- **Common**: Middleware di ritardo e pipe per validazione ObjectId

### Frontend

- **Framework**: React 19.2.0
- **Linguaggio**: TypeScript
- **Routing**: React Router 7.9.4
- **Client HTTP**: Axios 1.12.2
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack React Query 5.90.5
- **Validazione**: Zod 4.1.12

### Database

- **Database**: MongoDB 5.0.3 (Single Replica Set)
- **Container**: Docker con docker compose
- **Autenticazione**: Abilitata con credenziali root/root
- **Porta**: 27017
- **Volume**: Dati persistenti con `mongo_data`

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

Un dump completo del database è disponibile in `backend/mongo_db/database-dump/` con file JSON per ogni collezione:

- **Test**: 6 quiz di test con titoli, descrizioni e metadati
- **Question**: 22 domande con opzioni a scelta multipla
- **AnswerOption**: Opzioni di risposta per ogni domanda
- **User**: 2 utenti di test
- **Attempt**: Tentativi di test completati
- **AttemptAnswer**: Risposte individuali alle domande

I dati possono essere importati manualmente o il database può essere popolato tramite lo script di seed Prisma (`npm run prisma:seed`).

## 🔧 Configurazione

### Variabili d'Ambiente Backend

Crea un file `.env` nella directory `backend/` con:

```bash
DATABASE_URL="mongodb://root:root@localhost:27017/coges-test-db?authSource=admin&directConnection=true&retryWrites=false"
PORT=3001  # Porta server (opzionale, default 3001)
```

### Variabili d'Ambiente Frontend

Crea un file `.env` nella directory `frontend/` con:

```bash
REACT_APP_API_URL=http://localhost:3001
```

**Nota**: Per la build di produzione, aggiorna `REACT_APP_API_URL` con l'URL del backend in produzione.

### Middleware di Ritardo (Solo Sviluppo)

⚠️ **Nota**: Il backend include un middleware che introduce un ritardo artificiale di 500ms su tutte le richieste API.

Questo middleware è stato aggiunto **esclusivamente a scopo didattico** per:

- Simulare condizioni di latenza di rete realistiche
- Visualizzare e testare le animazioni di caricamento dell'interfaccia
- Dimostrare la gestione degli stati di loading nell'applicazione

Il middleware si trova in `backend/src/common/middleware/delay.middleware.ts` e può essere facilmente disabilitato rimuovendo la sua registrazione in `backend/src/app.module.ts` per ottenere prestazioni complete in produzione.

## 📚 Endpoint API

### Test

- `GET /tests` - Ottenere tutti i test con conteggio domande
- `GET /tests/:id` - Ottenere test specifico per ID con tutte le domande

### Domande

- `GET /questions` - Ottenere tutte le domande
- `GET /questions/:id` - Ottenere domanda per ID con opzioni di risposta

### Sessioni

- `POST /sessions` - Creare nuova sessione test

### Tentativi

- `POST /attempts/:id/answer` - Inviare risposta a una domanda
- `POST /attempts/:id/complete` - Completare test e ottenere risultati

## 🎯 Caratteristiche Principali

### Sistema Quiz

- **Multi-domanda**: Supporto per quiz con domande multiple
- **Tempo reale**: Invio risposte in tempo reale
- **Risultati**: Calcolo automatico dei punteggi con statistiche dettagliate
- **Sessioni**: Gestione sessioni utente con state management Zustand
- **Validazione**: Validazione lato client (Zod) e server (class-validator)

### Interfaccia Utente

- **Responsive**: Design adattivo per tutti i dispositivi
- **Modulare**: Architettura modulare con 11+ componenti riutilizzabili specializzati
- **Intuitiva**: Interfaccia utente semplice e chiara con navigazione fluida
- **Accessibile**: Supporto per accessibilità web
- **Loading States**: Animazioni e feedback visivi per tutte le operazioni
- **Error Handling**: Gestione errori elegante con componente ErrorDisplay dedicato
- **Visual Feedback**: Barre di progresso animate, icone dinamiche e stati interattivi

### Pagine Frontend

1. **HomePage** (`/`): Selezione test e inserimento nome utente
2. **TestPage** (`/test`): Interfaccia per rispondere alle domande
3. **ResultPage** (`/result`): Visualizzazione risultati con statistiche
4. **NotFound** (`*`): Pagina 404 per route non valide

### Componenti Riutilizzabili

Il frontend è stato completamente modularizzato con componenti riutilizzabili e specializzati:

- **AnswerOption**: Opzione di risposta singola con radio button personalizzato e stato di selezione
- **ErrorDisplay**: Visualizzazione elegante di errori singoli o multipli con formattazione
- **NameInput**: Campo input validato per il nome utente con label e placeholder
- **ProgressBar**: Barra di progresso visiva con percentuale di completamento
- **QuestionCard**: Card completa per domanda con elenco di opzioni di risposta
- **QuestionHeader**: Header informativo con titolo test, utente e indicatore progresso
- **ResultIcon**: Icona dinamica di successo/fallimento (con soglia 60%) e messaggio
- **ScoreCard**: Card principale risultati con punteggio, percentuale e barra progresso animata
- **StatsGrid**: Griglia statistica con risposte corrette ed errate in card separate
- **TestSelector**: Dropdown selezione test con conteggio domande e descrizione dinamica
- **UserInfoCard**: Card informativa con nome utente e titolo test completato

Inoltre, l'applicazione include **custom CSS classes** per buttons, forms, alerts, cards e animazioni.

### Architettura

- **Modulare**: Architettura modulare e scalabile basata su NestJS
- **API REST**: API RESTful ben strutturate con validazione
- **Database**: Schema database ottimizzato con Prisma ORM
- **Type Safety**: TypeScript end-to-end per maggiore sicurezza

## 🧪 Testing

Il progetto include una suite completa di test per garantire la qualità del codice:

### Test Implementati

#### Backend
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
    ├── tests.e2e-spec.ts           # End-to-end test API Tests
    └── questions.e2e-spec.ts       # End-to-end test API Questions
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
npm run start:dev        # Avvia in modalità watch
npm run start:debug      # Avvia in modalità debug

# Build
npm run build            # Compila il progetto

# Produzione
npm run start:prod       # Avvia l'app compilata

# Database
npm run prisma:generate  # Genera Prisma Client
npm run prisma:push      # Sincronizza schema con database
npm run prisma:seed      # Popola database con dati iniziali

# Testing
npm test                 # Esegui tutti i test
npm run test:cov         # Test con coverage
npm run test:watch       # Test in modalità watch
npm run test:debug       # Test in modalità debug
npm run test:e2e         # Test end-to-end

# Code Quality
npm run lint             # Esegui linting
npm run format           # Formatta il codice
```

### Frontend

```bash
# Sviluppo
npm start                # Avvia dev server su http://localhost:3000

# Build
npm run build            # Crea build ottimizzata per produzione
```

## 📝 File di Configurazione

### Backend

- **`nest-cli.json`**: Configurazione NestJS CLI
- **`tsconfig.json`**: Configurazione TypeScript
- **`eslint.config.mjs`**: Configurazione ESLint
- **`.prettierrc`**: Configurazione Prettier
- **`prisma/schema.prisma`**: Schema database Prisma
- **`.gitignore`**: File da ignorare in Git

### Frontend

- **`tsconfig.json`**: Configurazione TypeScript
- **`package.json`**: Dipendenze e script
- **`.gitignore`**: File da ignorare in Git

## 📈 Monitoraggio

### Metriche Importanti

- **Prestazioni API**: Tempo di risposta < 200ms (senza middleware di ritardo)
- **Utilizzo Database**: Connessioni attive MongoDB
- **Memoria**: Utilizzo RAM < 1GB
- **CPU**: Utilizzo < 50%

## 🚀 Deployment

### Preparazione per la Produzione

1. **Backend**:

   - Rimuovere o disabilitare il middleware di ritardo in `app.module.ts`
   - Configurare le variabili d'ambiente di produzione
   - Eseguire `npm run build` per compilare
   - Avviare con `npm run start:prod`

2. **Frontend**:

   - Aggiornare `REACT_APP_API_URL` con l'URL del backend in produzione
   - Eseguire `npm run build` per creare la build ottimizzata
   - Servire i file statici dalla cartella `build/`

3. **Database**:
   - Configurare MongoDB in produzione con credenziali sicure
   - Aggiornare `DATABASE_URL` con le credenziali di produzione
   - Eseguire `npm run prisma:push` per sincronizzare lo schema
   - Eseguire `npm run prisma:seed` per popolare i dati iniziali

## 📝 Note

- Il progetto è configurato per lo sviluppo locale
- Per la produzione, assicurarsi di configurare CORS appropriato nel backend
- Utilizzare variabili d'ambiente sicure per credenziali sensibili
- Il middleware di ritardo è solo per scopi dimostrativi
