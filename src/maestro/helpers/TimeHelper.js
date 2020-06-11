import { Helper } from 'react-native-maestro';
import moment from 'moment';

moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'now',
    ss: '%ss',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1Y',
    yy: '%dY',
  },
});

export default class TimeHelper extends Helper {
  static get instanceKey() {
    return 'timeHelper';
  }

  fromNow(time) {
    return moment(time).fromNow(true);
  }
}
