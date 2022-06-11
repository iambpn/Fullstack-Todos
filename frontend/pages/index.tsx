import type { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/layouts';
import { AuthContext } from '../store/AuthContext';
import Todos from '../components/todos';

const Home: NextPage = () => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth.isAuthenticated();
  return (
    <>
      {!isAuthenticated && (
        <div className={'flex justify-center py-[5rem] text-[40px] font-bold'}>
          Welcome to Todos.
        </div>
      )}
      {isAuthenticated && (
        <Layout>
          <Todos />
        </Layout>
      )}
    </>
  );
};

export default Home;
