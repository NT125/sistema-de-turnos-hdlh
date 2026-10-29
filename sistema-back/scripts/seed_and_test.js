const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../variables.env') });

const Medicamento = require('../models/Medicamento');
const ComprobanteFarmacia = require('../models/ComprobanteFarmacia');
const Paciente = require('../models/Paciente');

async function run() {
  try {
    console.log('Conectando a MongoDB:', process.env.DB_MONGO ? 'URI encontrada' : 'NO URI');
    await mongoose.connect(process.env.DB_MONGO);
    console.log('Conexión a MongoDB exitosa!');

    // 1. Verificar paciente con DNI 43890377
    const pacienteAlan = await Paciente.findOne({ dni: 43890377 });
    console.log('Paciente Alan (43890377):', pacienteAlan ? pacienteAlan.nombre : 'No encontrado con dni numerico');
    if (!pacienteAlan) {
      // Buscar por string o parcial
      const cualquierAlan = await Paciente.findOne({ nombre: { $regex: 'Alan', $options: 'i' } });
      console.log('Buscar por nombre Alan:', cualquierAlan ? `${cualquierAlan.nombre} - DNI: ${cualquierAlan.dni}` : 'No encontrado');
    }

    // 2. Sembrar los 138 medicamentos
    const jsonPath = path.join(__dirname, '../data/medicamentos.json');
    const medicamentosJson = require(jsonPath);
    console.log(`Leídos ${medicamentosJson.length} medicamentos del archivo JSON.`);

    // Eliminar previos o upsert
    let insertados = 0;
    let actualizados = 0;

    for (const med of medicamentosJson) {
      const itemNum = typeof med.item === 'string' ? parseInt(med.item, 10) : med.item;
      const res = await Medicamento.findOneAndUpdate(
        { item: itemNum, nombre: med.nombre },
        {
          item: itemNum,
          nombre: med.nombre,
          precio: med.precio,
          precioTexto: med.precioTexto,
          activo: true
        },
        { upsert: true, new: true }
      );
      if (res) insertados++;
    }

    const totalEnDb = await Medicamento.countDocuments();
    console.log(`Medicamentos en BD: ${totalEnDb} medicamentos verificados y actualizados.`);

    // 3. Crear comprobante de prueba en la BD
    const countComp = await ComprobanteFarmacia.countDocuments();
    const numComp = `REC-${(countComp + 1).toString().padStart(6, '0')}`;

    // Medicamentos de prueba del catálogo real
    // 1: AC. ACETIL SALICILICO 100 MG COMP. ($37.41)
    // 29: AMOXICILINA 500 MG COMP ($179.40)
    // 178: IBUPROFENO 400 MG COMP ($63.25)
    const itemsPrueba = [
      {
        item: 1,
        medicamento: 'AC. ACETIL SALICILICO 100 MG COMP.',
        cantidad: 2,
        precioUnitario: 37.41,
        subtotal: 74.82,
        porcentajeCobro: 30,
        importeCobrar: 22.45
      },
      {
        item: 29,
        medicamento: 'AMOXICILINA 500 MG COMP',
        cantidad: 1,
        precioUnitario: 179.40,
        subtotal: 179.40,
        porcentajeCobro: 30,
        importeCobrar: 53.82
      },
      {
        item: 178,
        medicamento: 'IBUPROFENO 400 MG COMP',
        cantidad: 3,
        precioUnitario: 63.25,
        subtotal: 189.75,
        porcentajeCobro: 30,
        importeCobrar: 56.93
      }
    ];

    const subtotalGeneral = Number(itemsPrueba.reduce((acc, it) => acc + it.subtotal, 0).toFixed(2));
    const totalACobrar = Number(itemsPrueba.reduce((acc, it) => acc + it.importeCobrar, 0).toFixed(2));

    const comprobantePrueba = new ComprobanteFarmacia({
      numeroComprobante: numComp,
      fecha: new Date(),
      paciente: pacienteAlan ? pacienteAlan.nombre : 'Alan Martinez',
      dni: '43890377',
      numeroCarnet: 'C-04389',
      tipoCarnet: 'Carnet 2',
      porcentajeCobro: 30,
      observaciones: 'Comprobante de prueba del sistema de farmacia',
      items: itemsPrueba,
      subtotalGeneral: subtotalGeneral,
      totalACobrar: totalACobrar,
      usuarioEmisor: 'Administrador'
    });

    await comprobantePrueba.save();
    console.log(`Comprobante de prueba guardado exitosamente con ID: ${comprobantePrueba._id} y número: ${comprobantePrueba.numeroComprobante}`);

    console.log('Operaciones en base de datos completadas con éxito!');
  } catch (err) {
    console.error('Error durante la ejecución del script:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
