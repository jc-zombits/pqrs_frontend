'use client'

import React from 'react';
import { Modal, Table, Tag, Spin } from 'antd';
import axios from 'axios';

const RegistrosAbiertosModal = ({ visible, onClose, codSubsecretaria, tema }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: 'Tema',
      dataIndex: 'tema',
      key: 'tema',
      width: 200,
      fixed: 'left'
    },
    {
      title: 'Subsecretaría',
      dataIndex: 'subsecretaria',
      key: 'subsecretaria',
      width: 200
    },
    {
      title: 'Fecha Ingreso',
      dataIndex: 'fecha_de_ingreso',
      key: 'fecha_de_ingreso',
      render: date => date ? new Date(date).toLocaleDateString() : 'N/A',
      width: 150
    },
    {
      title: 'Fecha Límite',
      dataIndex: 'fecha_limite_de_respuesta',
      key: 'fecha_limite_de_respuesta',
      render: date => {
        const fechaLimite = date ? new Date(date) : null;
        const hoy = new Date();
        let color = 'default';
        
        if (fechaLimite) {
          if (fechaLimite < hoy) color = 'red';
          else if (fechaLimite < new Date(hoy.getTime() + 3 * 24 * 60 * 60 * 1000)) color = 'orange';
        }
        
        return (
          <Tag color={color}>
            {fechaLimite ? fechaLimite.toLocaleDateString() : 'N/A'}
          </Tag>
        );
      },
      width: 150
    },
    {
      title: 'Estado en Ruta',
      dataIndex: 'ultimo_estado_en_ruta',
      key: 'ultimo_estado_en_ruta',
      width: 200
    },
    {
      title: 'Oportunidad',
      dataIndex: 'oportunidad',
      key: 'oportunidad',
      render: text => <Tag color={text === 'OPORTUNO' ? 'green' : 'red'}>{text}</Tag>,
      width: 150
    }
  ];

  useEffect(() => {
    if (visible) {
      const fetchRegistrosAbiertos = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const params = {};
          if (codSubsecretaria) params.cod_subsecretaria = codSubsecretaria;
          if (tema) params.tema = tema;
          
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/registros-abiertos`,
            { params }
          );
          
          setRegistros(response.data.registros || []);
        } catch (err) {
          console.error('Error al obtener registros abiertos:', err);
          setError(err.response?.data?.error || 'Error al cargar los registros');
        } finally {
          setLoading(false);
        }
      };
      
      fetchRegistrosAbiertos();
    }
  }, [visible, codSubsecretaria, tema]);

  return (
    <Modal
      title={`Registros Abiertos (${registros.length})`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message="Error" description={error} showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={registros}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content', y: 500 }}
          rowKey={(record) => `${record.tema}-${record.fecha_de_ingreso}-${record.subsecretaria}`}
        />
      )}
    </Modal>
  );
};

export default RegistrosAbiertosModal;