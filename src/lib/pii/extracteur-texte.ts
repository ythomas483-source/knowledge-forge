// ============================================================
// extracteur-texte.ts — conversion d'un fichier en texte brut
// Formats : PDF, DOCX, XLSX, PPTX, TXT, CSV, MD
// ============================================================

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Configuration du worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function extrairePDF(fichier: File): Promise<string> {
  const buffer = await fichier.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const contenu = await page.getTextContent();
    const textePage = contenu.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(textePage);
  }
  return pages.join('\n\n');
}

async function extraireDOCX(fichier: File): Promise<string> {
  const buffer = await fichier.arrayBuffer();
  const résultat = await mammoth.extractRawText({ arrayBuffer: buffer });
  return résultat.value;
}

async function extraireXLSX(fichier: File): Promise<string> {
  const buffer = await fichier.arrayBuffer();
  const classeur = XLSX.read(buffer, { type: 'array' });
  const feuilles: string[] = [];
  for (const nomFeuille of classeur.SheetNames) {
    const feuille = classeur.Sheets[nomFeuille];
    const lignes: string[][] = XLSX.utils.sheet_to_json(feuille, {
      header: 1,
      defval: '',
    });
    const texteFeuille = lignes.map(ligne => ligne.join('\t')).join('\n');
    feuilles.push(`[Feuille : ${nomFeuille}]\n${texteFeuille}`);
  }
  return feuilles.join('\n\n');
}

async function extrairePPTX(fichier: File): Promise<string> {
  const buffer = await fichier.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const slides: string[] = [];
  const fichierSlides = Object.keys(zip.files)
    .filter(nom => nom.match(/ppt\/slides\/slide\d+\.xml$/))
    .sort();
  for (const nomFichier of fichierSlides) {
    const contenuXML = await zip.files[nomFichier].async('string');
    const fragments = [...contenuXML.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)]
      .map(match => match[1])
      .filter(texte => texte.trim().length > 0);
    if (fragments.length > 0) {
      slides.push(fragments.join(' '));
    }
  }
  return slides.join('\n\n');
}

async function extraireTexteSimple(fichier: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = () => resolve(lecteur.result as string);
    lecteur.onerror = () => reject(new Error(`Impossible de lire le fichier : ${fichier.name}`));
    lecteur.readAsText(fichier, 'UTF-8');
  });
}

export const FORMATS_ACCEPTES = [
  '.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.csv', '.md',
] as const;

export const ACCEPT_INPUT_FILE = FORMATS_ACCEPTES.join(',');

export async function extraireTexte(fichier: File): Promise<string> {
  const nom = fichier.name.toLowerCase();
  if (nom.endsWith('.pdf'))  return extrairePDF(fichier);
  if (nom.endsWith('.docx')) return extraireDOCX(fichier);
  if (nom.endsWith('.xlsx')) return extraireXLSX(fichier);
  if (nom.endsWith('.pptx')) return extrairePPTX(fichier);
  if (nom.endsWith('.txt') || nom.endsWith('.csv') || nom.endsWith('.md')) {
    return extraireTexteSimple(fichier);
  }
  throw new Error(
    `Format non supporté : "${fichier.name}". Formats acceptés : ${FORMATS_ACCEPTES.join(', ')}`
  );
}
