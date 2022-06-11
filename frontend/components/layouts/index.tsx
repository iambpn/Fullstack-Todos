import React from 'react';
import Sidebar from './Sidebar';

type props = {
  children: React.ReactNode;
};

export default function Layout({ children }: props) {
  return (
    <>
      <div className={'flex h-[calc(100vh-70px)]'}>
        <div className={'basis-[25%]'}>
          <Sidebar />
        </div>
        <div className={'basis-auto grow'}>{children}</div>
      </div>
    </>
  );
}
