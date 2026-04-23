import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";

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

export default function App() {
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

  const handleSubmit = async () => {
    const profilOption = PROFIL_OPTIONS.find((o) => o.value === profil);
    const noteIntervenant = profilOption?.stars || 0;
    
    // Extract demandeId from URL (e.g., /feedback/123)
    const urlParts = window.location.pathname.split("/");
    const demandeIdRaw = urlParts[urlParts.length - 1];
    const demandeId = parseInt(demandeIdRaw);

    if (isNaN(demandeId)) {
      toast.error("Identifiant de demande invalide.");
      return;
    }

    const payload = {
      demande: demandeId,
      note_intervenant: noteIntervenant,
      note_agence: agencyRating,
      commentaire: comment,
      opt_out: optOut,
      source: "client"
    };

    const API_BASE_URL = import.meta.env.VITE_API_URL || "https://agencemenage-api.up.railway.app";

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du feedback");
      }

      setSubmitted(true);
      toast.success("Merci ! Votre avis a bien été envoyé.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <Toaster position="top-center" />
      
      <div className="mx-auto w-full max-w-2xl">
        <Card className="shadow-lg border-none bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              Merci d'avoir fait confiance à Agence Ménage
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
              Votre avis est précieux et nous aide à améliorer la qualité de nos services.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Merci pour votre retour !
                </h2>
                <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                  Votre avis a bien été enregistré. Toute l'équipe vous remercie pour votre temps.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stepper header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Étape {step} sur {STEPS.length}</span>
                    <span className="text-primary">{STEPS[step - 1].title}</span>
                  </div>
                  <Progress value={progress} className="h-1.5 transition-all duration-500" />
                </div>  
     
                {/* Step 1 — Note du profil */}
                {step === 1 && (
                  <section className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <div>
                      <Label className="text-lg font-bold">Note du profil</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Évaluez l'intervenant qui a réalisé la prestation.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {PROFIL_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => setProfil(opt.value)}
                          className={cn(
                            "group flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5",
                            profil === opt.value 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-transparent bg-muted/30"
                          )}
                        >
                          <div className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300",
                            profil === opt.value ? "border-primary bg-primary scale-110" : "border-muted-foreground/30 bg-background"
                          )}>
                            {profil === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-3xl" aria-hidden>{opt.emoji}</span>
                          <div className="flex-1">
                            <div className="font-bold text-base">{opt.label}</div>
                            <div className="text-sm tracking-widest text-primary opacity-80">{"★".repeat(opt.stars)}<span className="text-muted-foreground/20">{"★".repeat(5-opt.stars)}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Step 2 — Note de l'agence */}
                {step === 2 && (
                  <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="text-center space-y-2">
                      <Label className="text-lg font-bold">Note de l'agence</Label>
                      <p className="text-sm text-muted-foreground text-center">
                        Évaluez la qualité globale de notre service client et gestion.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 p-10">
                      <StarRating
                        value={agencyRating}
                        onChange={setAgencyRating}
                        label="Note de l'agence"
                        size={48}
                      />
                      {agencyRating > 0 && (
                        <p className="text-sm font-medium text-primary animate-in fade-in duration-300">
                          Vous avez attribué {agencyRating} étoile{agencyRating > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {/* Step 3 — Commentaire */}
                {step === 3 && (
                  <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <Label htmlFor="comment" className="text-lg font-bold">Votre avis détaillé</Label>
                      <p className="text-sm text-muted-foreground">
                        Partagez votre expérience ou vos suggestions (facultatif).
                      </p>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ex: Prestation parfaite, intervenant très ponctuel..."
                        rows={6}
                        className="bg-background/50 resize-none rounded-xl focus:ring-primary/20"
                      />
                    </div>
                  </section>
                )}

                {/* Recaptcha/Opt-out */}
                <div className="flex items-start gap-3 rounded-xl bg-muted/20 p-4 border border-muted-foreground/10">
                  <Checkbox
                    id="opt-out"
                    checked={optOut}
                    onCheckedChange={(v) => setOptOut(v === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="opt-out" className="text-sm font-normal leading-relaxed cursor-pointer select-none">
                    <span className="font-bold text-foreground">Désinscription : </span>
                    Je ne souhaite plus recevoir de sollicitations pour donner mon avis.
                  </Label>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={step === 1}
                    className="px-6 hover:bg-muted"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                  </Button>
                  {step < STEPS.length ? (
                    <Button 
                      type="button" 
                      onClick={handleNext} 
                      disabled={!canNext}
                      className="px-8 shadow-md transition-all active:scale-95"
                    >
                      Suivant <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleSubmit}
                      className="px-10 shadow-lg transition-all active:scale-95 font-bold"
                    >
                      Envoyer mon avis <Check className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">
          © {new Date().getFullYear()} Agence Ménage — Service Qualité
        </p>
      </div>
    </main>
  );
}
