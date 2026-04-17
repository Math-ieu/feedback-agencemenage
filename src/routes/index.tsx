import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Votre avis — Agence Ménage" },
      {
        name: "description",
        content:
          "Partagez votre expérience après votre prestation Agence Ménage. Notez l'agence et l'intervenant en quelques secondes.",
      },
      { property: "og:title", content: "Votre avis — Agence Ménage" },
      {
        property: "og:description",
        content: "Donnez votre avis sur votre prestation Agence Ménage.",
      },
    ],
  }),
  component: Index,
});

const SATISFACTION_OPTIONS = [
  { value: "tres-satisfait", label: "Très satisfait", emoji: "😍" },
  { value: "satisfait", label: "Satisfait", emoji: "🙂" },
  { value: "moyen", label: "Moyen", emoji: "😐" },
  { value: "insatisfait", label: "Insatisfait", emoji: "😞" },
];

function Index() {
  const [satisfaction, setSatisfaction] = useState("");
  const [comment, setComment] = useState("");
  const [agencyRating, setAgencyRating] = useState(0);
  const [candidateRating, setCandidateRating] = useState(0);
  const [optOut, setOptOut] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agencyRating === 0) {
      toast.error("Merci d'attribuer une note à l'agence avant d'envoyer.");
      return;
    }
    setSubmitted(true);
    toast.success("Merci ! Votre avis a bien été envoyé.");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <Toaster position="top-center" />
      <div className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              Merci d'avoir fait confiance à Agence Ménage
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
              Votre prestation est maintenant terminée. Nous espérons qu'elle s'est bien déroulée.
              <br />
              Votre avis est précieux et nous aide à améliorer la qualité de nos services.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="py-8 text-center">
                <h2 className="text-xl font-semibold text-foreground">Merci pour votre retour !</h2>
                <p className="mt-2 text-muted-foreground">
                  Votre avis a bien été enregistré. Toute l'équipe d'Agence Ménage vous remercie.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Satisfaction */}
                <section className="space-y-3">
                  <h2 className="text-base font-semibold text-foreground">Satisfaction</h2>
                  <p className="text-sm text-muted-foreground">
                    Comment s'est passée votre expérience ?
                  </p>
                  <RadioGroup
                    value={satisfaction}
                    onValueChange={setSatisfaction}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
                    {SATISFACTION_OPTIONS.map((opt) => (
                      <Label
                        key={opt.value}
                        htmlFor={`sat-${opt.value}`}
                        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-input bg-background p-3 text-center transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
                      >
                        <span className="text-2xl" aria-hidden>
                          {opt.emoji}
                        </span>
                        <RadioGroupItem
                          id={`sat-${opt.value}`}
                          value={opt.value}
                          className="sr-only"
                        />
                        <span className="text-xs font-medium">{opt.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </section>

                {/* Avis */}
                <section className="space-y-2">
                  <Label htmlFor="comment" className="text-base font-semibold">
                    Votre avis
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec nous..."
                    rows={5}
                  />
                </section>

                {/* Note de l'agence */}
                <section className="space-y-2">
                  <Label className="text-base font-semibold">Note de l'agence</Label>
                  <p className="text-sm text-muted-foreground">
                    Évaluez la qualité globale de notre service.
                  </p>
                  <StarRating
                    value={agencyRating}
                    onChange={setAgencyRating}
                    label="Note de l'agence"
                  />
                </section>

                {/* Note du candidat */}
                <section className="space-y-2">
                  <Label className="text-base font-semibold">Note du candidat</Label>
                  <p className="text-sm text-muted-foreground">
                    Évaluez l'intervenant qui a réalisé la prestation.
                  </p>
                  <StarRating
                    value={candidateRating}
                    onChange={setCandidateRating}
                    label="Note du candidat"
                  />
                </section>

                {/* Opt-out */}
                <div className="flex items-start gap-3 rounded-md border border-input bg-muted/30 p-3">
                  <Checkbox
                    id="opt-out"
                    checked={optOut}
                    onCheckedChange={(v) => setOptOut(v === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="opt-out" className="text-sm font-normal leading-relaxed">
                    Je ne souhaite plus recevoir ce type de message.
                  </Label>
                </div>

                {/* CTA */}
                <Button type="submit" size="lg" className="w-full">
                  Envoyer mon avis
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Agence Ménage — Merci pour votre confiance.
        </p>
      </div>
    </main>
  );
}
