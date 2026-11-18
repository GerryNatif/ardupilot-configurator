#!/usr/bin/env python3
"""Hook pre-commit — rien de généré n'entre à l'index.

Refuse un commit qui ajoute ou modifie un fichier sous `dist/`, `.angular/`,
`node_modules/` ou `out-tsc/`.

─ Pourquoi ce contrôle existe ────────────────────────────────────────────────

Jusqu'au 2026-11-18, `.gitignore` ne contenait qu'une ligne (`node_modules`).
62 fichiers de `dist/` et 79 de `.angular/` étaient suivis, dont un cache binaire
de 4,7 Mo réécrit à chaque build. Conséquence : le `git status` d'ouverture de
session affichait huit lignes de bruit en permanence — et un `git status` qu'on ne
lit plus ne signale plus rien, y compris ce qu'il devait signaler.

Une ligne de `.gitignore` ne suffit pas à elle seule : elle est sans effet sur un
fichier DÉJÀ suivi, et `git add -A` après un build le ramène. Celui-ci est
mécanique.

─ Ce qu'il ne prétend PAS faire ──────────────────────────────────────────────

Il ne regarde que les chemins, pas le contenu : un artefact généré rangé ailleurs
passe. Les SUPPRESSIONS sont autorisées (`--diff-filter=ACMR` les exclut) — sans
quoi il refuserait le commit même qui retire ces fichiers du suivi.

Échappatoire : `git commit --no-verify`. Si ce hook se trompe, la bonne réponse
est de corriger `.gitignore` ou la liste ci-dessous, jamais de le contourner en
routine.
"""
import re
import subprocess
import sys

GENERE_RE = re.compile(r"^(dist|\.angular|node_modules|out-tsc)/")


def main():
    sortie = subprocess.run(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
        capture_output=True, text=True, check=True,
    ).stdout

    fautifs = [l for l in sortie.splitlines() if GENERE_RE.match(l)]
    if not fautifs:
        return 0

    sys.stderr.write("\n  ✗ Fichiers générés à l'index\n\n")
    for f in fautifs[:20]:
        sys.stderr.write(f"      {f}\n")
    if len(fautifs) > 20:
        sys.stderr.write(f"      … et {len(fautifs) - 20} autres\n")
    sys.stderr.write(
        "\n"
        "  `dist/`, `.angular/`, `node_modules/` et `out-tsc/` sont produits par le\n"
        "  build : ils ne se commitent pas (CLAUDE.md § Rien de généré ne se commite).\n"
        "\n"
        "  → git restore --staged <les chemins ci-dessus>\n"
        "    Si l'un est encore SUIVI : git rm -r --cached <dossier>\n"
        "\n"
        "  Exception : `git commit --no-verify` — à justifier dans le message.\n"
        "\n"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
