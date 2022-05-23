import React from 'react';
import Sidebar from './Sidebar';

type props = {
  children: React.ReactNode;
};

export default function Layout({ children }: props) {
  return (
    <>
      <div className={'flex'}>
        <div className={'basis-[30%]'}>
          <Sidebar />
        </div>
        <div className={'basis-auto grow'}>{children}</div>
      </div>
    </>
  );
}
