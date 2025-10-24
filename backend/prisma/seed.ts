import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crea utenti di test
  await prisma.user.create({
    data: {
      name: 'mike',
    },
  });

  await prisma.user.create({
    data: {
      name: 'sara',
    },
  });

  // Crea test di esempio
  // =====================
  // TEST 1
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 1',
      description: 'Matematica e logica base',
      questions: {
        create: [
          {
            text: 'Quanto fa 9 × 7?',
            position: 1,
            options: {
              create: [
                { text: '63', isCorrect: true },
                { text: '72', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quale dei seguenti numeri è primo?',
            position: 2,
            options: {
              create: [
                { text: '8', isCorrect: false },
                { text: '13', isCorrect: true },
                { text: '15', isCorrect: false },
                { text: '21', isCorrect: false },
                { text: '27', isCorrect: false },
                { text: '33', isCorrect: false },
                { text: '49', isCorrect: false },
                { text: '51', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quanto fa 25 + 36?',
            position: 3,
            options: {
              create: [
                { text: '61', isCorrect: true },
                { text: '60', isCorrect: false },
                { text: '62', isCorrect: false },
                { text: '59', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quale figura ha 8 lati?',
            position: 4,
            options: {
              create: [
                { text: 'Triangolo', isCorrect: false },
                { text: 'Pentagono', isCorrect: false },
                { text: 'Ottagono', isCorrect: true },
                { text: 'Ettagono', isCorrect: false },
                { text: 'Esagono', isCorrect: false },
                { text: 'Quadrato', isCorrect: false },
                { text: 'Cerchio', isCorrect: false },
                { text: 'Rombo', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // =====================
  // TEST 2
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 2',
      description: 'Geografia e natura',
      questions: {
        create: [
          {
            text: 'Qual è la capitale della Spagna?',
            position: 1,
            options: {
              create: [
                { text: 'Madrid', isCorrect: true },
                { text: 'Barcellona', isCorrect: false },
                { text: 'Valencia', isCorrect: false },
                { text: 'Siviglia', isCorrect: false },
              ],
            },
          },
          {
            text: 'Qual è il mare tra l’Italia e la Grecia?',
            position: 2,
            options: {
              create: [
                { text: 'Mar Tirreno', isCorrect: false },
                { text: 'Mar Ionio', isCorrect: true },
                { text: 'Mar Adriatico', isCorrect: false },
                { text: 'Mar Egeo', isCorrect: false },
                { text: 'Mar Nero', isCorrect: false },
                { text: 'Oceano Atlantico', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quale continente ha il maggior numero di abitanti?',
            position: 3,
            options: {
              create: [
                { text: 'Asia', isCorrect: true },
                { text: 'Europa', isCorrect: false },
              ],
            },
          },
          {
            text: 'Qual è la capitale del Canada?',
            position: 4,
            options: {
              create: [
                { text: 'Toronto', isCorrect: false },
                { text: 'Vancouver', isCorrect: false },
                { text: 'Ottawa', isCorrect: true },
                { text: 'Montreal', isCorrect: false },
                { text: 'Calgary', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // =====================
  // TEST 3
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 3',
      description: 'Storia e cultura generale',
      questions: {
        create: [
          {
            text: 'Chi era Napoleone Bonaparte?',
            position: 1,
            options: {
              create: [
                { text: 'Un generale francese', isCorrect: true },
                { text: 'Un re inglese', isCorrect: false },
                { text: 'Un esploratore spagnolo', isCorrect: false },
                { text: 'Un imperatore romano', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quando cadde l’Impero Romano d’Occidente?',
            position: 2,
            options: {
              create: [
                { text: '476 d.C.', isCorrect: true },
                { text: '410 d.C.', isCorrect: false },
                { text: '500 d.C.', isCorrect: false },
                { text: '300 d.C.', isCorrect: false },
                { text: '1000 d.C.', isCorrect: false },
                { text: '1492 d.C.', isCorrect: false },
                { text: '700 d.C.', isCorrect: false },
              ],
            },
          },
          {
            text: 'Chi era Galileo Galilei?',
            position: 3,
            options: {
              create: [
                { text: 'Un astronomo italiano', isCorrect: true },
                { text: 'Un musicista tedesco', isCorrect: false },
                { text: 'Un poeta inglese', isCorrect: false },
                { text: 'Un generale francese', isCorrect: false },
                { text: 'Un esploratore portoghese', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // =====================
  // TEST 4
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 4',
      description: 'Scienze e biologia',
      questions: {
        create: [
          {
            text: 'Qual è la funzione dei polmoni?',
            position: 1,
            options: {
              create: [
                {
                  text: 'Assorbire ossigeno e rilasciare anidride carbonica',
                  isCorrect: true,
                },
                { text: 'Pompare sangue nel corpo', isCorrect: false },
                { text: 'Filtrare il sangue', isCorrect: false },
                { text: 'Produrre ormoni', isCorrect: false },
                { text: 'Digerire il cibo', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quale pianeta è conosciuto come “pianeta rosso”?',
            position: 2,
            options: {
              create: [
                { text: 'Venere', isCorrect: false },
                { text: 'Giove', isCorrect: false },
                { text: 'Marte', isCorrect: true },
                { text: 'Saturno', isCorrect: false },
                { text: 'Urano', isCorrect: false },
                { text: 'Mercurio', isCorrect: false },
                { text: 'Nettuno', isCorrect: false },
              ],
            },
          },
          {
            text: 'Qual è l’animale terrestre più grande?',
            position: 3,
            options: {
              create: [
                { text: 'Elefante africano', isCorrect: true },
                { text: 'Ippopotamo', isCorrect: false },
              ],
            },
          },
          {
            text: 'Quante fasi ha la Luna?',
            position: 4,
            options: {
              create: [
                { text: '4', isCorrect: true },
                { text: '6', isCorrect: false },
                { text: '8', isCorrect: false },
                { text: '3', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // =====================
  // TEST 5
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 5',
      description: 'Informatica e tecnologia',
      questions: {
        create: [
          {
            text: 'Chi è il fondatore di Apple?',
            position: 1,
            options: {
              create: [
                { text: 'Steve Jobs', isCorrect: true },
                { text: 'Bill Gates', isCorrect: false },
                { text: 'Elon Musk', isCorrect: false },
                { text: 'Jeff Bezos', isCorrect: false },
              ],
            },
          },
          {
            text: 'Che cos’è una CPU?',
            position: 2,
            options: {
              create: [
                {
                  text: 'L’unità centrale di elaborazione di un computer',
                  isCorrect: true,
                },
                { text: 'Un software antivirus', isCorrect: false },
                { text: 'Un componente grafico', isCorrect: false },
                { text: 'Una memoria esterna', isCorrect: false },
                { text: 'Una porta USB', isCorrect: false },
                {
                  text: 'Un tipo di linguaggio di programmazione',
                  isCorrect: false,
                },
              ],
            },
          },
          {
            text: 'Quale linguaggio è usato per creare app Android?',
            position: 3,
            options: {
              create: [
                { text: 'Java', isCorrect: false },
                { text: 'Python', isCorrect: false },
                { text: 'Swift', isCorrect: false },
                { text: 'C#', isCorrect: false },
                { text: 'Ruby', isCorrect: false },
                { text: 'Go', isCorrect: false },
                { text: 'Kotlin', isCorrect: true },
                { text: 'PHP', isCorrect: false },
                { text: 'Perl', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  // =====================
  // TEST 6
  // =====================
  await prisma.test.create({
    data: {
      title: 'Test 6',
      description: 'Arte, musica e letteratura',
      questions: {
        create: [
          {
            text: 'Chi ha scritto “Il piccolo principe”?',
            position: 1,
            options: {
              create: [
                { text: 'Antoine de Saint-Exupéry', isCorrect: true },
                { text: 'Victor Hugo', isCorrect: false },
                { text: 'Charles Baudelaire', isCorrect: false },
              ],
            },
          },
          {
            text: 'Chi ha dipinto “La Notte Stellata”?',
            position: 2,
            options: {
              create: [
                { text: 'Vincent van Gogh', isCorrect: true },
                { text: 'Claude Monet', isCorrect: false },
                { text: 'Pablo Picasso', isCorrect: false },
                { text: 'Salvador Dalí', isCorrect: false },
                { text: 'Leonardo da Vinci', isCorrect: false },
                { text: 'Caravaggio', isCorrect: false },
                { text: 'Rembrandt', isCorrect: false },
                { text: 'Renoir', isCorrect: false },
              ],
            },
          },
          {
            text: 'Qual è lo strumento musicale a corde pizzicate?',
            position: 3,
            options: {
              create: [
                { text: 'Chitarra', isCorrect: true },
                { text: 'Pianoforte', isCorrect: false },
                { text: 'Violino', isCorrect: false },
                { text: 'Flauto', isCorrect: false },
              ],
            },
          },
          {
            text: 'Chi ha composto “Il Lago dei Cigni”?',
            position: 4,
            options: {
              create: [
                { text: 'Pyotr Ilyich Tchaikovsky', isCorrect: true },
                { text: 'Beethoven', isCorrect: false },
                { text: 'Mozart', isCorrect: false },
                { text: 'Vivaldi', isCorrect: false },
                { text: 'Chopin', isCorrect: false },
                { text: 'Haydn', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Seed completato con successo!');
}

main()
  .catch((e) => console.error((e as Error).message))
  .finally(async () => {
    await prisma.$disconnect();
  });
