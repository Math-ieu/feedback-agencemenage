import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Votre avis — Agence Ménage" },
      {
        name: "description",
        content:
          "Partagez votre expérience après votre prestation Agence Ménage en 3 étapes rapides.",
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

const PROFIL_OPTIONS = [
  { value: "tres-satisfaite", label: "Très satisfaite", emoji: "😍", stars: 5 },
  { value: "satisfaite", label: "Satisfaite", emoji: "🙂", stars: 4 },
  { value: "moyennement-satisfaite", label: "Moyennement satisfaite", emoji: "😐", stars: 3 },
  { value: "insatisfaite", label: "Insatisfaite", emoji: "🙁", stars: 2 },
  { value: "tres-insatisfaite", label: "Très insatisfaite", emoji: "😞", stars: 1 },
];

const STEPS = [
  { id: 1, title: "Note du profil" },
  { id: 2, title: "Note de l'agence" },
  { id: 3, title: "Votre commentaire" },
];

function Index() {
  const [step, setStep] = useState(1);
  const [profil, setProfil] = useState("");
  const [agencyRating, setAgencyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [optOut, setOptOut] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = (step / STEPS.length) * 100;
  const profilOption = PROFIL_OPTIONS.find((o) => o.value === profil);

  const canNext =
    (step === 1 && profil !== "") || (step === 2 && agencyRating > 0) || step === 3;

  const handleNext = () => {
    if (step === 1 && !profil) {
      toast.error("Merci de sélectionner une note pour le profil.");
      return;
    }
    if (step === 2 && agencyRating === 0) {
      toast.error("Merci d'attribuer une note à l'agence.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
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
              Votre avis est précieux et nous aide à améliorer la qualité de nos services.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-foreground">
                  Merci pour votre retour !
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Votre avis a bien été enregistré. Toute l'équipe vous remercie.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stepper header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>
                      Étape {step} sur {STEPS.length}
                    </span>
                    <span className="text-foreground">{STEPS[step - 1].title}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <ol className="flex items-center justify-between">
                    {STEPS.map((s) => {
                      const done = s.id < step;
                      const current = s.id === step;
                      return (
                        <li key={s.id} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                              done && "border-primary bg-primary text-primary-foreground",
                              current && "border-primary bg-background text-primary",
                              !done && !current && "border-input bg-background text-muted-foreground",
                            )}
                          >
                            {done ? <Check className="h-4 w-4" /> : s.id}
                          </div>
                          <span
                            className={cn(
                              "hidden text-xs sm:block",
                              current ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {s.title}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* Step 1 — Note du profil */}
                {step === 1 && (
                  <section className="space-y-3">
                    <div>
                      <Label className="text-base font-semibold">Note du profil</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Évaluez l'intervenant qui a réalisé la prestation.
                      </p>
                    </div>
                    <RadioGroup
                      value={profil}
                      onValueChange={setProfil}
                      className="grid grid-cols-1 gap-2"
                    >
                      {PROFIL_OPTIONS.map((opt) => (
                        <Label
                          key={opt.value}
                          htmlFor={`profil-${opt.value}`}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-background p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
                        >
                          <RadioGroupItem id={`profil-${opt.value}`} value={opt.value} />
                          <span className="text-2xl" aria-hidden>
                            {opt.emoji}
                          </span>
                          <span className="flex-1 text-sm font-medium">{opt.label}</span>
                          <span
                            className="text-sm tracking-wider text-primary"
                            aria-label={`${opt.stars} étoile${opt.stars > 1 ? "s" : ""}`}
                          >
                            {"★".repeat(opt.stars)}
                            <span className="text-muted-foreground">
                              {"★".repeat(5 - opt.stars)}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </section>
                )}

                {/* Step 2 — Note de l'agence */}
                {step === 2 && (
                  <section className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Note de l'agence</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Évaluez la qualité globale de notre service.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-input bg-muted/30 p-6">
                      <StarRating
                        value={agencyRating}
                        onChange={setAgencyRating}
                        label="Note de l'agence"
                        size={40}
                      />
                      {agencyRating > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {agencyRating} / 5 étoile{agencyRating > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {/* Step 3 — Commentaire + opt-out */}
                {step === 3 && (
                  <section className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="comment" className="text-base font-semibold">
                        Votre avis
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Partagez votre expérience (facultatif).
                      </p>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Partagez votre expérience avec nous..."
                        rows={5}
                      />
                    </div>

                    {/* Récap */}
                    <div className="rounded-lg border border-input bg-muted/30 p-4 text-sm">
                      <p className="mb-2 font-semibold text-foreground">Récapitulatif</p>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Note du profil</span>
                        <span className="text-foreground">
                          {profilOption?.emoji} {profilOption?.label} (
                          {profilOption?.stars}/5)
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between text-muted-foreground">
                        <span>Note de l'agence</span>
                        <span className="text-foreground">{agencyRating}/5 ★</span>
                      </div>
                    </div>

                  </section>
                )}

                {/* Option opt-out (toujours visible) */}
                <div className="flex items-start gap-3 rounded-md border border-input bg-muted/40 p-3">
                  <Checkbox
                    id="opt-out"
                    checked={optOut}
                    onCheckedChange={(v) => setOptOut(v === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="opt-out" className="text-sm font-normal leading-relaxed">
                    <span className="font-medium">Option : </span>
                    Je ne souhaite plus recevoir ce type de message.
                  </Label>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={step === 1}
                  >
                    <ArrowLeft /> Précédent
                  </Button>
                  {step < STEPS.length ? (
                    <Button type="button" onClick={handleNext} disabled={!canNext}>
                      Suivant <ArrowRight />
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleSubmit}>
                      Envoyer mon avis <Check />
                    </Button>
                  )}
                </div>
              </div>
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
