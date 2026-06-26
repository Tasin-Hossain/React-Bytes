import { TOOLS as BASE_TOOLS } from '../../constants/Tools';
import { TOOL_COMPONENTS } from './toolComponents';


export const TOOLS = BASE_TOOLS.map(tool => ({
  ...tool,
  component: TOOL_COMPONENTS[tool.id] || null,
}));