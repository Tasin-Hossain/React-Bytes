import { TOOLS as BASE_TOOLS } from '../../constants/Tools';
import { TOOL_COMPONENTS } from './toolComponents';

// BASE_TOOLS + lazy component merge
// নতুন tool add করলে এখানে কিছু করতে হবে না — toolComponents.js-এ add করলেই হবে
export const TOOLS = BASE_TOOLS.map(tool => ({
  ...tool,
  component: TOOL_COMPONENTS[tool.id] || null,
}));