// Seal Generation and Download Manager
import { generateSealTemplate } from './sealGenerator.js';
import { PoseSerializer } from './poseSerializer.js';

export class SealManager {
  /**
   * Generate seal file and download it
   * @param {string} sealName - Name of the seal
   * @param {Object} bones - Bones object for pose capture
   */
  static generateSealFile(sealName, bones) {
    console.log('generateSealFile chamado');

    if (!sealName || !sealName.trim()) {
      alert('⚠️ Digite um nome (ex: Tiger, Dragon, Rat)');
      return;
    }

    try {
      console.log('Gerando pose...');
      const pose = PoseSerializer.getCurrentPose(bones);
      console.log('Pose gerada:', pose);

      console.log('Gerando template...');
      const template = generateSealTemplate(sealName, pose);
      console.log('Template gerado, tamanho:', template.length);

      // Download arquivo
      SealManager.downloadFile(sealName, template);

      // Copy to clipboard as backup
      navigator.clipboard.writeText(template).catch(() => { });

    } catch (err) {
      console.error('❌ Erro em generateSealFile:', err);
      alert('❌ Falha na geração: ' + err.message);
    }
  }

  /**
   * Download seal file
   * @param {string} sealName - Name of the seal
   * @param {string} content - File content (JavaScript code)
   */
  static downloadFile(sealName, content) {
    const capName = sealName.charAt(0).toUpperCase() + sealName.slice(1).toLowerCase();
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${capName}Seal.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`✅ ${capName}Seal.js baixado!\n\n📁 Mova para:\nAESIR/src/jutsus/seals/${capName}Seal.js`);
  }
}
