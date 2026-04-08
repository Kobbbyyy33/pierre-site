# CV Studio Typographique

Site CV statique en HTML, CSS et JavaScript vanilla, pense pour un profil Product Manager avec une direction artistique editoriale tres typographique.

## Lancer le projet

Servez le dossier avec un serveur statique local. Par exemple :

```bash
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Structure

- `index.html` contient le contenu principal, les metadonnees SEO et les sections.
- `css/` regroupe le reset, les tokens, la typo, la mise en page, les composants et les animations.
- `js/` contient les modules de navigation, reveal, ticker, compteurs, filtres, formulaire et l'initialisation globale.
- `assets/img/` contient les visuels de demonstration.

## Personnaliser rapidement

Remplacez en priorite dans [`/Users/kobbby/DEV /Site Pierre/index.html`](/Users/kobbby/DEV%20/Site%20Pierre/index.html) :

- Le nom, l'email, le domaine et les liens LinkedIn / GitHub.
- Les experiences, chiffres cles et projets.
- L'URL Formspree dans le formulaire de contact.

Remplacez ensuite les images de demonstration :

- `assets/img/photo.webp`
- `assets/img/strip-1.webp` a `assets/img/strip-6.webp`
- `assets/img/projects/proj-1.webp` a `proj-4.webp`
- `assets/cv.pdf`

## Notes

- Les images fournies ici sont des placeholders generes localement pour permettre un rendu immediat.
- Le formulaire affiche un message d'aide tant que l'identifiant Formspree n'a pas ete renseigne.
- Le site reste sans dependance externe hors chargement Google Fonts.
