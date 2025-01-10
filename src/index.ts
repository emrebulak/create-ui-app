#!/usr/bin/env node
// Yukarıdaki shebang satırı, komut satırından çalıştırılabilmesi için gerekli.

import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

function main() {
  // Komut satırından proje adını alma
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Lütfen proje adı giriniz: create-bakanlik-app <project-name>");
    process.exit(1);
  }

  const projectName = args[0];
  const targetDir = path.join(process.cwd(), projectName);

  // 1) Hedef klasörü oluştur
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  } else {
    console.error(`Klasör zaten var: ${projectName}. Lütfen başka bir isim deneyin.`);
    process.exit(1);
  }

  // 2) Template klasöründen dosyaları kopyala
  const templateDir = path.join(__dirname, '..', 'template'); 
  copyFolderSync(templateDir, targetDir);

  // 3) package.json üzerinde proje adını güncelle (opsiyonel)
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = projectName;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  // 4) Kullanıcıya talimat ver
  console.log(`Proje klasörü oluşturuldu: ${projectName}`);
  console.log(`\n1) cd ${projectName}`);
  console.log("2) npm install veya yarn");
  console.log("3) npm run dev / npm run start  (nasıl ayarladıysanız)");
}

// Klasör kopyalama fonksiyonu (basit hali):
function copyFolderSync(from: string, to: string) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  for (const item of fs.readdirSync(from)) {
    const srcPath = path.join(from, item);
    const destPath = path.join(to, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Çağır:
main();
