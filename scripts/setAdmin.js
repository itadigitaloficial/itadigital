import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializa o Firebase Admin
const serviceAccount = {
  "type": "service_account",
  "project_id": "itadigital-site",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Função para atualizar o usuário como admin
async function setUserAsAdmin(email) {
  try {
    // Busca o usuário pelo email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No user found with this email');
      return;
    }

    // Atualiza o primeiro documento encontrado
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      type: 'admin',
      updatedAt: new Date().toISOString()
    });

    console.log(`User ${email} successfully set as admin`);
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Executa a função
setUserAsAdmin('rogerio.sys@gmail.com');
