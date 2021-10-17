import { extendTheme } from '@chakra-ui/react';
import colors from './colors';
import components from './components';
import overrides from './overrides';

export const theme = extendTheme({ colors, components, overrides });
