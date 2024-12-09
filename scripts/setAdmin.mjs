import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccount.json'), 'utf8')
);

// Inicializa o Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

// Função para atualizar o usuário como admin
async function setUserAsAdmin(email) {
  try {
    // Primeiro, encontra o usuário no Authentication
    const userRecord = await auth.getUserByEmail(email);
    console.log('Found user:', userRecord.uid);

    // Atualiza ou cria o documento do usuário no Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({
      email: email,
      type: 'admin',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`User ${email} successfully set as admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
}

// Executa a função
setUserAsAdmin('rogerio.sys@gmail.com');
