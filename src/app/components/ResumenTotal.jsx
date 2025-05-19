'use client'

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Statistic, Alert, Select } from 'antd';
import axios from 'axios';
import RegistrosAbiertosModal from './RegistrosAbiertosModal';


const ResumenTotal = () => {

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getCardStyle = (index) => ({
    width: '100%',
    height: '100%',
    boxShadow: hoveredIndex === index ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer'
    });

    const [stats, setStats] = useState({
        total: 0,
        oportuno: 0,
        no_oportuno: 0,
        a_tiempo: 0,
        abiertas: 0,
        finalizadas: 0,
        periodo: 'Cargando...'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [codSubsecretaria, setCodSubsecretaria] = useState(null);
    const [subsecretarias, setSubsecretarias] = useState([]);
    const [tema, setTema] = useState(null);
    const [temas, setTemas] = useState([]);

    useEffect(() => {
        const fetchSubsecretarias = async () => {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/codigos-subsecretaria`);

            // Elimina duplicados pero manteniendo el objeto completo
            const codigosUnicosMap = new Map();
            resp.data.forEach(item => {
            codigosUnicosMap.set(item.cod_subsecretaria, item);
            });
            const codigosUnicos = Array.from(codigosUnicosMap.values());

            setSubsecretarias(codigosUnicos);
        } catch (err) {
            console.error('Error cargando subsecretarías:', err);
        }
        };
        fetchSubsecretarias();
    }, []);

    useEffect(() => {
    const fetchTemas = async () => {
        try {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/temas`);
        const temasUnicos = [...new Set(resp.data.map(item => item.tema))].filter(Boolean);
        setTemas(temasUnicos);
        } catch (err) {
        console.error('Error cargando temas:', err);
        }
    };
    fetchTemas();
    }, []);
        

    const fetchData = async () => {
        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/data/stats/resumen-total-tarjetas`;

            const params = {};
            if (codSubsecretaria) params.cod_subsecretaria = codSubsecretaria;
            if (tema) params.tema = tema;

            const response = await axios.get(url, { params, timeout: 10000 });
            console.log('Datos recibidos:', response.data)

            if (response.data) {
            setStats({
                total: response.data.total ?? 0,
                oportuno: response.data.oportuno ?? 0,
                no_oportuno: response.data.no_oportuno ?? 0,
                a_tiempo: response.data.a_tiempo ?? 0,
                abiertas: response.data.abiertas ?? 0,
                finalizadas: response.data.finalizadas ?? 0,
                periodo: response.data.periodo ?? 'Periodo no disponible'
            });
            }
        } catch (err) {
            console.error('Error al cargar stats:', err);
            setError(err.response?.data?.error || 'Error al cargar los datos. Intente recargar.');
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        fetchData();
    }, [codSubsecretaria, tema]);

    if (loading) {
        return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '200px'
        }}>
            <Spin size="large" />
        </div>
        );
    }

    if (error) {
        return (
        <Alert
            type="error"
            message="Error"
            description={error}
            showIcon
            style={{ margin: 20 }}
        />
        );
    }

    const cardData = [
        { title: "Total PQRS", value: stats.total, color: '#1890ff', onClick: null },
        { title: "Oportuno", value: stats.oportuno, color: '#52c41a', onClick: null },
        { title: "No Oportuno", value: stats.no_oportuno, color: '#f5222d', onClick: null },
        { title: "A Tiempo", value: stats.a_tiempo, color: '#faad14', onClick: null },
        { 
        title: "Abiertas 🎯", 
        value: stats.abiertas, 
        color: '#13c2c2',
        onClick: () => setModalVisible(true) 
        },
        { title: "Finalizadas", value: stats.finalizadas, color: '#722ed1', onClick: null }
    ];

  return (
    <div style={{ padding: '16px', width: '100%' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold', color: '#666' }}>
        Resumen PQRS || Enero a {stats.periodo}
      </h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
            <label style={{ marginRight: 8, color: '#0118D8', fontWeight: 'bold', fontSize: '16px' }}>Filtrar por Subsecretaría:</label>
            <Select
            allowClear
            placeholder="Seleccione una subsecretaría"
            style={{ width: '100%' }}
            value={codSubsecretaria}
            onChange={value => setCodSubsecretaria(value)}
            options={subsecretarias.map(item => ({
                value: item.cod_subsecretaria,
                label: `${item.cod_subsecretaria} - ${item.subsecretaria}`
            }))}
            />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
            <label style={{ marginRight: 8, color: '#0118D8', fontWeight: 'bold', fontSize: '16px' }}>Filtrar por Tema:</label>
            <Select
            allowClear
            placeholder="Seleccione un tema"
            style={{ width: '100%' }}
            value={tema}
            onChange={value => setTema(value)}
            options={temas.map(t => ({
                value: t,
                label: t
            }))}
            />
        </Col>
    </Row>

      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        {cardData.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4} style={{ display: 'flex' }}>
            <Card
                style={getCardStyle(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                >
                <Statistic
                    title={<span style={{ fontWeight: '500' }}>{item.title}</span>}
                    value={item.value}
                    valueStyle={{
                    color: item.color,
                    fontSize: '24px',
                    fontWeight: 'bold'
                    }}
                />
                </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ResumenTotal;