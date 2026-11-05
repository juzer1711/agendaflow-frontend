import client, { unwrap } from './client';

// GET /api/customers -> filas con customerId, firstName, lastName, phone,
// whatsappPhone, email, notes, status, createdAt, updatedAt.
export const getCustomers = (page = 1, limit = 100) =>
  client.get('/api/customers', { params: { page, limit } }).then(unwrap);

// POST /api/customers -> { customerId }
// NOTA: el backend actual solo expone GET y POST para clientes; no hay
// PUT ni DELETE todavía, así que no se pueden editar ni eliminar desde aquí.
export const createCustomer = (payload) => client.post('/api/customers', payload).then(unwrap);
