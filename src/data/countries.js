import { countries } from 'country-data';

export default countries.all
  .filter(country => country.countryCallingCodes[0] !== undefined)
  .filter(country => country.status !== 'deleted')
  .map(({ alpha2, name, countryCallingCodes, emoji }) => {
    return {
      name,
      emoji,
      countryCode: alpha2,
      phoneCode: countryCallingCodes[0].replace('+', ''),
      text: `${emoji} ${name} (${countryCallingCodes[0]})`,
    };
  });
