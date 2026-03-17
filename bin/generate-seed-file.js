const fs = require('fs');
const path = require('path');

const seedDir = path.join(__dirname, '../', 'src', 'infra', 'db', 'seeds');

const files = fs.readdirSync(seedDir);
const count = files.length;
const newFileName = `000${count + 1}-${process.argv[2]}.ts`;
const newFilePath = path.join(seedDir, newFileName);

const fileContent = `import { TDBTransaction } from '../../../shared/types/seeder.types';

// Always use the transaction passed to you
export default async function main(tx: TDBTransaction) {
  // TODO: implement logic here
}
`;

fs.writeFileSync(newFilePath, fileContent);

console.log(`Created new seed file: ${newFileName}`);
