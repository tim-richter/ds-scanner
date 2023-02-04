import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header.js';
import { HeaderLink } from '../components/Header/HeaderLink.js';

export const Default = () => (
  <>
    <Header>
      <HeaderLink to="/">Analytics</HeaderLink>
      <HeaderLink to="/components">Components</HeaderLink>
    </Header>

    <div className="h-[calc(100vh-64px)]">
      <Outlet />
    </div>
  </>
);
