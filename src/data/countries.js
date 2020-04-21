import { countries } from 'country-data';

export default countries.all
  .filter(country => country.countryCallingCodes[0] !== undefined)
  .filter(country => country.status !== 'deleted')
  .map(({ alpha2, name, countryCallingCodes, emoji }) => {
    const callingCode = countryCallingCodes[0];

    return {
      name,
      emoji,
      countryCode: alpha2,
      phoneCode: callingCode.replace('+', '').replace(' ', ''),
      text: `${emoji} ${name} (${callingCode})`,
    };
  });
