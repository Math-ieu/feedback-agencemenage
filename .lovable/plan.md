
L'utilisateur veut ajouter un champ "Note Candidat" avec étoiles, en plus de la "Note de l'agence" déjà prévue. Je vais intégrer cette nouvelle note dans le formulaire d'avis.

## Plan : Formulaire d'avis "Agence Ménage"

Création d'un formulaire d'avis client sur la page d'accueil (`src/routes/index.tsx`), avec design épuré et professionnel par défaut (tons bleus sobres). Si vous préférez un autre style, dites-le moi.

### Contenu du formulaire

1. **En-tête**
   - Titre : « Merci d'avoir fait confiance à Agence Ménage »
   - Sous-texte : « Votre prestation est maintenant terminée. Nous espérons qu'elle s'est bien déroulée. Votre avis est précieux et nous aide à améliorer la qualité de nos services. »

2. **Satisfaction générale** — « Comment s'est passée votre expérience ? »
   - Boutons radio avec emojis : Très satisfait / Satisfait / Moyen / Insatisfait

3. **Votre avis** — Zone de texte libre (placeholder « Partagez votre expérience avec nous… »)

4. **Note de l'agence** — Système d'étoiles cliquables (1 à 5 ★)

5. **Note du candidat** *(nouveau)* — Système d'étoiles cliquables (1 à 5 ★)
   - Avec libellé explicatif : « Évaluez l'intervenant qui a réalisé la prestation »

6. **Option opt-out** — Case à cocher : « Je ne souhaite plus recevoir ce type de message »

7. **CTA** — Bouton « Envoyer mon avis »
   - Affiche un toast de confirmation à la soumission (pas de backend pour cette première version)

### Détails techniques

- Fichier modifié : `src/routes/index.tsx` (remplace le placeholder)
- Nouveau composant réutilisable : `src/components/StarRating.tsx` (étoiles interactives avec hover, accessible clavier)
- Composants shadcn utilisés : `Card`, `RadioGroup`, `Textarea`, `Checkbox`, `Button`, `Label`, `Sonner` (toasts)
- Icône étoile : `lucide-react` (`Star`)
- Métadonnées SEO via `head()` : titre + description en français
- État local React (`useState`) pour les deux notes, satisfaction, commentaire, opt-out
- Validation simple côté client : note de l'agence requise avant envoi
- Design : carte centrée, max-width ~640px, palette bleue sobre, responsive mobile

### Hors périmètre (à ajouter plus tard si besoin)
- Persistance des avis (Lovable Cloud)
- Envoi email à l'agence
- Page d'admin pour consulter les avis
