// import { lazy } from 'react';


// // const ShapeMagic = lazy(() => import('../shape-magic/ShapeMagic'));

// export const TOOL_COMPONENTS = {
//   // 'shape-magic': ShapeMagic,
// };

import { lazy } from 'react';

const ShapeMagic = lazy(() => import('../shape-magic/ShapeMagic'));

export const TOOL_COMPONENTS = {
  'shape-magic': ShapeMagic,
};