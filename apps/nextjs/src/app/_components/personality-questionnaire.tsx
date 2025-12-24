"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface QuestionnaireData {
  // Turning of the Year spread (tarot-style)
  burdenCard?: string;
  burdenCardLabel?: string;
  leakCard?: string;
  leakCardLabel?: string;
  survivalSkillCard?: string;
  survivalSkillCardLabel?: string;
  shadowCostCard?: string;
  shadowCostCardLabel?: string;
  missingMedicineCard?: string;
  missingMedicineCardLabel?: string;
  helpWorksCard?: string;
  helpWorksCardLabel?: string;
  boundarySpellCard?: string;
  boundarySpellCardLabel?: string;
  northStarCard?: string;
  northStarCardLabel?: string;
  firstGateCard?: string;
  firstGateCardLabel?: string;
  emergingArchetypeCard?: string;
  emergingArchetypeCardLabel?: string;

  // Backwards-compatibility (legacy)
  yearStruggles?: string;
  yearStrugglesLabel?: string;
  yearWants?: string;
  yearWantsLabel?: string;

  // Big 5 traits
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  // MBTI-inspired
  intuitionVsSensing?: string;
  intuitionVsSensingLabel?: string;
  thinkingVsFeeling?: string;
  thinkingVsFeelingLabel?: string;
  // Life context
  pastExperiences?: string;
  pastExperiencesLabel?: string;
  currentChallenges?: string;
  currentChallengesLabel?: string;
  hopesAndDreams?: string;
  hopesAndDreamsLabel?: string;
  fearsAndWorries?: string;
  fearsAndWorriesLabel?: string;
  lifeArea?: string;
  lifeAreaLabel?: string;
}

interface PersonalityQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
  questions?: {
    id: string;
    text: string;
    options: string[];
    order: number;
    category: string | null;
  }[];
}

export function PersonalityQuestionnaire({
  onComplete,
  questions,
}: PersonalityQuestionnaireProps) {
  void questions;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const updateField = (
    field: keyof QuestionnaireData,
    value: number | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateChoice = (
    field: keyof QuestionnaireData,
    labelField: keyof QuestionnaireData,
  ) => {
    return (value: string, label: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        [labelField]: label,
      }));
    };
  };

  const orderedQuestions = [...(questions ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const turningQuestions = orderedQuestions.filter(
    (question) => question.category === "turning_of_year",
  );
  const deckQuestions =
    turningQuestions.length > 0 ? turningQuestions : orderedQuestions;
  const totalSteps = deckQuestions.length || 1;

  const questionFieldOrder: {
    field: keyof QuestionnaireData;
    labelField: keyof QuestionnaireData;
  }[] = [
    { field: "burdenCard", labelField: "burdenCardLabel" },
    { field: "leakCard", labelField: "leakCardLabel" },
    { field: "survivalSkillCard", labelField: "survivalSkillCardLabel" },
    { field: "shadowCostCard", labelField: "shadowCostCardLabel" },
    { field: "missingMedicineCard", labelField: "missingMedicineCardLabel" },
    { field: "helpWorksCard", labelField: "helpWorksCardLabel" },
    { field: "boundarySpellCard", labelField: "boundarySpellCardLabel" },
    { field: "northStarCard", labelField: "northStarCardLabel" },
    { field: "firstGateCard", labelField: "firstGateCardLabel" },
    {
      field: "emergingArchetypeCard",
      labelField: "emergingArchetypeCardLabel",
    },
  ];

  const iconByPrefix: Record<string, string> = {
    burden: "🧳",
    leak: "🏺",
    survival: "🛡️",
    shadow: "🪨",
    medicine: "🧙",
    help: "🗓️",
    boundary: "🗡️",
    north: "🧭",
    first: "🚪",
    archetype: "👑",
  };

  const toOption = (raw: string) => {
    const [value, title, description] = raw.split("|");
    const prefix = value?.split("_")[0] ?? "";
    return {
      value: value ?? raw,
      title: title ?? raw,
      description: description ?? "",
      icon: iconByPrefix[prefix] ?? "✦",
    };
  };

  const defaultTraits = {
    openness: 55,
    conscientiousness: 55,
    extraversion: 50,
    agreeableness: 65,
    neuroticism: 45,
  };

  const handleCardSelect = (value: string, label: string) => {
    const currentQuestion = deckQuestions[step - 1];
    const fieldConfig = questionFieldOrder[step - 1];
    if (!fieldConfig || isAnimating) return;

    updateChoice(fieldConfig.field, fieldConfig.labelField)(value, label);

    setIsAnimating(true);
    setTimeout(() => {
      if (step < totalSteps) {
        setStep((prev) => prev + 1);
      }
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f18] text-[#f8f4e9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c2534,transparent_55%)] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(216,180,118,0.2),transparent_45%)]" />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/30 bg-gradient-to-br from-[#1b2433] to-[#0c1018] shadow-lg shadow-amber-300/30">
                <span className="animate-[float_6s_ease-in-out_infinite] text-4xl">
                  🜄
                </span>
              </div>
            </div>
            <h1 className="font-ritual-display mb-4 bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-4xl font-bold text-transparent">
              Your Ritual Begins
            </h1>
            <p className="font-ritual-text text-amber-100/70">
              Step {step} of {totalSteps}: Reflect and discover
            </p>
          </div>

          <div className="mb-12">
            <div className="mb-2 flex justify-between">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`mx-1 h-2 flex-1 rounded-full transition-all ${
                    i + 1 <= step
                      ? "bg-gradient-to-r from-amber-200 to-amber-400"
                      : "bg-slate-700/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/20 bg-black/40 p-8 shadow-2xl backdrop-blur-lg">
            {deckQuestions.length === 0 && (
              <div className="space-y-6 text-center">
                <h2 className="font-ritual-display text-2xl text-amber-100">
                  The deck is empty
                </h2>
                <p className="font-ritual-text text-amber-100/70">
                  Add questions to the database to start the ritual.
                </p>
              </div>
            )}

            {deckQuestions.length > 0 &&
              (() => {
                const currentQuestion = deckQuestions[step - 1];
                const fieldConfig = questionFieldOrder[step - 1];
                const currentValue = fieldConfig
                  ? (formData[fieldConfig.field] as string)
                  : "";
                const parsedOptions = currentQuestion.options.map(toOption);

                return (
                  <div className="space-y-8">
                    <div className="mb-8 text-center">
                      <h2 className="font-ritual-display mb-4 bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-3xl font-semibold text-transparent">
                        🃏 Draw Your Card
                      </h2>
                      <p className="font-ritual-text text-amber-100/70">
                        Pick the card that feels loud. We're spotting patterns,
                        not judging.
                      </p>
                    </div>

                    <div className="relative min-h-[600px]">
                      <TarotDeck
                        label={currentQuestion.text}
                        options={parsedOptions}
                        value={currentValue}
                        isAnimating={isAnimating}
                        currentIndex={step}
                        total={totalSteps}
                        onChange={handleCardSelect}
                      />
                    </div>

                    <div className="mt-8 flex gap-4">
                      {step > 1 ? (
                        <button
                          onClick={() => {
                            if (!isAnimating) {
                              setStep((prev) => Math.max(1, prev - 1));
                            }
                          }}
                          disabled={isAnimating}
                          className="flex-1 rounded-xl bg-slate-700/70 py-4 font-semibold transition-all hover:bg-slate-600/80 disabled:opacity-50"
                        >
                          ← Back
                        </button>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <button
                        onClick={() => {
                          if (isAnimating) return;

                          if (step < totalSteps && currentValue) {
                            setIsAnimating(true);
                            setTimeout(() => {
                              setStep((prev) => prev + 1);
                              setIsAnimating(false);
                            }, 600);
                            return;
                          }

                          if (formData.burdenCard)
                            updateField("yearStruggles", formData.burdenCard);
                          if (formData.burdenCardLabel)
                            updateField(
                              "yearStrugglesLabel",
                              formData.burdenCardLabel,
                            );
                          if (formData.northStarCard)
                            updateField("yearWants", formData.northStarCard);
                          if (formData.northStarCardLabel)
                            updateField(
                              "yearWantsLabel",
                              formData.northStarCardLabel,
                            );

                          const completed = {
                            ...defaultTraits,
                            ...formData,
                          } as QuestionnaireData;
                          onComplete(completed);
                        }}
                        disabled={!fieldConfig || !currentValue || isAnimating}
                        className="flex-1 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 py-4 font-semibold text-[#15120b] shadow-lg shadow-amber-300/40 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {step < totalSteps
                          ? "Continue →"
                          : "Complete Your Journey ✨"}
                      </button>
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}

function TarotDeck({
  label,
  options,
  value,
  isAnimating,
  currentIndex: questionIndex,
  total: questionTotal,
  onChange,
}: {
  label: string;
  options: {
    value: string;
    title: string;
    description: string;
    icon: string;
  }[];
  value?: string;
  isAnimating: boolean;
  currentIndex: number;
  total: number;
  onChange: (value: string, label: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
  });
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const deckCards = Array.from({ length: 7 }, (_, index) => index);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedSnap(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    setIsRevealed(false);
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [label, emblaApi, options.length]);

  const handleReveal = () => {
    if (isAnimating) return;
    setIsRevealed(true);
  };

  const radius = 220;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-ritual-display text-xs uppercase tracking-[0.35em] text-amber-200/70">
          Choose 1 card · {questionIndex}/{questionTotal}
        </p>
        <h3 className="font-ritual-display text-2xl text-amber-100">
          {label}
        </h3>
        <p className="font-ritual-text text-amber-100/70">
          Navigate the deck and tap the center card to reveal.
        </p>
      </div>

      <div className="tarot-question-card">
        <div className="tarot-question-frame" />
        <div className={`tarot-question-inner ${isRevealed ? "" : "opacity-60"}`}>
          <div className="tarot-question-image">
            <div className="tarot-question-image-frame" />
            <div className="tarot-question-image-sigil">✦</div>
            <img
              src={`/mystical-tarot-card-.jpg?key=question-${questionIndex}&height=360&width=260&query=tarot card ${label}`}
              alt={label}
              className="tarot-question-image-photo"
            />
          </div>
          <p className="font-ritual-text text-amber-100/70">
            {isRevealed
              ? "Pick the option that fits this card."
              : "Select the center card below to reveal your question."}
          </p>
          <div className="tarot-question-options">
            {options.map((option) => {
              const isSelected = value === option.value;
              const labelValue = option.description
                ? `${option.title} — ${option.description}`
                : option.title;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value, labelValue)}
                  disabled={!isRevealed || isAnimating}
                  className={`tarot-option ${
                    isSelected ? "tarot-option-selected" : ""
                  }`}
                >
                  <span className="tarot-option-icon">{option.icon}</span>
                  <span className="tarot-option-title">{option.title}</span>
                  {option.description ? (
                    <span className="tarot-option-desc">
                      {option.description}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="tarot-embla">
        <div className="tarot-embla__viewport" ref={emblaRef}>
          <div className="tarot-embla__container">
            {deckCards.map((cardIndex) => {
              const totalCards = deckCards.length;
              let offset = cardIndex - selectedSnap;
              const half = totalCards / 2;
              if (offset > half) offset -= totalCards;
              if (offset < -half) offset += totalCards;

              const clamped = Math.max(-3, Math.min(3, offset));
              const rotate = clamped * 12;
              const angle = (clamped * 12 * Math.PI) / 180;
              const translateX = Math.sin(angle) * radius;
              const translateY = (1 - Math.cos(angle)) * radius;
              const scale = 1 - Math.abs(clamped) * 0.12;
              const opacity =
                Math.abs(offset) <= 3 ? 1 - Math.abs(clamped) * 0.2 : 0;
              const zIndex = 10 - Math.abs(clamped);
              const isCentered = clamped == 0;

              return (
                <button
                  key={cardIndex}
                  type="button"
                  onClick={() => {
                    if (!emblaApi) return;
                    if (!isCentered) {
                      emblaApi.scrollTo(cardIndex);
                      return;
                    }
                    handleReveal();
                  }}
                  className={`tarot-embla__slide ${
                    isCentered ? "is-centered" : ""
                  }`}
                  style={
                    {
                      transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      pointerEvents: Math.abs(offset) <= 3 ? "auto" : "none",
                    } as CSSProperties
                  }
                >
                  <div className="tarot-embla__card">
                    <div className="tarot-embla__card-inner" />
                    <div className="tarot-embla__card-star">✦</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
