import client, { unwrap } from './client';

// POST /api/auth/login -> { success, data: { token, user: { userId, barberId, role, email } } }
export const login = async (email, password) => {
  const res = await client.post('/api/auth/login', { email, password });
  const data = unwrap(res);
  if (!data?.token) {
    throw new Error('La respuesta del servidor no incluyó un token');
  }
  return data; // { token, user }
};
