import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStatement } from '../../store/user/userSlice';
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

function AccountStatement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accountStatement, totalStatements, statementLoading } = useSelector((state) => state.user);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [dispatch, pagination.current, pagination.pageSize]);

  const fetchData = (page, pageSize) => {
    dispatch(getUserStatement({ page, pageSize }));
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      total: totalStatements,
    });
  };

  const getAmountStyle = (before, after) => {
    if (after > before) return { color: 'green', fontWeight: 500 };
    if (after < before) return { color: 'red', fontWeight: 500 };
    return {};
  };

  const typeLabelMap = {
    bonus: 'Bonus',
    referral_bonus: 'Referral Earn',
    bet: 'Bet Placed',
    win: 'Bet Win',
    deposit: 'Deposit Amount',
    withdraw_request: 'Withdraw Req.',
    withdraw_reject: 'Reject With.',
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => typeLabelMap[text] || text,
      ellipsis: true,
      width: 120,
    },
    {
      title: 'Before bal.',
      dataIndex: 'walletBefore',
      key: 'walletBefore',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={getAmountStyle(record.walletBefore, record.walletAfter)}>
          ₹{amount}
        </span>
      ),
      ellipsis: true,
      width: 100,
    },
    {
      title: 'After bal.',
      dataIndex: 'walletAfter',
      key: 'walletAfter',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Game ID',
      dataIndex: 'gameId',
      key: 'gameId',
      render: (text) => text || '-',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Card',
      dataIndex: 'card',
      key: 'card',
      render: (text) => (text ? text.toLowerCase() : '-'),
      ellipsis: true,
      width: 100,
    },
  ];

  const handleBack = () => navigate(-1);

  return (
    <div className="bg-blue" style={{ padding: 10, height: '100vh' }}>
      <button style={{ backgroundColor: '#ffffff1a' }} type="submit" className=" my-2 btn text-white p-0 px-1" onClick={handleBack}>
        <i class="bi bi-arrow-left-short h1"></i>
      </button>
      <Typography.Title className="mb-4" level={3} style={{ textAlign: 'center', color: '#fff' }}>
        Account Statement
      </Typography.Title>

      <Table
        columns={columns}
        dataSource={accountStatement}
        rowKey={(record, index) => index}
        loading={statementLoading}
        size="small"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalStatements,
        }}
        onChange={handleTableChange}
        scroll={{ y: 400 }}
      />
    </div>
  );
}

export default AccountStatement;
