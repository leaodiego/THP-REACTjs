import { useEffect, useState, useCallback } from "react";
import ParadasTrem from "../Paradas/Index";
import { format } from 'date-fns';
import style from "../Trem/styled.module.css";
import api from "../Services/Api/Api";

const Trem = ({ service }) => {
  const [currentAccordion, setCurrentAccordion] = useState(null);
  const [os, setOs] = useState(null); // Dados da OS
  const [error, setError] = useState(null); // Para armazenar a mensagem de erro

  // Função para alternar o estado do accordion
  const toggleAccordion = useCallback(() => {
    setCurrentAccordion((prev) => (prev === service ? null : service));
  }, [service]);

  // Função para tentar buscar os dados novamente
  const fetchData = useCallback(async () => {
    if (!service) return;

    try {
      const { data } = await api.get(`api/Trem?NumOs=${service}`);
      setOs(data || {}); // Atualiza o estado de `os` com os dados ou um objeto vazio
      setError(null); // Limpa qualquer erro anterior
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar os dados do trem"); // Exibe mensagem de erro
      setOs(null); // Limpa os dados de `os` em caso de erro
    }
  }, [service]);

  // Chama a função `fetchData` quando o componente é montado ou o `service` mudar
  useEffect(() => {
    fetchData();
  }, [service, fetchData]);

  // Exibe mensagem de erro e botão para tentar novamente
  if (error) {
    return (
      <div className={style.container}>
        <p>{error}</p>
        <button className={style.btn_styles} onClick={fetchData}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Exibe mensagem de carregamento enquanto os dados estão sendo obtidos
  if (!os) {
    return <p>Carregando dados do trem...</p>;
  }
   const formatDate = (date) => (date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "Não informado");

  return (
    <div className={style.container}>
      <div className={style.header_style}>
        <div className={style.span_style}>
          <div className={style.accordion_style}>
            {[
              { label: "OS", value: os.numOs },
              { label: "Prefixo", value: os.prefixo },
              { label: "Ferrovia", value: os.ferrovia },
              { label: "Origem", value: os.origem },
              { label: "Destino", value: os.destino },
              { label: "Data Partida", value: formatDate(os.dataRealSaida) },
              { label: "Data Chegada", value: formatDate(os.dataRealchegada) }
            ].map(({ label, value }) => (
              <div className={style.label_style} key={label}>
                <label>{label}</label>
                <span className={style.spanAutoWidth}>{value || "Não informado"}</span>
              </div>
            ))}
            <button
              className={style.btn_styles}
              onClick={toggleAccordion}
              aria-expanded={currentAccordion !== null}
              aria-label={currentAccordion ? "Fechar paradas" : "Abrir paradas"}
            >
              {currentAccordion ? "Fechar Paradas" : "Ver Paradas"}
            </button>
          </div>
        </div>
      </div>
      {currentAccordion && <ParadasTrem service={service} />}
    </div>
  );
};

export default Trem;
