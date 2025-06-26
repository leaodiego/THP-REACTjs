import { useEffect, useState } from 'react';
import api from '../../Services/Api/Api';

const SelectAo = ({ Os, value, onChange }) => {
  const [aoList, setAoList] = useState([]);

  useEffect(() => {
    if (!Os) return;

    const fetchData = async () => {
      try {
        const { data } = await api.get(`api/Paradas/Area_Operacional?os=${Os}`);
        setAoList(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [Os]);

  return (
    <select value={value} onChange={onChange}>
      <option value="">Selecione</option>
      {aoList.map((ao) => {
        if (!ao.aoId) {
          console.error("Item sem ID:", ao);
          return null; // Caso o SBId esteja ausente, não renderiza esse item
        }

        return (
          <option key={ao.aoId} value={ao.aoId}>
            {ao.aoCodigo}
          </option>
        );
      })}
    </select>
  );
};

export default SelectAo;
