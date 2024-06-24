import React from 'react';
import { Button, Table } from 'antd';

const columns = [
  {
    title: 'Offer ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Departure',
    dataIndex: 'departure',
    key: 'departure',
    render: (text, record) => (
      <span>{record.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || ''}</span>
    ),
  },
  {
    title: 'Arrival',
    dataIndex: 'arrival',
    key: 'arrival',
    render: (text, record) => (
      <span>{record.itineraries?.[record.itineraries.length - 1]?.segments?.[1]?.arrival?.iataCode || ''}</span>
    ),
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
    render: (text, record) => (
      <span>{record.itineraries?.reduce((acc, curr) => acc + parseInt(curr.duration.slice(2)), 0) || 0} hours</span>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => (
      <span>{record.price?.total} {record.price?.currency}</span>
    ),
  }, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Button type="primary" href={`/flight-booking/`}>Book</Button>
    ),
  },
];

const FlightOffersTable = ({ data }) => {
  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default FlightOffersTable;
