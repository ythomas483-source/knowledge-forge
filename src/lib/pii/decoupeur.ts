// ============================================================
// decoupeur.ts — découpage du texte en morceaux analysables
// ============================================================

export interface Morceau {
  texte: string;
  offsetDebut: number;
}

export function découperTexte(
  texte: string,
  tailleMax = 300,
  chevauchement = 50
): Morceau[] {
  const regexMots = /\S+/g;
  const mots: { contenu: string; debut: number; fin: number }[] = [];

  let match;
  while ((match = regexMots.exec(texte)) !== null) {
    mots.push({
      contenu: match[0],
      debut: match.index,
      fin: match.index + match[0].length,
    });
  }

  if (mots.length === 0) return [];
  if (mots.length <= tailleMax) {
    return [{ texte, offsetDebut: 0 }];
  }

  const morceaux: Morceau[] = [];
  const pas = tailleMax - chevauchement;

  for (let i = 0; i < mots.length; i += pas) {
    const motsDuMorceau = mots.slice(i, i + tailleMax);
    if (motsDuMorceau.length === 0) break;

    const offsetDebut = motsDuMorceau[0].debut;
    const offsetFin = motsDuMorceau[motsDuMorceau.length - 1].fin;
    const texteMorceau = texte.slice(offsetDebut, offsetFin);

    morceaux.push({ texte: texteMorceau, offsetDebut });
  }

  return morceaux;
}
