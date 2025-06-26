import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../components/Services/Api/Api';
import style from '../EditParadas/styled.module.css';
import Justificativa from '../Justificativa/Index';

const EditarParada = () => {
  const { paradasId: IdParada } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paradaId: 0,
    sbId: 0,
    local: '',
    usuarioResponsavel: '',
    dataInicio: '',
    dataFim: '',
    idTrem: 0,
    tempo: 0,
    programacao: ''
  });

  const [resultado, setResultado] = useState({
    tempo: '',
    horasDecimal: '',
    horasFormatado: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParada = async () => {
      try {
        const { data } = await api.get(`/api/Paradas/${IdParada}`);
        setFormData({
          paradaId: data.paradaId || IdParada,
          sbId: data.sbId || 0,
          local: data.local || '',
          usuarioResponsavel: data.usuarioResponsavel || '',
          dataInicio: data.dataInicio || '',
          dataFim: data.dataFim || '',
          idTrem: data.idTrem || 0,
          tempo: data.tempo || 0,
          programacao: data.programacao || ''
        });
      } catch (err) {
        setError('Erro ao buscar dados da parada. ' + err.message);
      }
    };

    if (IdParada) fetchParada();
  }, [IdParada]);

  useEffect(() => {
    const { dataInicio, dataFim } = formData;

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diff = fim - inicio;

      if (isNaN(diff) || diff < 0) {
        setResultado({
          tempo: '',
          horasDecimal: '',
          horasFormatado: ''
        });
        return;
      }

      const tempo = Math.floor(diff / 60000);
      const horasDecimal = (tempo / 60).toFixed(2);
      const horasInt = Math.floor(tempo / 60);
      const minutosRest = tempo % 60;
      const horasFormatado = `${String(horasInt).padStart(2, '0')}:${String(minutosRest).padStart(2, '0')}`;

      setResultado({ tempo: String(tempo), horasDecimal, horasFormatado });
    } else {
      setResultado({ tempo: '', horasDecimal: '', horasFormatado: '' });
    }
  }, [formData.dataInicio, formData.dataFim, formData]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { local, usuarioResponsavel, dataInicio, dataFim, sbId, idTrem, programacao } = formData;

    if (!local || !usuarioResponsavel || !dataInicio || !dataFim) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitted(true);

    try {
      const payload = {
        paradaId: parseInt(IdParada, 10),
        sbId: sbId || 0,
        local,
        usuarioResponsavel,
        DataInicio: formData.dataInicio,
        DataFim: formData.dataFim,
        idTrem: idTrem || 0,
        tempo: parseInt(resultado.tempo, 10) || 0,
        programacao: programacao || ''
      };

      const response = await api.put(`/api/Paradas/${IdParada}`, payload);

      alert(`Parada atualizada com sucesso: ${response.data.message || "OK"}`);
      // Redireciona para a página principal
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(`Erro ao atualizar a parada: ${err.response.data.message || err.message}`);
      } else {
        setError('Erro ao atualizar a parada. ' + err.message);
      }
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header_styles}>
        <div className={style.span_style}>
          <div className={style.accordion_style}>
            <h2>Editar a Parada</h2>
            {submitted && !error && <p className={style.success_message}>Registro enviado com sucesso!</p>}
            {error && <p className={style.error_message}>Erro: {error}</p>}
            <form onSubmit={handleSubmit}>
              <div className={style.label_style_0}>
                <div>
                  <label>Local:</label>
                  <input name="local" value={formData.local} onChange={handleChange} disabled />
                </div>
                <div>
                  <label>Responsável:</label>
                  <input name="usuarioResponsavel" value={formData.usuarioResponsavel} onChange={handleChange} disabled />
                </div>
                <div>
                  <label>Início da Parada:</label>
                  <input type="datetime-local" name="dataInicio" value={formData.dataInicio} onChange={handleChange} />
                </div>
                <div>
                  <label>Fim da Parada:</label>
                  <input type="datetime-local" name="dataFim" value={formData.dataFim} onChange={handleChange} />
                </div>
              </div>

              <div className={style.label_style_0}>
                <div>
                  <label>Total Parada (minutos):</label>
                  <input name="tempo" value={resultado.tempo} readOnly disabled />
                </div>
                {resultado.horasFormatado && (
                  <div>
                    <label>Total em Horas:</label>
                    <span>{resultado.horasFormatado}</span>
                  </div>
                )}
                <div>
                  
                  <button type="submit" className={style.btn_styles}>Editar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarParada;
