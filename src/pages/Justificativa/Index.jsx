import React, { useState } from 'react';

const motivoOptions = ["4CRUZAMENTO", "OUTRO"];
const grupoMotivoOptions = ["C. CONTR. OPERACION", "---- TODOS ----"];

function calculateMinutes(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return startDate && endDate && endDate > startDate ? Math.floor((endDate - startDate) / 60000) : 0;
}

export default function Justificativa() {
  const [totalMinutos, setTotalMinutos] = useState(74);
  const [motivos, setMotivos] = useState([
    { grupoMotivo: '', motivo: '', dataInicio: '', dataFim: '', minutos: 0, erro: false }
  ]);

  const handleChange = (index, field, value) => {
    const newMotivos = [...motivos];
    newMotivos[index][field] = value;

    if (field === 'dataInicio' || field === 'dataFim') {
      const minutos = calculateMinutes(newMotivos[index].dataInicio, newMotivos[index].dataFim);
      newMotivos[index].minutos = minutos;
      newMotivos[index].erro = minutos === 0 && newMotivos[index].dataInicio && newMotivos[index].dataFim;
    }

    setMotivos(newMotivos);
  };

  const handleBlur = (index) => {
    const sumMinutos = motivos.reduce((acc, m) => acc + Number(m.minutos || 0), 0);
    if (sumMinutos < totalMinutos && index === motivos.length - 1) {
      setMotivos([...motivos, { grupoMotivo: '', motivo: '', dataInicio: '', dataFim: '', minutos: 0, erro: false }]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Total de Minutos:</label>
        <input
          type="number"
          value={totalMinutos}
          onChange={(e) => setTotalMinutos(Number(e.target.value))}
          className="w-32 border border-gray-300 rounded p-2"
        />
      </div>

      {motivos.map((m, index) => (
        <div key={index} className="grid grid-cols-6 gap-2 items-center">
          <div className="font-bold text-center">{index + 1}</div>
            
          <input
            type="datetime-local"
            placeholder="Data Início"
            value={m.dataInicio}
            onChange={(e) => handleChange(index, 'dataInicio', e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
      
          <input
            type="datetime-local"
            placeholder="Data Fim"
            value={m.dataFim}
            onChange={(e) => handleChange(index, 'dataFim', e.target.value)}
            onBlur={() => handleBlur(index)}
            className="border border-gray-300 rounded p-2"
          />
      
          <select
            value={m.grupoMotivo}
            onChange={(e) => handleChange(index, 'grupoMotivo', e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Grupo Motivo</option>
            {grupoMotivoOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          
          <select
            value={m.motivo}
            onChange={(e) => handleChange(index, 'motivo', e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Motivo</option>
            {motivoOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          
          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Minutos"
              value={m.minutos}
              readOnly
              className={`border rounded p-2 ${m.erro ? 'border-red-500' : 'border-gray-300'}`}
            />
            {m.erro && <span className="text-red-500 text-sm">Data final deve ser posterior à data inicial</span>}
          </div>
        </div>
      ))}
      

      <div className="mt-4">Minutos restantes: {totalMinutos - motivos.reduce((acc, m) => acc + Number(m.minutos || 0), 0)}</div>
    </div>
  );
}