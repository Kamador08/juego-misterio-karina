
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { nombre, personaje } = JSON.parse(event.body || '{}');

  if (!nombre || !personaje) {
    return { statusCode: 400, body: 'Faltan datos' };
  }

  const filePath = path.join('/tmp', 'asignados.json');

  let asignados = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      asignados = JSON.parse(fileContent || '[]');
    }
  } catch (err) {
    return { statusCode: 500, body: 'Error leyendo asignados' };
  }

  if (asignados.find(p => p.personaje === personaje)) {
    return { statusCode: 409, body: 'Personaje ya asignado' };
  }

  asignados.push({ nombre, personaje });

  try {
    fs.writeFileSync(filePath, JSON.stringify(asignados, null, 2), 'utf8');
  } catch (err) {
    return { statusCode: 500, body: 'Error guardando asignación' };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Guardado con éxito' })
  };
};
