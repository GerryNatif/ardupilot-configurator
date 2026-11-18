#!/usr/bin/env python3
"""Hook pre-commit — tout import relatif doit exister dans l'INDEX.

Refuse un commit qui laisse, dans un fichier TypeScript stagé, un `import` relatif
(`./…` ou `../…`) qui ne désigne aucun fichier du commit en train d'être écrit.

─ Pourquoi ce contrôle existe ────────────────────────────────────────────────

L-001. `tsconfig.app.json` EXCLUT les `*.spec.ts`, `tsconfig.spec.json` ne compile
QU'EUX : les deux commandes ne lisent pas les mêmes fichiers. Un import mort dans
un fichier de test laisse donc `npm run build` parfaitement vert, et fait taire la
suite ENTIÈRE — pas un test rouge, ZÉRO test, parce que `tsconfig.spec.json`
ramasse `src/**/*.spec.ts` d'un bloc et qu'une seule erreur les emporte tous.

Le 2026-11-18, deux fichiers de test traînaient des imports vers un dossier
`core/mavlink/services/` disparu depuis un rangement. Le dépôt a vécu plusieurs
commits avec une suite qui n'exécutait aucun test, pendant que trois specs
livrées déclaraient « npm test — expected: zéro régression ».

─ Ce qu'il ne prétend PAS faire ──────────────────────────────────────────────

Il vérifie l'EXISTENCE d'un fichier, pas qu'il exporte le symbole importé, et il
ignore les imports de paquets (`@angular/core`, `three`…) — leur résolution
dépend de `node_modules`, que l'index ne porte pas. Il ne remplace donc PAS
`npm test` : il attrape la faute qui rend `npm test` muet.

Il lit l'INDEX (`git ls-files --cached`), jamais l'arbre de travail : c'est le
contenu du commit qui doit se tenir, pas le dossier.

Échappatoire : `git commit --no-verify`.
"""
import os
import re
import subprocess
import sys

# `from '…'`, `import '…'`, `import('…')` — on ne garde que les chemins relatifs.
IMPORT_RE = re.compile(r"""(?:from|import)\s*\(?\s*['"](\.[^'"]*)['"]""")

# Suffixes que TypeScript essaie pour un chemin sans extension.
CANDIDATES = ("", ".ts", ".d.ts", ".json", "/index.ts", "/index.d.ts")


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def racine():
    return run(["git", "rev-parse", "--show-toplevel"]).strip()


def fichiers_stages():
    sortie = run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"])
    return [l for l in sortie.splitlines() if l.endswith(".ts")]


def chemins_de_l_index():
    return set(run(["git", "ls-files", "--cached"]).splitlines())


def contenu_stage(chemin):
    # Le contenu du COMMIT, pas celui du disque.
    return subprocess.run(
        ["git", "show", f":{chemin}"], capture_output=True, text=True, check=True
    ).stdout


def resout(depuis, cible, index):
    """Le chemin relatif `cible`, vu depuis le fichier `depuis`, est-il dans l'index ?"""
    base = os.path.normpath(os.path.join(os.path.dirname(depuis), cible))
    for suffixe in CANDIDATES:
        if (base + suffixe) in index:
            return True
    return False


def main():
    os.chdir(racine())

    index = chemins_de_l_index()
    morts = []

    for chemin in fichiers_stages():
        try:
            source = contenu_stage(chemin)
        except subprocess.CalledProcessError:
            continue
        for cible in IMPORT_RE.findall(source):
            if not resout(chemin, cible, index):
                morts.append((chemin, cible))

    if not morts:
        return 0

    sys.stderr.write("\n  ✗ Import relatif qui ne désigne aucun fichier du commit\n\n")
    for chemin, cible in morts:
        sys.stderr.write(f"      {chemin}\n          → '{cible}'\n")
    sys.stderr.write(
        "\n"
        "  Ces imports ne se résolvent pas. Si le fichier fautif est un `.spec.ts`,\n"
        "  `npm run build` restera VERT et `npm test` n'exécutera AUCUN test (L-001).\n"
        "\n"
        "  → Corrige le chemin, ou stage le fichier manquant, DANS ce commit.\n"
        "\n"
        "  Exception : `git commit --no-verify` — à justifier dans le message.\n"
        "\n"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
