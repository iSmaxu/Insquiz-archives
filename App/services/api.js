// services/api.js
export async function fetchRemoteQuestions() {
  const url = 'https://gist.githubusercontent.com/iSmaxu/6a53393c9a65d2985de466a5e359cbbd/raw/8bd5568f747e316e8434b4d28a488b88d2ae38f9/gistfile1.txt';

  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    // Validar estructura básica
    if (!data || typeof data !== 'object' || !data.lectura) {
      throw new Error('Formato JSON no válido o incompleto');
    }

    console.log('✅ Banco de preguntas cargado correctamente');
    return data;
  } catch (error) {
    console.warn('⚠️ Error al obtener banco remoto:', error.message);
    return null;
  }
}
