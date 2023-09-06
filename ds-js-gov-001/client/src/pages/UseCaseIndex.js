import React from 'react';
import { Outlet } from 'react-router-dom';

// This page enables child pages to be displayed for use cases
// with multiple pages.
function UseCaseIndex() {
  return <Outlet />;
}

export default UseCaseIndex;
