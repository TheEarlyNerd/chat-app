const fs = require('fs');
const svgClassNames = [];
let output = '';

fs.readdirSync('./').forEach(file => {
  if (!file.includes('svg')) {
    return;
  }

  const svgPath = `./${file}`;
  let svgName = file.replace(/([-_][a-z])/g, group => group.toUpperCase())
      svgName = svgName.replace(/-/g, '')
      svgName = svgName.replace('.svg', '') + 'Icon';
      svgName = svgName.charAt(0).toUpperCase() + svgName.slice(1);

  output += `import ${svgName} from '${svgPath}';\n`;

  svgClassNames.push(svgName);
});

output += '\nexport {\n';
svgClassNames.forEach(svgClassName => {
  output += `  ${svgClassName},\n`;
});
output += '};\n';

fs.writeFileSync('./index.js', output);
