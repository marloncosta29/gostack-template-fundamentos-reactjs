/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';
import {
  Balance,
  Transaction,
  Transactions,
} from '../../interfaces/transactions.interface';

interface FormatedTransaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}
interface FormatedBalance {
  income: string;
  outcome: string;
  total: string;
}
function formatTransaction(t: Transaction): FormatedTransaction {
  return {
    id: t.id,
    title: t.title,
    value: t.value,
    formattedValue: `${t.type === 'outcome' ? '- ' : ''}${formatValue(
      t.value,
    )}`,
    formattedDate: new Date(t.created_at).toLocaleDateString(),
    type: t.type,
    category: { title: t.category.title },
    created_at: new Date(t.created_at),
  };
}
const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<FormatedTransaction[]>([]);
  const [balance, setBalance] = useState<FormatedBalance>(
    {} as FormatedBalance,
  );

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Transactions>('transactions');
      const formatedTransactions = response.data.transactions.map(t =>
        formatTransaction(t),
      );
      const formatedBalance: FormatedBalance = {
        income: formatValue(response.data.balance.income),
        outcome: formatValue(response.data.balance.outcome),
        total: formatValue(response.data.balance.total),
      };
      setTransactions(formatedTransactions);
      setBalance(formatedBalance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(t => (
                <tr>
                  <td className="title">{t.title}</td>
                  <td className={t.type}>{t.formattedValue}</td>
                  <td>{t.category.title}</td>
                  <td>{t.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
