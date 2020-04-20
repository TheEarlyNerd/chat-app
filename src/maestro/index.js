import { Maestro } from 'react-native-maestro';
import flowClasses from './flows';
import helperClasses from './helpers';
import managerClasses from './managers';

export default new Maestro({
  flowClasses,
  helperClasses,
  managerClasses,
});
